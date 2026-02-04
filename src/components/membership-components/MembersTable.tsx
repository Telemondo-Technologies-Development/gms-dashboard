import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { useInvoices } from '@/hooks/usePaymentHistory'
import type { InvoiceTableDTOParsed } from '@/types/payment/paymentSchemas'
import { AddMemberDialog } from '@/components/membership-components/AddMemberDialog'
import type { MemberFormData } from '@/types/membership/memberSchemas'
import { readPersistedAuthToken } from '@/lib/auth-session'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Calendar, RefreshCw, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { Label } from '@/components/ui/label'
import { apiResponseListMemberTableSchema } from '@/types/membership/memberSchemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { memberQueryKeys, subscriptionAvailedQueryKeys } from '@/lib/QueryKeys'

interface Props {
  members: MemberFormData[]
  setMembers: Dispatch<SetStateAction<MemberFormData[]>>
  onSelectMember: (m: MemberFormData) => void
  pageSize?: number
}

const EMPTY_INVOICES: InvoiceTableDTOParsed[] = []

async function fetchMembersFromApi() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
  const url = `${base}/api/member`

  const token =
    typeof window !== 'undefined'
      ? (readPersistedAuthToken() ?? window.localStorage.getItem('auth_token'))
      : null
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  })

  const rawText = await response.text().catch(() => '')
  if (!response.ok) {
    throw new Error(`Failed to load members (${response.status}). ${rawText || 'Check server logs for details.'}`)
  }

  const parsedJson: unknown = rawText.trim() ? JSON.parse(rawText) : null
  const envelope = apiResponseListMemberTableSchema.parse(parsedJson)
  if (!envelope.success) {
    throw new Error(envelope.message ?? 'Failed to load members.')
  }
  return envelope.data
}

