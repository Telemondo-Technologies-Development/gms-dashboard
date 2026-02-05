import { useQuery } from '@tanstack/react-query'

import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { memberQueryKeys } from '@/lib/QueryKeys'

export function useMemberSubscriptions(enabled = true) {
  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)

  return useQuery<MemberSubscriptionTableDTO[]>({
    queryKey: [memberQueryKeys.memberSubscriptions],
    enabled,
    queryFn: async () => {
      const response = await memberSubscriptionApi.getAllMemberSubscriptions({
        pageable: {
          page: 0,
          size: 500,
          sort: ['startDate,desc'],
        },
      })
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch member subscriptions.')
      }
      return response.data ?? []
    },
    retry: false,
    staleTime: 30_000,
  })
}

export function useMemberSubscriptionByActorId(memberActorId: string | null, enabled = true) {
  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)

  return useQuery<MemberSubscriptionTableDTO | null>({
    queryKey: [memberQueryKeys.memberSubscriptions, memberActorId],
    enabled: enabled && !!memberActorId,
    queryFn: async () => {
      if (!memberActorId) return null
      const response = await memberSubscriptionApi.getAllMemberSubscriptions({
        pageable: {
          page: 0,
          size: 500,
          sort: ['startDate,desc'],
        },
      })
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch member subscriptions.')
      }
      const subscription =
        response.data?.find((sub) => sub.actorId === memberActorId && sub.status === 'ACTIVE') ?? null
      return subscription
    },
    retry: false,
    staleTime: 30_000,
  })
}
