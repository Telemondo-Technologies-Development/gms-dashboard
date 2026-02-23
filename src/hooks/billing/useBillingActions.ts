import { useCallback } from 'react'
import { addDays } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'

import { InvoiceApi } from '@/api/generated/apis/InvoiceApi'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { invoiceQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'
import { apiResponseListInvoiceTableDTOSchema, apiResponseListPaymentMethodTableDTOSchema } from '@/types/payment/paymentSchemas'
import type { PaymentMethodTableDTOParsed } from '@/types/payment/paymentSchemas'
import type { EnsureInvoiceInput, CreatePaymentIfNeededInput } from '@/types/payment/paymentSchemas'



export function useBillingActions() {
  const queryClient = useQueryClient()

  const invoiceApi = getAuthenticatedApi(InvoiceApi)
  const paymentApi = getAuthenticatedApi(PaymentApi)

  const ensureInvoiceForSubscription = useCallback(
    async (input: EnsureInvoiceInput): Promise<string> => {
      const invoicesResp = await invoiceApi.getAllInvoices({ pageable: { page: 0, size: 500 } })
      const invoicesParsed = apiResponseListInvoiceTableDTOSchema.parse(invoicesResp)

      const existingInvoice = (invoicesParsed.data ?? [])
        .filter((inv) => inv.memberSubscriptionId === input.memberSubscriptionId)
        .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())[0]

      if (existingInvoice) {
        return existingInvoice.id
      }

      const createInvoiceResp = await invoiceApi.createInvoice({
        invoicePostDTO: {
          actorId: input.actorId,
          createdById: input.createdById,
          dueDate: input.dueDate,
          gracePeriodDate: addDays(input.dueDate, input.gracePeriodDays),
          memberSubscriptionId: input.memberSubscriptionId,
          status: 'ISSUED',
          subtotal: input.subtotal,
          systemGenerated: true,
        },
      })

      if (!createInvoiceResp.success || !createInvoiceResp.data) {
        throw new Error(createInvoiceResp.message ?? 'Failed to create invoice.')
      }

      void queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] })
      return createInvoiceResp.data.id
    },
    [invoiceApi, queryClient],
  )

  const ensurePaymentMethodExists = useCallback(
    async (paymentMethodId: string): Promise<boolean> => {
      if (!paymentMethodId) return false
      const methodsResp = await paymentApi.getAllPaymentMethods({ pageable: { page: 0, size: 200 } })
      const methodsParsed = apiResponseListPaymentMethodTableDTOSchema.parse(methodsResp)
      const methods = (methodsParsed.data ?? []) as PaymentMethodTableDTOParsed[]
      return methods.some((m) => m.id === paymentMethodId)
    },
    [paymentApi],
  )

  const createPaymentIfNeeded = useCallback(
    async (input: CreatePaymentIfNeededInput): Promise<void> => {
      if (!input.invoiceId) return

      const ok = await ensurePaymentMethodExists(input.paymentMethodId)
      if (!ok) return

      await paymentApi.createPayment({
        paymentPostDTO: {
          amount: input.amount,
          createdById: input.createdById,
          invoiceId: input.invoiceId,
          paidAt: input.paidAt ?? new Date(),
          paymentMethodId: input.paymentMethodId,
          status: 'IN',
        },
      })

      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments] })
      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.paymentMethods] })
      void queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] })
    },
    [ensurePaymentMethodExists, paymentApi, queryClient],
  )

  return {
    ensureInvoiceForSubscription,
    createPaymentIfNeeded,
  }
}