export default function MembersTable({ members, setMembers, onSelectMember, pageSize = 10 }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => {
    setPageIndex(0)
  }, [searchQuery])

  const membersQuery = useQuery({ queryKey: [memberQueryKeys.members], queryFn: fetchMembersFromApi })

  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
  const memberSubsQuery = useQuery<MemberSubscriptionTableDTO[]>({
    queryKey: [memberQueryKeys.memberSubscriptions],
    queryFn: async () => {
      try {
        const resp = await memberSubscriptionApi.getAllMemberSubscriptions({ pageable: { page: 0, size: 500 } })
        return resp.data ?? []
      } catch (err) {
        console.warn('Failed to load member subscriptions:', err)
        return []
      }
    },
    staleTime: 30000,
  })

  const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)
  const subscriptionAvailedQuery = useQuery<SubscriptionAvailedTableDTO[]>({
    queryKey: [subscriptionAvailedQueryKeys.subscriptionAvailed],
    queryFn: async () => {
      try {
        const resp = await subscriptionAvailedApi.getAllSubscriptionAvailed({ pageable: { page: 0, size: 500 } })
        return resp.data ?? []
      } catch (err) {
        console.warn('Failed to load subscription availed:', err)
        return []
      }
    },
    staleTime: 60000,
  })

  const invoicesQuery = useInvoices(0, 500)
  const invoices = invoicesQuery.data ?? EMPTY_INVOICES

  const mappedApiMembers = useMemo<MemberFormData[]>(() => {
    const apiMembers = membersQuery.data ?? []
    const subsByActor = new Map<string, MemberSubscriptionTableDTO>()
    for (const sub of (memberSubsQuery.data ?? [])) {
      const prev = sub.actorId ? subsByActor.get(sub.actorId) : undefined
      const shouldReplace = !prev || (prev.status !== 'ACTIVE' && sub.status === 'ACTIVE') ||
        (prev.startDate && sub.startDate && new Date(sub.startDate).getTime() > new Date(prev.startDate).getTime())
      if (sub.actorId && shouldReplace) subsByActor.set(sub.actorId, sub)
    }

    const availedById = new Map<string, SubscriptionAvailedTableDTO>()
    for (const s of (subscriptionAvailedQuery.data ?? [])) availedById.set(s.id, s)

    const invoicesByMemberSub = new Map<string, InvoiceTableDTOParsed[]>()
    for (const inv of invoices) {
      if (!inv.memberSubscriptionId) continue
      const arr = invoicesByMemberSub.get(inv.memberSubscriptionId) ?? []
      arr.push(inv)
      invoicesByMemberSub.set(inv.memberSubscriptionId, arr)
    }

    const formatCurrency = (amount: number, currency: string = 'PHP') =>
      new Intl.NumberFormat('en-PH', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount)

    return apiMembers.map((m) => {
      const fullName = [m.firstName, m.middleName, m.surname, m.suffix].filter(Boolean).join(' ')
      const sub = m.actorId ? subsByActor.get(m.actorId) : undefined
      const availed = sub?.subscriptionAvailedId ? availedById.get(sub.subscriptionAvailedId) : undefined
      const relatedInvoices = sub?.id ? (invoicesByMemberSub.get(sub.id) ?? []) : []
      const totalInvoiced = relatedInvoices.reduce((sum, i) => sum + (i.total ?? 0), 0)
      const totalPaid = relatedInvoices.filter((i) => i.status === 'PAID').reduce((sum, i) => sum + (i.total ?? 0), 0)
      const totalUnpaid = totalInvoiced - totalPaid
      return {
        id: m.id,
        actorId: m.actorId ?? null,
        members: [
          {
            id: m.id,
            firstName: m.firstName,
            middleName: m.middleName ?? null,
            surname: m.surname,
            suffix: m.suffix ?? null,
            status: m.status ?? null,
            name: fullName || 'Unknown',
            email: '',
            phone: '',
          },
        ],
        startDate: sub?.startDate ? new Date(sub.startDate) : undefined,
        endDate: sub?.endDate ? new Date(sub.endDate) : undefined,
        membershipType: availed?.name ?? 'Member',
        membershipDuration: availed ? `${availed.intervalCount} ${availed.intervals}` : '',
        billingAmount: availed ? String(availed.amount) : '',
        billingCycle: availed ? `${availed.intervalCount} ${availed.intervals}` : '',
        paymentMethod: '',
        membershipDetails: `Status: ${m.status}${availed ? ` • Plan: ${availed.name}` : ''}${relatedInvoices.length ? ` • Invoiced: ${formatCurrency(totalInvoiced)} • Paid: ${formatCurrency(totalPaid)} • Unpaid: ${formatCurrency(totalUnpaid)}` : ''}`,
        documents: [],
      }
    })
  }, [membersQuery.data, memberSubsQuery.data, subscriptionAvailedQuery.data, invoicesQuery.data])

  useEffect(() => {
    if (mappedApiMembers.length === 0) return

    setMembers((prev) => {
      if (prev.length === 0) return mappedApiMembers

      const serverById = new Map(mappedApiMembers.map((m) => [m.id, m]))
      const prevById = new Map(prev.map((m) => [m.id, m]))

      const merged: MemberFormData[] = []

      for (const localRow of prev) {
        if (!serverById.has(localRow.id)) merged.push(localRow)
      }

      for (const serverRow of mappedApiMembers) {
        const existing = prevById.get(serverRow.id)
        if (!existing) {
          merged.push(serverRow)
          continue
        }

        const mergedMembers = serverRow.members.map((sm, idx) => {
          const lm = existing.members[idx]
          return {
            ...sm,
            email: sm.email || lm?.email || '',
            phone: sm.phone || lm?.phone || '',
          }
        })

        merged.push({
          ...existing,
          ...serverRow,
          members: mergedMembers,
        })
      }

      return merged
    })
  }, [mappedApiMembers])

  const handleRefreshAll = () => {
    void membersQuery.refetch()
    void memberSubsQuery.refetch()
    void subscriptionAvailedQuery.refetch()
    void invoicesQuery.refetch()
  }

  const handleAddMember = (member: MemberFormData) => setMembers((prev) => [member, ...prev])

  const filteredMembers = members.filter(memberGroup =>
    memberGroup.members.some(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.phone ?? '').includes(searchQuery)
    ) ||
    memberGroup.membershipType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / pageSize))
  const pageItems = useMemo(() => {
    const start = pageIndex * pageSize
    return filteredMembers.slice(start, start + pageSize)
  }, [filteredMembers, pageIndex, pageSize])

  function getMembershipStatusBadge(endDate: Date | undefined) {
    if (!endDate) return <Badge variant="secondary">No Date</Badge>

    const today = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>
    } else if (daysUntilExpiry <= 7) {
      return <Badge variant="destructive">Expiring Soon</Badge>
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="outline">Ending Soon</Badge>
    }

    return <Badge variant="default">Active</Badge>
  }

  return (
    <Card className="flex flex-col max-h-screen">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          {members.length} {members.length === 1 ? 'member' : 'members'} registered
        </CardDescription>
      </CardHeader>

      {/* Scrollable content area */}
      <div className="flex-1 min-h-0 overflow-auto">
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone, or membership type..."
                className="pl-9 rounded-2xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRefreshAll}
                disabled={membersQuery.isFetching || memberSubsQuery.isFetching || subscriptionAvailedQuery.isFetching || invoicesQuery.isFetching}
              >
                {membersQuery.isFetching || memberSubsQuery.isFetching || subscriptionAvailedQuery.isFetching || invoicesQuery.isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <AddMemberDialog onAddMember={handleAddMember} />
            </div>
          </div>

          {membersQuery.error && (
            <div className="mb-4 text-sm text-destructive" role="alert">
              {membersQuery.error instanceof Error ? membersQuery.error.message : 'Failed to load members.'}
            </div>
          )}

          <Label className="text-xs text-muted-foreground mb-3">Tip: Click a row to view/edit full details and billing.</Label>

          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {members.length === 0
                  ? 'No members registered yet. Add your first member to get started.'
                  : 'No members found matching your search.'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Name</TableHead>
                    <TableHead className="w-[30%]">Duration</TableHead>
                    <TableHead className="w-[15%]">Status</TableHead>
                    <TableHead className="w-[15%]">Plan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((memberGroup) => (
                    <TableRow
                      key={memberGroup.id}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onSelectMember(memberGroup)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onSelectMember(memberGroup)
                        }
                      }}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          {memberGroup.members.map((member, idx) => (
                            <div key={`${member.id}-${idx}`} className="font-medium">
                              {member.name}
                              {memberGroup.members.length > 1 ? (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {idx + 1}/{memberGroup.members.length}
                                </Badge>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          {memberGroup.startDate ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(memberGroup.startDate, 'MMM dd, yyyy')}
                            </div>
                          ) : null}
                          {memberGroup.endDate ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(memberGroup.endDate, 'MMM dd, yyyy')}
                            </div>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell>{getMembershipStatusBadge(memberGroup.endDate)}</TableCell>
                      <TableCell>
                        <Badge>{memberGroup.membershipType || '—'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </div>

      {/* Fixed pagination footer */}
      <div className="border-t px-3 py-2 bg-background">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">Page {Math.min(pageIndex + 1, pageCount)} of {pageCount}</div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={pageIndex <= 0}>
              Prev
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))} disabled={pageIndex >= pageCount - 1}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
