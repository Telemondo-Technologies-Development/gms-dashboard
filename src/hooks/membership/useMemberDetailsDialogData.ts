import { useMemo } from 'react'
import { useSubscriptionAvailed } from './useSubscriptionAvailed'
import { useMemberSubscriptionByActorId } from './useMemberSubscriptions'

export function useMemberDetailsDialogData(options: { open: boolean; memberActorId: string | null }) {
  const { open, memberActorId } = options

  /**
   * React hooks + TanStack Query notes:
   * - Keep TanStack Query for server state.
   * - `useMemo` returns a stable object shape for consumers that do
   *   referential-equality checks.
   */

  const subscriptionsQuery = useSubscriptionAvailed(open)
  const memberSubscriptionQuery = useMemberSubscriptionByActorId(memberActorId, open)

  return useMemo(
    () => ({ subscriptionsQuery, memberSubscriptionQuery }),
    [memberSubscriptionQuery, subscriptionsQuery],
  )
}
