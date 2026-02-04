import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { useInvoices } from '@/hooks/usePaymentHistory'
import type { InvoiceTableDTOParsed } from '@/types/payment/paymentSchemas'
import { readPersistedAuthToken, useAuthStore } from '@/lib/auth-session'
import { useForm } from 'react-hook-form'
import { AddMemberDialog } from '@/components/membership-components/AddMemberDialog'
import type {  MemberFormData, MemberInfo } from '@/types/membership/memberSchemas'
import { MemberDetailsDialog } from '@/components/membership-components/MemberDetailsDialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Calendar, QrCode, Fingerprint, UserCheck, Clock, RefreshCw, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { apiResponseListMemberTableSchema } from '@/types/membership/memberSchemas'
import type { AttendanceRecord } from '@/types/membership/memberSchemas'
import type { MembershipSearchForm } from '@/types/membership/memberSchemas'
import { Label } from '@/components/ui/label'


export const Route = createFileRoute('/dashboard/marketing/membership')({
  component: MembershipRoute,
})

const MEMBER_QUERY_KEYS = {
  members: 'members',
  memberSubscriptions: 'memberSubscriptions',
  subscriptionAvailed: 'subscriptionAvailed',
}

const EMPTY_INVOICES: InvoiceTableDTOParsed[] = []

function getDebugBillingFlag(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  if (params.get('debugBilling') === '1' || params.get('debug') === '1') return true
  return window.localStorage.getItem('debugBilling') === '1'
}

function safeErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined
  if (error instanceof Error) return error.message
  return String(error)
}

function hasPersistedToken(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return !!(readPersistedAuthToken() ?? window.localStorage.getItem('auth_token'))
  } catch {
    return false
  }
}


export async function fetchMembersFromApi() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const base = import.meta.env.DEV ? '' : apiBaseUrl || '';
  const url = `${base}/api/member`;

  const token = readPersistedAuthToken() ?? localStorage.getItem('auth_token');
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });


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

