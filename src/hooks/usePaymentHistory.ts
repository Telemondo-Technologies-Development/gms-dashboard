import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { PaymentApi } from '@/api/generated/apis'
import type { PaymentTableDTO, InvoiceTableDTO, PaymentMethodTableDTO } from '@/api/generated/models'

import {
  apiResponseListPaymentMethodTableDTOSchema,
  apiResponseListPaymentTableDTOSchema,
  apiResponsePaymentTableDTOSchema,
} from '@/types/payment/paymentSchemas'


const PAYMENT_QUERY_KEYS = {
  payments: 'payments',
  paymentMethods: 'payment-methods',
}

/**
 * Hook to fetch all payments with pagination
 */
export function usePayments(page: number = 0, size: number = 100) {
  return useQuery({
    queryKey: [PAYMENT_QUERY_KEYS.payments, page, size],
    queryFn: async () => {
      const api = getAuthenticatedApi(PaymentApi)
      const response = await api.getAllPayments({
        pageable: {
          page,
          size,
          sort: ['paidAt,desc'],
        },
      })

      const parsed = apiResponseListPaymentTableDTOSchema.parse(response)
      return parsed.data ?? []
    },
    staleTime: 30000, // 30 seconds
  })
}

/**
 * Hook to fetch a single payment by ID
 */
export function usePayment(id: string | null) {
  return useQuery({
    queryKey: [PAYMENT_QUERY_KEYS.payments, id],
    queryFn: async () => {
      if (!id) return null
      const api = getAuthenticatedApi(PaymentApi)
      const response = await api.getPayment({ id })

      const parsed = apiResponsePaymentTableDTOSchema.parse(response)
      return parsed.data ?? null
    },
    enabled: !!id,
    staleTime: 30000,
  })
}

/**
 * Hook to fetch all payment methods
 */
export function usePaymentMethods(page: number = 0, size: number = 50) {
  return useQuery({
    queryKey: [PAYMENT_QUERY_KEYS.paymentMethods, page, size],
    queryFn: async () => {
      const api = getAuthenticatedApi(PaymentApi)
      const response = await api.getAllPaymentMethods({
        pageable: {
          page,
          size,
          sort: ['name,asc'],
        },
      })

      const parsed = apiResponseListPaymentMethodTableDTOSchema.parse(response)
      return parsed.data ?? []
    },
    staleTime: 60000, // 1 minute
  })
}

export interface PaymentWithDetails extends PaymentTableDTO {
  invoice?: InvoiceTableDTO
  paymentMethod?: PaymentMethodTableDTO
  memberName?: string
  description?: string
}


export function mapPaymentStatus(
  payment: PaymentTableDTO,
  invoice?: InvoiceTableDTO
): 'paid' | 'failed' | 'overdue' | 'upcoming' {

  if (payment.paidAt) {
    return 'paid'
  }

  if (payment.failureReason) {
    return 'failed'
  }


  if (invoice) {
    if (invoice.status === 'OVERDUE') {
      return 'overdue'
    }
    if (invoice.status === 'ISSUED') {
      const dueDate = new Date(invoice.dueDate)
      const now = new Date()
      if (dueDate < now) {
        return 'overdue'
      }
      return 'upcoming'
    }
  }


  return 'upcoming'
}

export function formatPaymentAmount(amountCents: number, currency: string = 'PHP'): string {
  const amount = amountCents / 100
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  }).format(amount)
}
