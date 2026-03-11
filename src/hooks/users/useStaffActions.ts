import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getAuthenticatedApi } from '@/lib/api-client'
import { EmployeeApi } from '@/api/generated/apis'
import type {
  EmployeePostDTOStatusEnum,
  EmployeePutDTOStatusEnum,
  EmployeeTableDTO,
} from '@/api/generated/models'
import type { EmployeeFormValues } from '@/types/user/userSchemas'
import { employeeQueryKeys } from '@/lib/QueryKeys'

function toOptionalString(value: string | undefined): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/**
 * Hook for employee mutations (create, update, delete)
 */
export function useEmployeeActions() {
  const queryClient = useQueryClient()
  const employeeApi = getAuthenticatedApi(EmployeeApi)

  const invalidateEmployees = () =>
    queryClient.invalidateQueries({ queryKey: employeeQueryKeys.employee })

  const createEmployee = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const middleName = toOptionalString(values.middleName)
      const suffix = toOptionalString(values.suffix)
      const userId = toOptionalString(values.userId)
      const profilePictureId = toOptionalString(values.profilePictureId)

      const response = await employeeApi.createEmployee({
        employeePostDTO: {
          firstName: values.firstName,
          surname: values.surname,
          middleName,
          contactNo: values.contactNo,
          status: values.status as EmployeePostDTOStatusEnum,
          suffix,
          userId,
          profilePictureId,
        },
      })
      return response
    },
    onSuccess: invalidateEmployees,
  })

  const updateEmployee = useMutation({
    mutationFn: async ({ 
      id, 
      values 
    }: { 
      id: string
      values: EmployeeFormValues 
    }) => {
      const middleName = toOptionalString(values.middleName)
      const suffix = toOptionalString(values.suffix)
      const userId = toOptionalString(values.userId)
      const profilePictureId = toOptionalString(values.profilePictureId)

      const response = await employeeApi.updateEmployee({
        id,
        employeePutDTO: {
          firstName: values.firstName,
          surname: values.surname,
          middleName,
          contactNo: values.contactNo,
          status: values.status as EmployeePutDTOStatusEnum,
          suffix,
          userId,
          profilePictureId,
        },
      })
      return response
    },
    onSuccess: invalidateEmployees,
  })

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      await employeeApi.deleteEmployee({ id })
    },
    onSuccess: invalidateEmployees,
  })

  const saveEmployee = useMutation({
    mutationFn: async ({ 
      employee, 
      values 
    }: { 
      employee: EmployeeTableDTO | null
      values: EmployeeFormValues 
    }) => {
      if (employee) {
        return updateEmployee.mutateAsync({ id: employee.id, values })
      } else {
        return createEmployee.mutateAsync(values)
      }
    },
    onSuccess: invalidateEmployees,
  })

  return {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    saveEmployee,
  }
}
