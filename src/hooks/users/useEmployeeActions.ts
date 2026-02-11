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

/**
 * Hook for employee mutations (create, update, delete)
 */
export function useEmployeeActions() {
  const queryClient = useQueryClient()
  const employeeApi = getAuthenticatedApi(EmployeeApi)

  const createEmployee = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const response = await employeeApi.createEmployee({
        employeePostDTO: {
          firstName: values.firstName,
          surname: values.surname,
          middleName: values.middleName,
          contactNo: values.contactNo,
          status: values.status as EmployeePostDTOStatusEnum,
          suffix: values.suffix,
          userId: values.userId,
          profilePictureId: values.profilePictureId,
        },
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [employeeQueryKeys.employee] })
    },
  })

  const updateEmployee = useMutation({
    mutationFn: async ({ 
      id, 
      values 
    }: { 
      id: string
      values: EmployeeFormValues 
    }) => {
      const response = await employeeApi.updateEmployee({
        id,
        employeePutDTO: {
          firstName: values.firstName,
          surname: values.surname,
          middleName: values.middleName,
          contactNo: values.contactNo,
          status: values.status as EmployeePutDTOStatusEnum,
          suffix: values.suffix,
          userId: values.userId,
          profilePictureId: values.profilePictureId,
        },
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [employeeQueryKeys.employee] })
    },
  })

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      await employeeApi.deleteEmployee({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [employeeQueryKeys.employee] })
    },
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
  })

  return {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    saveEmployee,
  }
}
