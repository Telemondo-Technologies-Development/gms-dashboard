import { useQuery } from '@tanstack/react-query'

import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { memberQueryKeys } from '@/lib/QueryKeys'

const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
const memberSubscriptionsQueryKey = [memberQueryKeys.memberSubscriptions] as const
const memberSubscriptionsPageable = { page: 0, size: 500, sort: ['startDate,desc'] }

async function fetchMemberSubscriptions(): Promise<MemberSubscriptionTableDTO[]> {
  const res = await memberSubscriptionApi.getAllMemberSubscriptions({
    pageable: memberSubscriptionsPageable,
  })

  if (!res.success) {
    throw new Error(res.message ?? 'Failed to fetch member subscriptions.')
  }

  return res.data ?? []
}

export function useMemberSubscriptions(enabled = true) {
  return useQuery<MemberSubscriptionTableDTO[]>({
    queryKey: memberSubscriptionsQueryKey,
    enabled,
    queryFn: fetchMemberSubscriptions,
    retry: false,
    staleTime: 30_000,
  })
}

export function useMemberSubscriptionByActorId(memberActorId: string | null, enabled = true) {
  return useQuery<MemberSubscriptionTableDTO[], Error, MemberSubscriptionTableDTO | null>({
    queryKey: memberSubscriptionsQueryKey,
    enabled: enabled && !!memberActorId,
    queryFn: fetchMemberSubscriptions,
    select: (subscriptions) => {
      if (!memberActorId) return null
      return subscriptions.find((sub) => sub.actorId === memberActorId && sub.status === 'ACTIVE') ?? null
    },
    retry: false,
    staleTime: 30_000,
  })
}
