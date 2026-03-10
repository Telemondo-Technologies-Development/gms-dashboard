import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import { SubscriptionApi } from '@/api/generated/apis/SubscriptionApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { invoiceQueryKeys, memberQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'
import { assertMembershipApiSuccess, getCreatedMemberSubscriptionId } from '@/types/membership/MembershipManagementSchema'

const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
const subscriptionApi = getAuthenticatedApi(SubscriptionApi)

interface UseMembershipUpdateSubscriptionInput {
  memberGroupId: string
  memberActorId: string | null
  currentMemberSubscriptionId?: string
  selectedSubscriptionId: string
  startDate: Date
  endDate?: Date
  selectedBranchId?: string | null
  branchId?: string | null
  createdById?: string | null
  updatedById?: string | null
  selectedSubscriptionName?: string
  selectedSubscriptionAmount?: number
}

export function useMembershipUpdateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UseMembershipUpdateSubscriptionInput) => {
      const {
        memberGroupId,
        memberActorId,
        currentMemberSubscriptionId,
        selectedSubscriptionId,
        startDate,
        endDate,
        selectedBranchId,
        branchId,
        createdById,
        updatedById,
        selectedSubscriptionName,
        selectedSubscriptionAmount,
      } = input

      if (!selectedSubscriptionId || !startDate) {
        throw new Error('Missing required fields for subscription update')
      }

      const resolvedBranchId = branchId ?? selectedBranchId
      if (!resolvedBranchId) {
        throw new Error('Branch not found. Please ensure your user is assigned to a branch.')
      }

      const resolvedUpdatedById = updatedById ?? createdById ?? null
      if (!resolvedUpdatedById) {
        throw new Error('Cannot determine user ID for the membership update.')
      }

      let subscriptionIdToUse = selectedSubscriptionId
      if (selectedSubscriptionName && typeof selectedSubscriptionAmount === 'number') {
        try {
          const subscriptionsResponse = await subscriptionApi.getAllSubscriptions({
            pageable: { page: 0, size: 500 },
          })
          const match = (subscriptionsResponse.data ?? []).find(
            (subscription) =>
              subscription.name.trim().toLowerCase() === selectedSubscriptionName.trim().toLowerCase() &&
              subscription.amount === selectedSubscriptionAmount,
          )
          subscriptionIdToUse = match?.id ?? selectedSubscriptionId
        } catch {
          subscriptionIdToUse = selectedSubscriptionId
        }
      }

      let resultingMemberSubscriptionId: string | undefined = currentMemberSubscriptionId
      let creatorIdForPayment = resolvedUpdatedById

      if (currentMemberSubscriptionId) {
        const updateResponse = await memberSubscriptionApi.updateMemberSubscription({
          id: currentMemberSubscriptionId,
          memberSubscriptionPutDTO: {
            actorId: memberActorId ?? memberGroupId,
            branchId: resolvedBranchId,
            startDate,
            endDate,
            status: 'ACTIVE',
            subscriptionId: subscriptionIdToUse,
            updateCurrentSubscription: true,
            updatedById: resolvedUpdatedById,
          },
        })
        assertMembershipApiSuccess(updateResponse, 'Failed to update subscription.')
      } else {
        const resolvedCreatedById = createdById ?? resolvedUpdatedById
        if (!resolvedCreatedById) {
          throw new Error('Cannot determine creator ID')
        }

        const createResponse = await memberSubscriptionApi.createMemberSubscription({
          memberSubscriptionPostDTO: {
            actorId: memberActorId ?? memberGroupId,
            branchId: resolvedBranchId,
            createdById: resolvedCreatedById,
            startDate,
            endDate,
            status: 'ACTIVE',
            subscriptionId: subscriptionIdToUse,
          },
        })

        resultingMemberSubscriptionId = getCreatedMemberSubscriptionId(createResponse, 'Failed to create subscription.')
        creatorIdForPayment = resolvedCreatedById
      }

      return { memberSubscriptionId: resultingMemberSubscriptionId, createdById: creatorIdForPayment }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [memberQueryKeys.memberSubscriptions] })
      void queryClient.invalidateQueries({ queryKey: [memberQueryKeys.members] })
      void queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] })
      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments] })
    },
  })
}