import { useQuery } from '@tanstack/react-query'
import { ZodError } from 'zod'
import { getAuthenticatedApi } from '@/lib/api-client'
import { PaymentApi } from '@/api/generated/apis'
import type { PaymentTableDTO, InvoiceTableDTO, PaymentMethodTableDTO } from '@/api/generated/models'
import {
  apiResponseListPaymentTableDTOSchema,
  apiResponsePaymentTableDTOSchema,
} from '@/types/payment/paymentSchemas'
import { paymentQueryKeys } from '@/lib/QueryKeys'
import { zodIssueSummary } from './PaymentHistory.utils'

/**
 * Hook to fetch all payments with pagination
 */
export function usePaymentHistoryPaymentsQuery(page: number = 0, size: number = 100) {
  return useQuery({
    queryKey: [paymentQueryKeys.payments, page, size],
    queryFn: async () => {
      const api = getAuthenticatedApi(PaymentApi)
      const response = await api.getAllPayments({
        pageable: {
          page,
          size,
          sort: ['paidAt,desc'],
        },
      })

      try {
        const parsed = apiResponseListPaymentTableDTOSchema.parse(response)
        return parsed.data ?? []
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          throw new Error(`Payments response schema mismatch: ${zodIssueSummary(error)}`)
        }
        throw error
      }
    },
    refetchOnMount: 'always',
    staleTime: 30_000,
  })
}

/**
 * Hook to fetch a single payment by ID
 */
export function usePaymentHistoryPaymentQuery(id: string | null) {
  return useQuery({
    queryKey: [paymentQueryKeys.payments, id],
    queryFn: async () => {
      if (!id) return null
      const api = getAuthenticatedApi(PaymentApi)
      const response = await api.getPayment({ id })

      try {
        const parsed = apiResponsePaymentTableDTOSchema.parse(response)
        return parsed.data ?? null
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          throw new Error(`Payment response schema mismatch: ${zodIssueSummary(error)}`)
        }
        throw error
      }
    },
    enabled: !!id,
    refetchOnMount: 'always',
    staleTime: 30_000,
  })
}

export interface PaymentWithDetails extends PaymentTableDTO {
  invoice?: InvoiceTableDTO
  paymentMethod?: PaymentMethodTableDTO
  memberName?: string
  description?: string
}

export const usePayments = usePaymentHistoryPaymentsQuery
export const usePayment = usePaymentHistoryPaymentQuery
