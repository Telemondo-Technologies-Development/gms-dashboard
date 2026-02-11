import { useQuery } from '@tanstack/react-query'

import { getAuthenticatedApi } from '@/lib/api-client'
import { EmployeeApi } from '@/api/generated/apis'
import type { EmployeeTableDTO } from '@/api/generated/models'

import { employeeQueryKeys } from '@/lib/QueryKeys'



/**
 * Hook to fetch all employees with pagination
 */
export function useEmployees(page: number = 0, size: number = 500, enabled: boolean = true) {
  const employeeApi = getAuthenticatedApi(EmployeeApi)

  return useQuery<EmployeeTableDTO[], Error>({
    queryKey: [...employeeQueryKeys.employee, page, size],
    enabled,
    queryFn: async () => {
      const response = await employeeApi.getAllEmployees({ 
        pageable: { page, size } 
      })
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch employees')
      }
      return response.data ?? []
    },
    staleTime: 30_000,
  })
}

export { employeeQueryKeys }
