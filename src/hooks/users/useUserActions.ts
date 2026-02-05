import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getAuthenticatedApi } from '@/lib/api-client'
import { UserApi } from '@/api/generated/apis'
import type { CreateUserFormValues } from '@/types/user/userSchemas'
import { userQueryKeys } from './useUsers'

/**
 * Hook for user mutations (create)
 */
export function useUserActions() {
  const queryClient = useQueryClient()
  const userApi = getAuthenticatedApi(UserApi)

  const createUser = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      const response = await userApi.createUser({
        userPostDTO: {
          email: values.email,
          password: values.password,
        },
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys })
    },
  })

  return {
    createUser,
  }
}
