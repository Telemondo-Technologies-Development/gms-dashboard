import { useCallback, useMemo } from 'react'
import { usePayments } from './usePayments'
import { usePaymentMethods } from './usePaymentMethods'
import { useInvoices } from './usePaymentHistoryInvoices'
import { usePaymentHistoryMembers } from './usePaymentHistoryMembers'
import type { PaymentMethodTableDTOParsed, InvoiceTableDTOParsed } from '@/types/payment/paymentSchemas'

/**
 * Aggregates all data queries needed by PaymentHistoryTable and
 * builds the lookup Maps (invoiceById, paymentMethodById, memberNameByActorId).
 */
export function usePaymentHistoryLookups() {
  const paymentsQuery    = usePayments(0, 200)
  const methodsQuery     = usePaymentMethods(0, 200)
  const invoicesQuery    = useInvoices(0, 500)
  const membersQuery     = usePaymentHistoryMembers()

  const invoiceById = useMemo(() => {
    const map = new Map<string, InvoiceTableDTOParsed>()
    for (const inv of invoicesQuery.data ?? []) map.set(inv.id, inv)
    return map
  }, [invoicesQuery.data])

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
    payments:              paymentsQuery.data ?? [],
    invoiceById,
    paymentMethodById,
    memberNameByActorId:   membersQuery.memberNameByActorId,
    isLoading:             paymentsQuery.isLoading || invoicesQuery.isLoading,
    methodsLoading:        methodsQuery.isLoading,
    membersLoading:        membersQuery.isLoading,
    paymentsError:         paymentsQuery.error,
    handleRefresh,
  }
}
