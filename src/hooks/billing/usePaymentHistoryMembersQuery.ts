import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { MemberApi } from '@/api/generated/apis/MemberApi'
import { apiResponseListMemberTableSchema } from '@/types/membership/MembershipManagementSchema'

/** Fetches members and builds an actorId → display name map for payment history. */
export function usePaymentHistoryMembersQuery() {
  const query = useQuery({
    queryKey: ['payment-history-members'],
    queryFn: async () => {
      const api = getAuthenticatedApi(MemberApi)
      const resp = await api.getAllMembers({ pageable: { page: 0, size: 1000 } })
      const parsed = apiResponseListMemberTableSchema.parse(resp)
      return parsed.data ?? []
    },
    staleTime: 60_000,
  })

  const memberNameByActorId = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of query.data ?? []) {
      if (!m.actorId) continue
      const fullName = [m.firstName, m.middleName, m.surname, m.suffix]
        .filter(Boolean)
        .join(' ')
      map.set(m.actorId, fullName || 'Unknown')
    }
    return map
  }, [query.data])

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    memberNameByActorId,
    refetch: query.refetch,
  }
}

export const usePaymentHistoryMembers = usePaymentHistoryMembersQuery
