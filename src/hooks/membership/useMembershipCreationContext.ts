import { useSubscriptionAvailed } from './useMembershipSubscriptionAvailedQuery'
import { useMemberSubscriptionByActorId } from './useMembershipSubscriptionsQuery'

export function useMemberDetailsDialogData(options: { open: boolean; memberActorId: string | null }) {
  const { open, memberActorId } = options

  const subscriptionsQuery = useSubscriptionAvailed(open)
  const memberSubscriptionQuery = useMemberSubscriptionByActorId(memberActorId, open)

  return { subscriptionsQuery, memberSubscriptionQuery }
}
