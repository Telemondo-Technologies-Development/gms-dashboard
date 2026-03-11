import { useMemo } from 'react'

import { useEmployees } from '@/hooks/users/useStaffEmployees'
import type { EmployeeTableDTO } from '@/api/generated/models/EmployeeTableDTO'

type EmployeeLookupInput =
  | string
  | null
  | undefined
  | {
      ids?: Array<string | null | undefined>
      email?: string | null | undefined
    }

interface UseEmployeeDisplayNameResult {
  displayName: string | null
  isLoading: boolean
  employee: EmployeeTableDTO | null
}

export function useEmployeeDisplayName(input: EmployeeLookupInput): UseEmployeeDisplayNameResult {
  const normalizedIds = useMemo(() => {
    if (typeof input === 'string' || input == null) {
      const id = (input ?? '').trim()
      return id ? [id] : []
    }

    return (input.ids ?? [])
      .map((id) => (id ?? '').trim())
      .filter((id, index, array) => !!id && array.indexOf(id) === index)
  }, [input])

  const normalizedEmail = useMemo(() => {
    if (typeof input === 'string' || input == null) return ''
    return (input.email ?? '').trim().toLowerCase()
  }, [input])

  const { data: employees, isLoading } = useEmployees(0, 500, normalizedIds.length > 0 || !!normalizedEmail)

  const employee = useMemo(() => {
    if (!employees?.length) return null

    for (const id of normalizedIds) {
      const matchedById = employees.find(
        (item) =>
          item.actorId === id ||
          item.id === id ||
          item.userId === id,
      )
      if (matchedById) return matchedById
    }

    if (normalizedEmail) {
      const matchedByEmail = employees.find((item) => item.username?.trim().toLowerCase() === normalizedEmail)
      if (matchedByEmail) return matchedByEmail
    }

    return null
  }, [employees, normalizedEmail, normalizedIds])

  const displayName = useMemo(() => {
    if (!employee) return null

    const fullName = [employee.firstName, employee.middleName, employee.surname, employee.suffix]
      .filter(Boolean)
      .join(' ')
      .trim()

    if (fullName) return fullName
    return employee.username?.trim() || null
  }, [employee])

  return {
    displayName,
    isLoading,
    employee,
  }
}
