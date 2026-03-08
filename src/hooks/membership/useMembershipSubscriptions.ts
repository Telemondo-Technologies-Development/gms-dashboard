import { useQuery } from '@tanstack/react-query'

import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { memberQueryKeys } from '@/lib/QueryKeys'

const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)

export function useMemberSubscriptions(enabled = true) {
  return useQuery<MemberSubscriptionTableDTO[]>({
    queryKey: [memberQueryKeys.memberSubscriptions],
    enabled,
    queryFn: async () => {
      const res = await memberSubscriptionApi.getAllMemberSubscriptions({
        pageable: { page: 0, size: 500, sort: ['startDate,desc'] },
      })
      if (!res.success) throw new Error(res.message ?? 'Failed to fetch member subscriptions.')
      return res.data ?? []
    },
    retry: false,
    staleTime: 30_000,
  })
}

export function useMemberSubscriptionByActorId(memberActorId: string | null, enabled = true) {
  return useQuery<MemberSubscriptionTableDTO | null>({
    queryKey: [memberQueryKeys.memberSubscriptions, memberActorId],
    enabled: enabled && !!memberActorId,
    queryFn: async () => {
      if (!memberActorId) return null
      const res = await memberSubscriptionApi.getAllMemberSubscriptions({
        pageable: { page: 0, size: 500, sort: ['startDate,desc'] },
      })
      if (!res.success) throw new Error(res.message ?? 'Failed to fetch member subscriptions.')
      return res.data?.find((sub) => sub.actorId === memberActorId && sub.status === 'ACTIVE') ?? null
    },
    retry: false,
    staleTime: 30_000,
  })
}
