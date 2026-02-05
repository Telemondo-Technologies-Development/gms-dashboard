import { useSubscriptionAvailed } from './useSubscriptionAvailed'
import { useMemberSubscriptionByActorId } from './useMemberSubscriptions'

export function useMemberDetailsDialogData(options: { open: boolean; memberActorId: string | null }) {
  const { open, memberActorId } = options

  const subscriptionsQuery = useSubscriptionAvailed(open)
  const memberSubscriptionQuery = useMemberSubscriptionByActorId(memberActorId, open)

  return { subscriptionsQuery, memberSubscriptionQuery }
}
