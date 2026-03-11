import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface UserState {
  // Employee information
  employeeId: string | null
  employeeFirstName: string | null
  employeeSurname: string | null
  employeeFullName: string | null
  actorId: string | null

  // Selected branch (user's active branch choice)
  selectedBranchId: string | null
  selectedBranchName: string | null

  // Actions
  setEmployee: (employee: {
    id: string | null
    firstName: string | null
    surname: string | null
    actorId: string | null
  }) => void
  setSelectedBranch: (branch: { id: string | null; name: string | null }) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        employeeId: null,
        employeeFirstName: null,
        employeeSurname: null,
        employeeFullName: null,
        actorId: null,
        selectedBranchId: null,
        selectedBranchName: null,

        // Actions
        setEmployee: (employee) =>
          set((state) => ({
            employeeId: employee.id,
            employeeFirstName: employee.firstName,
            employeeSurname: employee.surname,
            employeeFullName:
              employee.firstName || employee.surname
                ? `${employee.firstName ?? ''} ${employee.surname ?? ''}`.trim()
                : null,
            actorId: employee.actorId,
          })),

        setSelectedBranch: (branch) =>
          set((state) => ({
            selectedBranchId: branch.id,
            selectedBranchName: branch.name,
          })),

        clearUser: () =>
          set({
            employeeId: null,
            employeeFirstName: null,
            employeeSurname: null,
            employeeFullName: null,
            actorId: null,
            selectedBranchId: null,
            selectedBranchName: null,
          }),
      }),
      {
        name: 'user-storage', // localStorage key
      }
    ),
    {
      name: 'UserStore', // DevTools name
    }
  )
)
