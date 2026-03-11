import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MemberApi } from '@/api/generated/apis/MemberApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { memberQueryKeys } from '@/lib/QueryKeys'

export function useMembershipDeleteMember(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const memberApi = getAuthenticatedApi(MemberApi)

  return useMutation({
    mutationFn: async (id: string) => {
      await memberApi.deleteMember({ id })
    },
    onSuccess: async () => {
      if (onSuccess) {
        onSuccess()
        return
      }

      await queryClient.invalidateQueries({ queryKey: [memberQueryKeys.members] })
      await queryClient.invalidateQueries({ queryKey: [memberQueryKeys.memberSubscriptions] })
    },
  })
} 