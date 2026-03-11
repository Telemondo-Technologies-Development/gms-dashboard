import { useQuery } from '@tanstack/react-query'

import { getAuthenticatedApi } from '@/lib/api-client'
import { AccessControlApi } from '@/api/generated/apis'
import type { RoleTableDTO } from '@/api/generated/models'
import { accessControlQueryKeys } from '@/lib/QueryKeys'

const accessControlApi = getAuthenticatedApi(AccessControlApi)

export function useAllRoles() {
  return useQuery<RoleTableDTO[]>({
    queryKey: accessControlQueryKeys.roles,
    queryFn: async () => {
      const response = await accessControlApi.getAllRoles({
        pageable: { page: 0, size: 1000 },
      })
      return response.success && Array.isArray(response.data) ? response.data : []
    },
    staleTime: 5 * 60 * 1000,
  })
}
