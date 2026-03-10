import { useQuery } from '@tanstack/react-query'

import { BillingCycleApi } from '@/api/generated/apis/BillingCycleApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { billingCycleQueryKeys } from '@/lib/QueryKeys'
import {
  apiResponseListBillingCycleTableDTOSchema,
  type BillingCycleTableDTOParsed,
} from '@/types/membership/MembershipsubscriptionSchemas'

const billingCycleApi = getAuthenticatedApi(BillingCycleApi)

export function useBillingCycles(enabled = true) {
  return useQuery<BillingCycleTableDTOParsed[]>({
    queryKey: [billingCycleQueryKeys.billingCycles],
    enabled,
    staleTime: 60_000,
    retry: 1,
    queryFn: async () => {
      const response = await billingCycleApi.getAllBillingCycles({
        pageable: { page: 0, size: 200 },
      })
      const parsed = apiResponseListBillingCycleTableDTOSchema.parse(response)
      if (!parsed.success) {
        throw new Error(parsed.message ?? 'Failed to load billing cycles.')
      }
      return parsed.data ?? []
    },
  })
}