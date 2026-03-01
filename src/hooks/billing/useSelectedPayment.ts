import { useMemo } from 'react'
import { usePayment } from './usePayments'
import type { PaymentTableDTOParsed } from '@/types/payment/paymentSchemas'

/**
 * Resolves the currently selected payment.
 * Uses the single-payment query as the primary source and falls back to the
 * list cache so the UI never shows a blank while re-fetching.
 */
export function useSelectedPayment(
  selectedPaymentId: string | null,
  payments: PaymentTableDTOParsed[],
) {
  const paymentQuery = usePayment(selectedPaymentId)

  const selectedPayment = useMemo(() => {
    if (paymentQuery.data) return paymentQuery.data
    if (!selectedPaymentId) return null
    return payments.find((p) => p.id === selectedPaymentId) ?? null
  }, [paymentQuery.data, payments, selectedPaymentId])

  return {
    selectedPayment,
    isLoading: !!selectedPaymentId && paymentQuery.isLoading && !selectedPayment,
    error: paymentQuery.error instanceof Error ? paymentQuery.error.message : undefined,
  }
}
