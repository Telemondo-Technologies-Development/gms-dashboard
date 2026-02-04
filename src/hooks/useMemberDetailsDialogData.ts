import { useQuery } from '@tanstack/react-query'

import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import {subscriptionAvailedQueryKeys, memberQueryKeys } from '@/lib/QueryKeys'

export function useMemberDetailsDialogData(options: { open: boolean; memberActorId: string | null }) {
  const { open, memberActorId } = options

  const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)
  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)

  const subscriptionsQuery = useQuery<SubscriptionAvailedTableDTO[]>({
    queryKey: [subscriptionAvailedQueryKeys.subscriptionAvailed],
    enabled: open,
    queryFn: async () => {
      const response = await subscriptionAvailedApi.getAllSubscriptionAvailed({ pageable: {} })
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch subscription availed.')
      }
      return response.data ?? []
    },
    retry: false,
  })

  const memberSubscriptionQuery = useQuery<MemberSubscriptionTableDTO | null>({
    queryKey: [memberQueryKeys.memberSubscription, memberActorId],
    enabled: open && !!memberActorId,
    queryFn: async () => {
      if (!memberActorId) return null
      const response = await memberSubscriptionApi.getAllMemberSubscriptions({ pageable: {} })
      const subscription =
        response.data?.find((sub: MemberSubscriptionTableDTO) => sub.actorId === memberActorId && sub.status === 'ACTIVE') ??
        null
      return subscription
    },
    retry: false,
  })

  return { subscriptionsQuery, memberSubscriptionQuery }
}
