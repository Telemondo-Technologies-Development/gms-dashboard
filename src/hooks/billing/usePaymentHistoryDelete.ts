import { useMutation, useQueryClient } from '@tanstack/react-query'

import { InvoiceApi } from '@/api/generated/apis/InvoiceApi'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { invoiceQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'

export function usePaymentHistoryDeletePayment() {
  const queryClient = useQueryClient()
  const paymentApi = getAuthenticatedApi(PaymentApi)

  return useMutation({
    mutationFn: async (id: string) => {
      await paymentApi.deletePayment({ id })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments] })
      void queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] })
    },
  })
}

export function usePaymentHistoryDeleteInvoice() {
  const queryClient = useQueryClient()
  const invoiceApi = getAuthenticatedApi(InvoiceApi)

  return useMutation({
    mutationFn: async (id: string) => {
      await invoiceApi.deleteInvoice({ id })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] })
      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments] })
    },
  })
}

export const useDeletePayment = usePaymentHistoryDeletePayment
export const useDeleteInvoice = usePaymentHistoryDeleteInvoice