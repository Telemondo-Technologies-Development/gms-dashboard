import { useMemo, useState } from 'react'
import type { EmployeeTableDTO } from '@/api/generated/models'

/**
 * Hook to filter employees by a search term across name, email, contact, and status.
 */
export function useEmployeeSearch(employees: EmployeeTableDTO[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedSearch = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm],
  )

  const filteredEmployees = useMemo(() => {
    const list = employees ?? []
    if (!normalizedSearch) return list
    return list.filter((employee) => {
      const name = `${employee.firstName} ${employee.surname}`.toLowerCase()
      const email = employee.user?.email?.toLowerCase() ?? ''
      const contact = employee.contactNo?.toLowerCase() ?? ''
      const status = employee.status?.toLowerCase() ?? ''
      return (
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        contact.includes(normalizedSearch) ||
        status.includes(normalizedSearch)
      )
    })
  }, [employees, normalizedSearch])

  return { searchTerm, setSearchTerm, normalizedSearch, filteredEmployees }
}
