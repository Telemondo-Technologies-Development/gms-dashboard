import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import { toast } from 'sonner'

import { InvoiceApi } from '@/api/generated/apis/InvoiceApi'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { calculateNextDueDate, resolvePaymentStatus } from '@/lib/billing-utils'
import { invoiceQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'
import {
  apiResponseListInvoiceTableDTOSchema,
  apiResponseListPaymentMethodTableDTOSchema,
} from '@/types/payment/paymentSchemas'
import type {
  CreatePaymentIfNeededInput,
  EnsureInvoiceInput,
  PaymentMethodTableDTOParsed,
} from '@/types/payment/paymentSchemas'

export function usePaymentHistoryCreateActions() {
  const queryClient = useQueryClient()

  const invoiceApi = getAuthenticatedApi(InvoiceApi)
  const paymentApi = getAuthenticatedApi(PaymentApi)

  const ensureInvoiceForSubscription = useCallback(
    async (input: EnsureInvoiceInput): Promise<string> => {
      const invoicesResp = await invoiceApi.getAllInvoices({ pageable: { page: 0, size: 500 } })
      const invoicesParsed = apiResponseListInvoiceTableDTOSchema.parse(invoicesResp)

      const existingInvoice = (invoicesParsed.data ?? [])
        .filter((inv) => inv.memberSubscriptionId === input.memberSubscriptionId)
        .sort((a, b) => (b.issuedAt?.getTime() ?? 0) - (a.issuedAt?.getTime() ?? 0))[0]

      if (existingInvoice) {
        return existingInvoice.id
      }

      const dueDate = calculateNextDueDate(input.startDate, input.intervals, input.intervalCount)

      const createInvoiceResp = await invoiceApi.createInvoice({
        invoicePostDTO: {
          actorId: input.actorId,
          createdById: input.createdById,
          dueDate,
          memberSubscriptionId: input.memberSubscriptionId,
          status: 'PENDING',
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
      return methods.find((method) => method.id === paymentMethodId) ?? null
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

      try {
        let dueDate = input.knownDueDate ?? new Date()
        let gracePeriodDate = addDays(dueDate, input.gracePeriodDays ?? 0)
        let subtotal = input.subtotal ?? input.amount
        let alreadyPaid = false

        try {
          const invoiceResp = await invoiceApi.getInvoice({ id: input.invoiceId })
          if (invoiceResp.success && invoiceResp.data) {
            const invoice = invoiceResp.data
            alreadyPaid = invoice.status === 'PAID'

            if (!alreadyPaid) {
              const isRealDate = (value: unknown): value is Date =>
                value instanceof Date && !Number.isNaN(value.getTime()) && value.getFullYear() > 2000

              if (isRealDate(invoice.dueDate)) dueDate = invoice.dueDate
              if (isRealDate(invoice.gracePeriodDate)) gracePeriodDate = invoice.gracePeriodDate
              if (typeof invoice.subtotal === 'number' && invoice.subtotal > 0) subtotal = invoice.subtotal
            }
          }
        } catch {
          // Fall back to caller-computed values when the immediate read is unavailable.
        }

        if (!alreadyPaid) {
          await invoiceApi.updateInvoice({
            id: input.invoiceId,
            invoicePutDTO: {
              dueDate,
              gracePeriodDate,
              status: 'PAID',
              subtotal,
              updatedById: input.createdById,
            },
          })
        }
      } catch (invoiceError) {
        toast.warning(
          'Payment was recorded, but the invoice could not be marked as PAID automatically. Please update it manually.',
          { duration: 9000 },
        )
        console.error('[createPaymentIfNeeded] Invoice status update failed:', invoiceError)
      }

      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments] })
      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.paymentMethods] })
      void queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] })
    },
    [getPaymentMethod, invoiceApi, paymentApi, queryClient],
  )

  return {
    ensureInvoiceForSubscription,
    createPaymentIfNeeded,
  }
}

export const useBillingActions = usePaymentHistoryCreateActions