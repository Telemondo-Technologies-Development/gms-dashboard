import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useInvoices } from '@/hooks/usePaymentHistory'
import { useMemberSubscriptions } from './useMemberSubscriptions'
import { useSubscriptionAvailed } from './useSubscriptionAvailed'
import { readPersistedAuthToken } from '@/lib/auth-session'
import { apiResponseListMemberTableSchema } from '@/types/membership/memberSchemas'
import { memberQueryKeys } from '@/lib/QueryKeys'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import type { MemberFormData } from '@/types/membership/memberSchemas'
import type { InvoiceTableDTOParsed } from '@/types/payment/paymentSchemas'

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
  return envelope.data ?? []
}

function formatCurrency(amount: number, currency: string = 'PHP') {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function useMembersData() {
  const membersQuery = useQuery({
    queryKey: [memberQueryKeys.members],
    queryFn: fetchMembersFromApi,
  })

  const memberSubsQuery = useMemberSubscriptions()
  const subscriptionAvailedQuery = useSubscriptionAvailed()
  const invoicesQuery = useInvoices(0, 500)
  const invoices = invoicesQuery.data ?? EMPTY_INVOICES

  const enrichedMembers = useMemo<MemberFormData[]>(() => {
    const apiMembers = membersQuery.data ?? []
    const subsByActor = new Map<string, MemberSubscriptionTableDTO>()

    for (const sub of (memberSubsQuery.data ?? [])) {
      const prev = sub.actorId ? subsByActor.get(sub.actorId) : undefined
      const shouldReplace =
        !prev ||
        (prev.status !== 'ACTIVE' && sub.status === 'ACTIVE') ||
        (prev.startDate && sub.startDate && new Date(sub.startDate).getTime() > new Date(prev.startDate).getTime())
      if (sub.actorId && shouldReplace) subsByActor.set(sub.actorId, sub)
    }

    const availedById = new Map<string, SubscriptionAvailedTableDTO>()
    for (const s of (subscriptionAvailedQuery.data ?? [])) availedById.set(s.id, s)

    const invoicesByMemberSub = new Map<string, typeof invoices>()
    for (const inv of invoices) {
      if (!inv.memberSubscriptionId) continue
      const arr = invoicesByMemberSub.get(inv.memberSubscriptionId) ?? []
      arr.push(inv)
      invoicesByMemberSub.set(inv.memberSubscriptionId, arr)
    }

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
        membershipDetails: `Status: ${m.status}${availed ? ` • Plan: ${availed.name}` : ''}${
          relatedInvoices.length
            ? ` • Invoiced: ${formatCurrency(totalInvoiced)} • Paid: ${formatCurrency(totalPaid)} • Unpaid: ${formatCurrency(totalUnpaid)}`
            : ''
        }`,
        documents: [],
      }
    })
  }, [membersQuery.data, memberSubsQuery.data, subscriptionAvailedQuery.data, invoices])

  const refetchAll = () => {
    void membersQuery.refetch()
    void memberSubsQuery.refetch()
    void subscriptionAvailedQuery.refetch()
    void invoicesQuery.refetch()
  }

  const isLoading = membersQuery.isLoading || memberSubsQuery.isLoading || subscriptionAvailedQuery.isLoading || invoicesQuery.isLoading
  const isFetching = membersQuery.isFetching || memberSubsQuery.isFetching || subscriptionAvailedQuery.isFetching || invoicesQuery.isFetching
  const error = membersQuery.error || memberSubsQuery.error || subscriptionAvailedQuery.error || invoicesQuery.error

  return {
    enrichedMembers,
    isLoading,
    isFetching,
    error,
    refetchAll,
    queries: {
      members: membersQuery,
      memberSubscriptions: memberSubsQuery,
      subscriptionAvailed: subscriptionAvailedQuery,
      invoices: invoicesQuery,
    },
  }
}
