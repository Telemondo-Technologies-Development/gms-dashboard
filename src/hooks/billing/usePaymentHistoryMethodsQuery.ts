import { useQuery } from '@tanstack/react-query'
import { ZodError } from 'zod'
import { getAuthenticatedApi } from '@/lib/api-client'
import { PaymentApi } from '@/api/generated/apis'
import { apiResponseListPaymentMethodTableDTOSchema } from '@/types/payment/paymentSchemas'
import { paymentQueryKeys } from '@/lib/QueryKeys'
import { zodIssueSummary } from './PaymentHistory.utils'

/**
 * Hook to fetch all payment methods
 */
export function usePaymentHistoryPaymentMethodsQuery(page: number = 0, size: number = 50) {
  return useQuery({
    queryKey: [paymentQueryKeys.paymentMethods, page, size],
    queryFn: async () => {
      const api = getAuthenticatedApi(PaymentApi)
      const response = await api.getAllPaymentMethods({
        pageable: {
          page,
          size,
          sort: ['name,asc'],
        },
      })

      try {
        const parsed = apiResponseListPaymentMethodTableDTOSchema.parse(response)
        return parsed.data ?? []
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          throw new Error(`Payment methods response schema mismatch: ${zodIssueSummary(error)}`)
        }
        throw error
      }
    },
    refetchOnMount: 'always',
    staleTime: 60_000,
  })
}

export const usePaymentMethods = usePaymentHistoryPaymentMethodsQuery
