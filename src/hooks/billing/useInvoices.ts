import { useQuery } from '@tanstack/react-query'
import { ZodError } from 'zod'
import { getAuthenticatedApi } from '@/lib/api-client'
import { InvoiceApi } from '@/api/generated/apis'
import { apiResponseListInvoiceTableDTOSchema } from '@/types/payment/paymentSchemas'
import { invoiceQueryKeys } from '@/lib/QueryKeys'
import { zodIssueSummary } from './billing.utils'

/**
 * Hook to fetch all invoices with pagination
 */
export function useInvoices(page: number = 0, size: number = 200) {
  return useQuery({
    queryKey: [invoiceQueryKeys.invoices, page, size],
    queryFn: async () => {
      const api = getAuthenticatedApi(InvoiceApi)
      const response = await api.getAllInvoices({
        pageable: {
          page,
          size,
          sort: ['issuedAt,desc'],
        },
      })

      try {
        const parsed = apiResponseListInvoiceTableDTOSchema.parse(response)
        return parsed.data ?? []
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          throw new Error(`Invoices response schema mismatch: ${zodIssueSummary(error)}`)
        }
        throw error
      }
    },
    refetchOnMount: 'always',
    staleTime: 30_000,
  })
}
