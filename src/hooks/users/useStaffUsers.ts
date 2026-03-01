import { useQuery } from '@tanstack/react-query'

import { getAuthenticatedApi } from '@/lib/api-client'
import { UserApi } from '@/api/generated/apis'
import type { UserTableDTO } from '@/api/generated/models'

const userQueryKeys = ['users'] as const

/**
 * Hook to fetch all users with pagination
 */
export function useUsers(page: number = 0, size: number = 500) {
  const userApi = getAuthenticatedApi(UserApi)

  return useQuery<UserTableDTO[], Error>({
    queryKey: [...userQueryKeys, page, size],
    queryFn: async () => {
      const response = await userApi.getAllUsers({ 
        pageable: { page, size } 
      })
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch users')
      }
      return response.data ?? []
    },
    staleTime: 30_000,
  })
}

export { userQueryKeys }
