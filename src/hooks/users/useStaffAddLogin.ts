import { useState } from 'react'
import type { EmployeeTableDTO } from '@/api/generated/models'
import type { CreateUserFormValues } from '@/types/user/userSchemas'
import { useUserActions } from './useStaffUserActions'
import { useEmployeeActions } from './useStaffActions'

/**
 * Manages the "Create Login" dialog state and the two-step mutation:
 * 1. Create a system user account
 * 2. Link that user to the target employee
 */
export function useCreateEmployeeLogin() {
  const [loginTargetEmployee, setLoginTargetEmployee] = useState<EmployeeTableDTO | null>(null)
  const [isCreateLoginOpen, setIsCreateLoginOpen] = useState(false)
  const [createLoginError, setCreateLoginError] = useState<string | null>(null)

  const { createUser } = useUserActions()
  const { saveEmployee } = useEmployeeActions()

  const openDialog = (employee: EmployeeTableDTO) => {
    setCreateLoginError(null)
    setLoginTargetEmployee(employee)
    setIsCreateLoginOpen(true)
  }

  const closeDialog = () => {
    setIsCreateLoginOpen(false)
    setLoginTargetEmployee(null)
    setCreateLoginError(null)
  }

  const handleSubmit = async (values: CreateUserFormValues) => {
    if (!loginTargetEmployee) return

    setCreateLoginError(null)

    try {
      const result = await createUser.mutateAsync(values)
      const createdUserId = result.data?.id

      if (!createdUserId) {
        throw new Error(result.message ?? 'User created but no user ID returned.')
      }

      await saveEmployee.mutateAsync({
        employee: loginTargetEmployee,
        values: {
          firstName: loginTargetEmployee.firstName,
          surname: loginTargetEmployee.surname,
          middleName: loginTargetEmployee.middleName ?? '',
          contactNo: loginTargetEmployee.contactNo,
          status: loginTargetEmployee.status,
          suffix: loginTargetEmployee.suffix ?? '',
          userId: createdUserId,
        },
      })

      closeDialog()
    } catch (error) {
      setCreateLoginError(
        error instanceof Error ? error.message : 'Failed to create login access.',
      )
    }
  }

  return {
    loginTargetEmployee,
    isCreateLoginOpen,
    createLoginError,
    openDialog,
    closeDialog,
    handleSubmit,
    isPending: createUser.isPending || saveEmployee.isPending,
  }
}
