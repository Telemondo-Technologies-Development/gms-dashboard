import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { InvoiceApi } from '@/api/generated/apis/InvoiceApi'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { invoiceQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'
import { apiResponseListInvoiceTableDTOSchema, apiResponseListPaymentMethodTableDTOSchema } from '@/types/payment/paymentSchemas'
import type { PaymentMethodTableDTOParsed } from '@/types/payment/paymentSchemas'
import type { EnsureInvoiceInput, CreatePaymentIfNeededInput } from '@/types/payment/paymentSchemas'
import { calculateNextDueDate, resolvePaymentStatus } from '@/lib/billing-utils'



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

      // Due date = startDate + 1 billing cycle (e.g. +1 month for MONTHLY x1).
      // For ongoing subscriptions (no endDate) this is still calculated the same way —
      // the member simply renews indefinitely each billing cycle.
      const dueDate = calculateNextDueDate(input.startDate, input.intervals, input.intervalCount)

      // gracePeriodDate is computed server-side from dueDate + gracePeriodDays.
      // We do not send it in the POST — the backend derives and stores it.

      // Use DRAFT as the initial status; backend can transition to ISSUED/PENDING.
      const createInvoiceResp = await invoiceApi.createInvoice({
        invoicePostDTO: {
          actorId: input.actorId,
          createdById: input.createdById,
          dueDate,
          memberSubscriptionId: input.memberSubscriptionId,
          status: 'DRAFT',
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

  const getPaymentMethod = useCallback(
    async (paymentMethodId: string): Promise<PaymentMethodTableDTOParsed | null> => {
      if (!paymentMethodId) return null
      const methodsResp = await paymentApi.getAllPaymentMethods({ pageable: { page: 0, size: 200 } })
      const methodsParsed = apiResponseListPaymentMethodTableDTOSchema.parse(methodsResp)
      const methods = (methodsParsed.data ?? []) as PaymentMethodTableDTOParsed[]
      return methods.find((m) => m.id === paymentMethodId) ?? null
    },
    [paymentApi],
  )

  const createPaymentIfNeeded = useCallback(
    async (input: CreatePaymentIfNeededInput): Promise<void> => {
      if (!input.invoiceId) return

      const selectedMethod = await getPaymentMethod(input.paymentMethodId)
      if (!selectedMethod) return

      const requiresReference = !selectedMethod.name.trim().toLowerCase().includes('cash')
      const rawReferenceNum = input.referenceNum?.trim()
      const referenceNum = rawReferenceNum ? rawReferenceNum : undefined

      if (requiresReference && !referenceNum) {
        throw new Error('Reference number is required for non-cash payments.')
      }

      // Determine correct payment status based on amount paid vs invoice subtotal
      const paymentStatus = resolvePaymentStatus(input.amount, input.subtotal ?? input.amount)

      await paymentApi.createPayment({
        paymentPostDTO: {
          amount: input.amount,
          createdById: input.createdById,
          invoiceId: input.invoiceId,
          paidAt: input.paidAt ?? new Date(),
          paymentMethodId: input.paymentMethodId,
          referenceNum,
          status: paymentStatus,
        },
      })

      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments] })
      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.paymentMethods] })
      void queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] })
    },
    [getPaymentMethod, paymentApi, queryClient],
  )

  return {
    ensureInvoiceForSubscription,
    createPaymentIfNeeded,
  }
}

/** Mutation hook to delete a payment and invalidate relevant queries. */
export function useDeletePayment() {
  const queryClient = useQueryClient()
  const paymentApi  = getAuthenticatedApi(PaymentApi)

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
