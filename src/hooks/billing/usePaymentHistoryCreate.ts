import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import { toast } from 'sonner'

import { InvoiceApi } from '@/api/generated/apis/InvoiceApi'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { ResponseError } from '@/api/generated/runtime'
import { getAuthenticatedApi } from '@/lib/api-client'
import { calculateNextDueDate, resolvePaymentStatus } from '@/lib/billing-utils'
import { invoiceQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'
import {
  apiResponseListInvoiceTableDTOSchema,
  apiResponseListPaymentTableDTOSchema,
  apiResponseListPaymentMethodTableDTOSchema,
} from '@/types/payment/paymentSchemas'
import type {
  CreatePaymentIfNeededInput,
  EnsureInvoiceInput,
  PaymentMethodTableDTOParsed,
} from '@/types/payment/paymentSchemas'

function getPaymentApiErrorMessage(parsed: unknown, fallback: string) {
  if (!parsed || typeof parsed !== 'object') return fallback

  const record = parsed as Record<string, unknown>

  if (typeof record.message === 'string' && record.message.trim()) {
    return record.message
  }

  if (Array.isArray(record.errors) && record.errors.length > 0) {
    const first = record.errors[0]
    if (first && typeof first === 'object') {
      const errorRecord = first as Record<string, unknown>
      if (typeof errorRecord.description === 'string' && errorRecord.description.trim()) {
        return errorRecord.description
      }
      if (typeof errorRecord.code === 'string' && errorRecord.code.trim()) {
        return errorRecord.code
      }
    }
  }

  if (typeof record.error === 'string' && record.error.trim()) {
    return record.error
  }

  if (typeof record.detail === 'string' && record.detail.trim()) {
    return record.detail
  }

  return fallback
}

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

      if (!Number.isFinite(input.amount) || input.amount <= 0) {
        throw new Error('Payment amount must be greater than 0.')
      }

      const selectedMethod = await getPaymentMethod(input.paymentMethodId)
      if (!selectedMethod) return

      const requiresReference = !selectedMethod.name.trim().toLowerCase().includes('cash')
      const rawReferenceNum = input.referenceNum?.trim()
      const referenceNum = rawReferenceNum ? rawReferenceNum : undefined

      if (requiresReference && !referenceNum) {
        throw new Error('Reference number is required for non-cash payments.')
      }

      const paymentStatus = resolvePaymentStatus(input.amount, input.subtotal ?? input.amount)

      const paymentsResp = await paymentApi.getAllPayments({ pageable: { page: 0, size: 500 } })
      const paymentsParsed = apiResponseListPaymentTableDTOSchema.parse(paymentsResp)
      const existingPayment = (paymentsParsed.data ?? []).find((payment) => payment.invoiceId === input.invoiceId)

      if (existingPayment) {
        throw new Error('A payment already exists for this invoice. Refresh the table and update the existing payment instead.')
      }

      try {
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
      } catch (error) {
        if (error instanceof ResponseError) {
          const body = await error.response.text().catch(() => '')
          let parsed: unknown = null
          try {
            parsed = body.trim() ? JSON.parse(body) : null
          } catch {
            parsed = null
          }

          const fallback = body.trim() || `Create payment failed (${error.response.status}).`
          throw new Error(getPaymentApiErrorMessage(parsed, fallback))
        }

        throw error
      }

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