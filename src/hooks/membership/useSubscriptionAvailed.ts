import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'

import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { subscriptionAvailedQueryKeys } from '@/lib/QueryKeys'

export function useSubscriptionAvailed(enabled = true) {
  const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)

  /**
   * React hooks + TanStack Query notes:
   * - We keep TanStack Query as the single source of truth for server state.
   * - `useCallback` stabilizes the `queryFn` identity so this hook doesn't create
   *   a new function on every render (helps avoid unnecessary downstream re-renders
   *   when passing callbacks around, and is a good default for hook ergonomics).
   */

  const queryFn = useCallback(async () => {
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
  }, [subscriptionAvailedApi])

  return useQuery<SubscriptionAvailedTableDTO[]>({
    queryKey: [subscriptionAvailedQueryKeys.subscriptionAvailed],
    enabled,
    queryFn,
    retry: false,
    staleTime: 60_000,
  })
}
