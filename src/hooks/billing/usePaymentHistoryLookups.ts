import { useCallback, useMemo } from 'react'
import { usePaymentHistoryPaymentsQuery } from './usePaymentsHistoryPaymentsQuery'
import { usePaymentHistoryPaymentMethodsQuery } from './usePaymentHistoryMethodsQuery'
import { usePaymentHistoryInvoicesQuery } from './usePaymentHistoryInvoicesQuery'
import { usePaymentHistoryMembersQuery } from './usePaymentHistoryMembersQuery'
import type { PaymentMethodTableDTOParsed, InvoiceTableDTOParsed, PaymentTableDTOParsed } from '@/types/payment/paymentSchemas'

/**
 * Aggregates all data queries needed by PaymentHistoryTable.
 * The table is invoice-centric: every invoice is a row, with
 * its associated payment record (if any) attached.
 */
export function usePaymentHistoryDataQuery() {
  const paymentsQuery = usePaymentHistoryPaymentsQuery(0, 500)
  const methodsQuery = usePaymentHistoryPaymentMethodsQuery(0, 200)
  const invoicesQuery = usePaymentHistoryInvoicesQuery(0, 500)
  const membersQuery = usePaymentHistoryMembersQuery()

  const invoiceById = useMemo(() => {
    const map = new Map<string, InvoiceTableDTOParsed>()
    for (const inv of invoicesQuery.data ?? []) map.set(inv.id, inv)
    return map
  }, [invoicesQuery.data])

  // One payment per invoice (latest by paidAt if multiple)
  const paymentByInvoiceId = useMemo(() => {
    const map = new Map<string, PaymentTableDTOParsed>()
    for (const p of paymentsQuery.data ?? []) {
      const existing = map.get(p.invoiceId)
      if (!existing || (p.paidAt && (!existing.paidAt || p.paidAt > existing.paidAt))) {
        map.set(p.invoiceId, p)
      }
    }
    return map
  }, [paymentsQuery.data])

  const paymentMethodById = useMemo(() => {
    const map = new Map<string, PaymentMethodTableDTOParsed>()
    for (const method of methodsQuery.data ?? []) map.set(method.id, method)
    return map
  }, [methodsQuery.data])

  const handleRefresh = useCallback(() => {
    void paymentsQuery.refetch()
    void methodsQuery.refetch()
    void invoicesQuery.refetch()
    void membersQuery.refetch()
  }, [paymentsQuery, methodsQuery, invoicesQuery, membersQuery])

  return {
    // Use invoices as the base list — every invoice is a row
    invoices:              invoicesQuery.data ?? [],
    payments:              paymentsQuery.data ?? [],
    paymentByInvoiceId,
    invoiceById,
    paymentMethodById,
    memberNameByActorId:   membersQuery.memberNameByActorId,
    isLoading:             invoicesQuery.isLoading || paymentsQuery.isLoading,
    methodsLoading:        methodsQuery.isLoading,
    membersLoading:        membersQuery.isLoading,
    paymentsError:         invoicesQuery.error ?? paymentsQuery.error,
    handleRefresh,
  }
}

export const usePaymentHistoryLookups = usePaymentHistoryDataQuery
