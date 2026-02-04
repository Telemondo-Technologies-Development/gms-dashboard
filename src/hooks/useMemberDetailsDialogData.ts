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
    staleTime: 60000,
  })

  const memberSubscriptionQuery = useQuery<MemberSubscriptionTableDTO | null>({
    queryKey: [memberQueryKeys.memberSubscriptions, memberActorId],
    enabled: open && !!memberActorId,
    queryFn: async () => {
      if (!memberActorId) return null
      const response = await memberSubscriptionApi.getAllMemberSubscriptions({
        pageable: {
          page: 0,
          size: 500,
          sort: ['startDate,desc'],
        },
      })
      if (response.success === false) {
        throw new Error(response.message ?? 'Failed to fetch member subscriptions.')
      }
      const subscription =
        response.data?.find((sub: MemberSubscriptionTableDTO) => sub.actorId === memberActorId && sub.status === 'ACTIVE') ??
        null
      return subscription
    },
    retry: false,
    staleTime: 30000,
  })

  return { subscriptionsQuery, memberSubscriptionQuery }
}