function MembershipRoute() {
  const [members, setMembers] = useState<MemberFormData[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedMemberGroupId, setSelectedMemberGroupId] = useState<string | null>(null)
  const [debugEnabled, setDebugEnabled] = useState<boolean>(() => getDebugBillingFlag())

  const storeToken = useAuthStore((state) => state.token)
  const storeTokenPresent = !!storeToken
  const persistedTokenPresent = hasPersistedToken()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!import.meta.env.DEV) return
    window.localStorage.setItem('debugBilling', debugEnabled ? '1' : '0')
  }, [debugEnabled])

  const form = useForm<MembershipSearchForm>({
    defaultValues: { searchQuery: '', attendanceSearch: '' },
  })

  const searchQuery = form.watch('searchQuery')
  const attendanceSearch = form.watch('attendanceSearch')

  const membersQuery = useQuery({
    queryKey: [MEMBER_QUERY_KEYS.members],
    queryFn: fetchMembersFromApi,
  })

  // Fetch all member subscriptions (for mapping subscription details to members)
  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
  const memberSubsQuery = useQuery<MemberSubscriptionTableDTO[]>({
    queryKey: [MEMBER_QUERY_KEYS.memberSubscriptions],
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

  // Fetch subscription availed to enrich names/intervals/amount
  const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)
  const subscriptionAvailedQuery = useQuery<SubscriptionAvailedTableDTO[]>({
    queryKey: [MEMBER_QUERY_KEYS.subscriptionAvailed],
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

  // Load invoices to compute per-member billing totals
  const invoicesQuery = useInvoices(0, 500)
  // IMPORTANT: don't use `?? []` here; it creates a new array each render while data is undefined,
  // which can trigger a render loop when combined with `useEffect(setMembers)`.
  const invoices = invoicesQuery.data ?? EMPTY_INVOICES

  useEffect(() => {
    if (!import.meta.env.DEV) return
    if (!debugEnabled) return

    console.debug('[billing:membership]', {
      storeTokenPresent,
      persistedTokenPresent,
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '(unset)',
      invoices: {
        status: invoicesQuery.status,
        fetchStatus: invoicesQuery.fetchStatus,
        count: invoices.length,
        error: safeErrorMessage(invoicesQuery.error),
        updatedAt: invoicesQuery.dataUpdatedAt,
        enabled: storeTokenPresent,
      },
      members: {
        status: membersQuery.status,
        fetchStatus: membersQuery.fetchStatus,
        count: (membersQuery.data ?? []).length,
        error: safeErrorMessage(membersQuery.error),
        updatedAt: membersQuery.dataUpdatedAt,
      },
      memberSubscriptions: {
        status: memberSubsQuery.status,
        fetchStatus: memberSubsQuery.fetchStatus,
        count: (memberSubsQuery.data ?? []).length,
        error: safeErrorMessage(memberSubsQuery.error),
        updatedAt: memberSubsQuery.dataUpdatedAt,
      },
      subscriptionAvailed: {
        status: subscriptionAvailedQuery.status,
        fetchStatus: subscriptionAvailedQuery.fetchStatus,
        count: (subscriptionAvailedQuery.data ?? []).length,
        error: safeErrorMessage(subscriptionAvailedQuery.error),
        updatedAt: subscriptionAvailedQuery.dataUpdatedAt,
      },
    })
  }, [
    debugEnabled,
    storeTokenPresent,
    persistedTokenPresent,
    invoices.length,
    invoicesQuery.status,
    invoicesQuery.fetchStatus,
    invoicesQuery.error,
    invoicesQuery.dataUpdatedAt,
    membersQuery.status,
    membersQuery.fetchStatus,
    membersQuery.error,
    membersQuery.dataUpdatedAt,
    membersQuery.data,
    memberSubsQuery.status,
    memberSubsQuery.fetchStatus,
    memberSubsQuery.error,
    memberSubsQuery.dataUpdatedAt,
    memberSubsQuery.data,
    subscriptionAvailedQuery.status,
    subscriptionAvailedQuery.fetchStatus,
    subscriptionAvailedQuery.error,
    subscriptionAvailedQuery.dataUpdatedAt,
    subscriptionAvailedQuery.data,
  ])

  const mappedApiMembers = useMemo<MemberFormData[]>(() => {
    const apiMembers = membersQuery.data ?? []
    const subsByActor = new Map<string, MemberSubscriptionTableDTO>()
    for (const sub of (memberSubsQuery.data ?? [])) {
      // Prefer ACTIVE; if multiple, pick the latest by startDate
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
    // Keep local table state synced with server-enriched data.
    // Without this, the table can render "empty" fields after refresh
    // (members arrive first; subscriptions/invoices arrive later).
    if (mappedApiMembers.length === 0) return

    setMembers((prev) => {
      if (prev.length === 0) return mappedApiMembers

      const serverById = new Map(mappedApiMembers.map((m) => [m.id, m]))
      const merged: MemberFormData[] = []

      // Preserve any local-only rows (not yet in server list)
      for (const localRow of prev) {
        if (!serverById.has(localRow.id)) merged.push(localRow)
      }

      // Server rows win for dates/status/billing (but keep local email/phone if set)
      for (const serverRow of mappedApiMembers) {
        const existing = prev.find((p) => p.id === serverRow.id)
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

  const handleAddMember = (member: MemberFormData) => {
    setMembers(prev => [member, ...prev])
  }

  const handleMarkAttendance = (
    memberGroup: MemberFormData,
    memberInfo: MemberInfo,
    method: 'qr' | 'fingerprint' | 'manual',
  ) => {
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      memberId: memberInfo.id,
      memberName: memberInfo.name,
      membershipType: memberGroup.membershipType,
      checkInTime: new Date(),
      checkInMethod: method,
    }
    setAttendanceRecords(prev => [newRecord, ...prev])
    form.setValue('attendanceSearch', '')
  }

  const filteredMembers = members.filter(memberGroup =>
    memberGroup.members.some(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.phone ?? '').includes(searchQuery)
    ) ||
    memberGroup.membershipType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedMemberGroup = selectedMemberGroupId
    ? members.find((m) => m.id === selectedMemberGroupId) ?? null
    : null

  const filteredAttendanceMembers = members.filter(memberGroup =>
    memberGroup.members.some(m =>
      m.name.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      (m.email ?? '').toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      (m.phone ?? '').includes(attendanceSearch)
    )
  )

  const todayAttendance = attendanceRecords.filter(record => {
    const today = new Date()
    const recordDate = new Date(record.checkInTime)
    return recordDate.toDateString() === today.toDateString()
  })

  const getMembershipStatusBadge = (endDate: Date | undefined) => {
    if (!endDate) return <Badge variant="secondary">No Date</Badge>
    
    const today = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>
    } else if (daysUntilExpiry <= 7) {
      return <Badge variant="destructive">Expiring Soon</Badge>
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="outline">Ending Soon</Badge>
    } else {
      return <Badge variant="default">Active</Badge>
    }
  }

  const getCheckInMethodIcon = (method: 'qr' | 'fingerprint' | 'manual') => {
    switch (method) {
      case 'qr':
        return <QrCode className="h-4 w-4 text-blue-500" />
      case 'fingerprint':
        return <Fingerprint className="h-4 w-4 text-purple-500" />
      case 'manual':
        return <UserCheck className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="space-y-6"> 
      <div className="flex items-center justify-between">
        <div>
        </div>
        <div className="flex items-center gap-2">
          {import.meta.env.DEV ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDebugEnabled((v) => !v)}
            >
              {debugEnabled ? 'Hide Debug' : 'Show Debug'}
            </Button>
          ) : null}
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

      {import.meta.env.DEV && debugEnabled ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Debug: Membership Billing Data</CardTitle>
            <CardDescription>
              This page uses invoices to compute billing totals per member subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-md border p-3">
                <div className="font-medium">Auth tokens</div>
                <div className="mt-1 text-muted-foreground">
                  auth store token present: <span className="font-mono">{String(storeTokenPresent)}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  persisted/localStorage token present: <span className="font-mono">{String(persistedTokenPresent)}</span>
                </div>
                {persistedTokenPresent && !storeTokenPresent ? (
                  <div className="mt-2 text-destructive">
                    Invoices hook is <span className="font-mono">enabled: !!token</span> from the auth store, so it won’t run even if the
                    members fetch succeeds using localStorage token.
                  </div>
                ) : null}
                <div className="mt-2 text-muted-foreground">
                  VITE_API_BASE_URL: <span className="font-mono">{import.meta.env.VITE_API_BASE_URL ?? '(unset)'}</span>
                </div>
              </div>

              <div className="rounded-md border p-3">
                <div className="font-medium">Invoices query</div>
                <div className="mt-1 text-muted-foreground">
                  status: <span className="font-mono">{invoicesQuery.status}</span> / fetch:{' '}
                  <span className="font-mono">{invoicesQuery.fetchStatus}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  count: <span className="font-mono">{invoices.length}</span>
                </div>
                {invoicesQuery.dataUpdatedAt ? (
                  <div className="mt-1 text-muted-foreground">
                    updated: <span className="font-mono">{format(new Date(invoicesQuery.dataUpdatedAt), 'PPpp')}</span>
                  </div>
                ) : null}
                {safeErrorMessage(invoicesQuery.error) ? (
                  <div className="mt-2 text-destructive">error: {safeErrorMessage(invoicesQuery.error)}</div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-md border p-3">
                <div className="font-medium">Members</div>
                <div className="mt-1 text-muted-foreground">
                  status: <span className="font-mono">{membersQuery.status}</span> / fetch:{' '}
                  <span className="font-mono">{membersQuery.fetchStatus}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  count: <span className="font-mono">{(membersQuery.data ?? []).length}</span>
                </div>
                {safeErrorMessage(membersQuery.error) ? (
                  <div className="mt-2 text-destructive">error: {safeErrorMessage(membersQuery.error)}</div>
                ) : null}
              </div>

              <div className="rounded-md border p-3">
                <div className="font-medium">Member subscriptions</div>
                <div className="mt-1 text-muted-foreground">
                  status: <span className="font-mono">{memberSubsQuery.status}</span> / fetch:{' '}
                  <span className="font-mono">{memberSubsQuery.fetchStatus}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  count: <span className="font-mono">{(memberSubsQuery.data ?? []).length}</span>
                </div>
                {safeErrorMessage(memberSubsQuery.error) ? (
                  <div className="mt-2 text-destructive">error: {safeErrorMessage(memberSubsQuery.error)}</div>
                ) : null}
              </div>

              <div className="rounded-md border p-3">
                <div className="font-medium">Subscription availed</div>
                <div className="mt-1 text-muted-foreground">
                  status: <span className="font-mono">{subscriptionAvailedQuery.status}</span> / fetch:{' '}
                  <span className="font-mono">{subscriptionAvailedQuery.fetchStatus}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  count: <span className="font-mono">{(subscriptionAvailedQuery.data ?? []).length}</span>
                </div>
                {safeErrorMessage(subscriptionAvailedQuery.error) ? (
                  <div className="mt-2 text-destructive">error: {safeErrorMessage(subscriptionAvailedQuery.error)}</div>
                ) : null}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Tip: If invoices show <span className="font-mono">fetch: idle</span> and auth store token is false, the invoices hook is disabled.
              Add <span className="font-mono">?debugBilling=1</span> to auto-enable on load.
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members Card */}
        <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {members.length} {members.length === 1 ? 'member' : 'members'} registered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone, or membership type..."
                    {...form.register('searchQuery')}
                    className="pl-9 rounded-2xl"
                  />
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
                        <TableHead className="w-[30%]">Name</TableHead>
                        <TableHead className="w-[25%]">Duration</TableHead>
                        <TableHead className="w-[15%]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((memberGroup) => (
                        <TableRow
                          key={memberGroup.id}
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedMemberGroupId(memberGroup.id)
                            setDetailsOpen(true)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedMemberGroupId(memberGroup.id)
                              setDetailsOpen(true)
                            }
                          }}
                        >
                          <TableCell>
                            <div className="space-y-1">
                              {memberGroup.members.map((member, idx) => (
                                <div key={idx} className="font-medium">
                                  {member.name}
                                  {memberGroup.members.length > 1 && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {idx + 1}/{memberGroup.members.length}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 text-sm">
                              {memberGroup.startDate && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(memberGroup.startDate, 'MMM dd, yyyy')}
                                </div>
                              )}
                              {memberGroup.endDate && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(memberGroup.endDate, 'MMM dd, yyyy')}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getMembershipStatusBadge(memberGroup.endDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

        <MemberDetailsDialog
          open={detailsOpen}
          onOpenChange={(open) => {
            setDetailsOpen(open)
            if (!open) setSelectedMemberGroupId(null)
          }}
          memberGroup={selectedMemberGroup}
          onSave={(updated) => {
            setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
          }}
        />

        {/* Attendance Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                Check in members using QR code, fingerprint, or manual search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <Button type="button" variant="outline" className="h-24 flex flex-col gap-2" disabled>
                  <UserCheck className="h-8 w-8" />
                  <Label>Manual</Label>
                  <span className="text-xs text-muted-foreground">Search below</span>
                </Button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search member by name, email, or phone..."
                    {...form.register('attendanceSearch')}
                    className="pl-9"
                  />
                </div>

                {attendanceSearch && filteredAttendanceMembers.length > 0 && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto divide-y">
                    {filteredAttendanceMembers.slice(0, 5).map((memberGroup) => {
                      const query = attendanceSearch.toLowerCase()
                      const matches = memberGroup.members.filter((m) => {
                        return (
                          m.name.toLowerCase().includes(query) ||
                          (m.email ?? '').toLowerCase().includes(query) ||
                          (m.phone ?? '').includes(attendanceSearch)
                        )
                      })

                      if (matches.length === 0) return null

                      return (
                        <div key={memberGroup.id} className="p-3">
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            Group: {memberGroup.membershipType}
                          </div>
                          <div className="space-y-2">
                            {matches.map((member) => (
                              <div
                                key={member.id}
                                className="p-2 rounded-md flex hover:bg-surface-container-low items-center justify-between"
                              >
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {member.email} • {member.phone}
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => handleMarkAttendance(memberGroup, member, 'manual')}
                                >
                                  Check In
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {attendanceSearch && filteredAttendanceMembers.length === 0 && (
                  <div className="text-sm text-muted-foreground">No members found.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>
                {todayAttendance.length} check-ins today • {format(new Date(), 'EEEE, MMMM dd, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayAttendance.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No check-ins recorded today. Use the check-in methods above to mark attendance.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member Name</TableHead>
                        <TableHead>Membership Type</TableHead>
                        <TableHead>Check-in Time</TableHead>
                        <TableHead>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="font-medium">{record.memberName}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{record.membershipType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(record.checkInTime, 'hh:mm a')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCheckInMethodIcon(record.checkInMethod)}
                              <span className="text-sm capitalize">{record.checkInMethod}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
