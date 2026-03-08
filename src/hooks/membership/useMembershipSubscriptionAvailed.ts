import { useQuery } from '@tanstack/react-query'

import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { subscriptionAvailedQueryKeys } from '@/lib/QueryKeys'

const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)

export function useSubscriptionAvailed(enabled = true) {
  return useQuery<SubscriptionAvailedTableDTO[]>({
    queryKey: [subscriptionAvailedQueryKeys.subscriptionAvailed],
    enabled,
    queryFn: async () => {
      const res = await subscriptionAvailedApi.getAllSubscriptionAvailed({
        pageable: { page: 0, size: 500, sort: ['name,asc'] },
      })
      if (!res.success) throw new Error(res.message ?? 'Failed to fetch subscription availed.')
      return res.data ?? []
    },
    retry: false,
    staleTime: 60_000,
  })
}
