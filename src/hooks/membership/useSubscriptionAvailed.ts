import { useQuery } from '@tanstack/react-query'

import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { subscriptionAvailedQueryKeys } from '@/lib/QueryKeys'

export function useSubscriptionAvailed(enabled = true) {
  const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)

  return useQuery<SubscriptionAvailedTableDTO[]>({
    queryKey: [subscriptionAvailedQueryKeys.subscriptionAvailed],
    enabled,
    queryFn: async () => {
      const response = await subscriptionAvailedApi.getAllSubscriptionAvailed({
        pageable: {
          page: 0,
          size: 500,
          sort: ['name,asc'],
        },
      })
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch subscription availed.')
      }
      return response.data ?? []
    },
    retry: false,
    staleTime: 60_000,
  })
}
