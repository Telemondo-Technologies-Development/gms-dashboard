import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePaymentHistoryInvoicesQuery } from '@/hooks/billing/usePaymentHistoryInvoicesQuery'
import { useMemberSubscriptions } from './useMembershipSubscriptionsQuery'
import { useSubscriptionAvailed } from './useMembershipSubscriptionAvailedQuery'
import { getAuthenticatedApi } from '@/lib/api-client'
import { MemberApi } from '@/api/generated/apis'
import { memberQueryKeys } from '@/lib/QueryKeys'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import type { MemberFormData } from '@/types/membership/MembershipManagementSchema'
import type { InvoiceTableDTOParsed } from '@/types/payment/paymentSchemas'

const EMPTY_INVOICES: InvoiceTableDTOParsed[] = []
const memberApi = getAuthenticatedApi(MemberApi)


export function useMembersData() {
  /**
   * React hooks + TanStack Query notes:
   * - TanStack Query is the source of truth for fetching/caching server data.
   * - `useMemo` is used for derived data (enrichedMembers) and expensive helpers
   *   (like Intl.NumberFormat) to avoid re-creating them on every render.
   * - `useCallback` stabilizes functions we return (`refetchAll`) to reduce
   *   re-renders in consuming components.
   */

  const membersQuery = useQuery({
    queryKey: [memberQueryKeys.members],
    queryFn: async () => {
      const res = await memberApi.getAllMembers({ pageable: { page: 0, size: 5 } })
      return res.data ?? []
    },
  })

  const memberSubsQuery = useMemberSubscriptions()
  const subscriptionAvailedQuery = useSubscriptionAvailed()
  const invoicesQuery = usePaymentHistoryInvoicesQuery(0, 500)
  const invoices = invoicesQuery.data ?? EMPTY_INVOICES

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
      }),
    [],
  )

  const formatCurrencyMemo = useCallback(
    (amount: number) => {
      return currencyFormatter.format(amount)
    },
    [currencyFormatter],
  )

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

      const recorderName = [m.createdByFirstName, m.createdBySurname].filter(Boolean).join(' ').trim() || null

      return {
        id: m.id,
        actorId: m.actorId ?? null,
        recorderName,
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
            ? ` • Invoiced: ${formatCurrencyMemo(totalInvoiced)} • Paid: ${formatCurrencyMemo(totalPaid)} • Unpaid: ${formatCurrencyMemo(totalUnpaid)}`
            : ''
        }`,
        documents: [],
      }
    })
  }, [membersQuery.data, memberSubsQuery.data, subscriptionAvailedQuery.data, invoices, formatCurrencyMemo])

  const refetchAll = useCallback(() => {
    void membersQuery.refetch()
    void memberSubsQuery.refetch()
    void subscriptionAvailedQuery.refetch()
    void invoicesQuery.refetch()
  }, [invoicesQuery, memberSubsQuery, membersQuery, subscriptionAvailedQuery])

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
