/**
 * Example Usage of useUserStore
 * 
 * This file demonstrates how to use the global user store across your application.
 * Delete this file once you understand the patterns.
 */

import { useUserStore } from './user-store'

// ============================================
// Example 1: Read employee and branch data
// ============================================
export function MyComponent() {
  // Access specific fields (recommended - only re-renders when these fields change)
  const employeeFullName = useUserStore((state) => state.employeeFullName)
  const selectedBranchName = useUserStore((state) => state.selectedBranchName)
  const selectedBranchId = useUserStore((state) => state.selectedBranchId)

  return (
    <div>
      <h1>Welcome, {employeeFullName ?? 'Guest'}!</h1>
      <p>Branch: {selectedBranchName ?? 'No branch assigned'}</p>
      <p>Branch ID: {selectedBranchId ?? 'N/A'}</p>
    </div>
  )
}

// ============================================
// Example 2: Access all employee data
// ============================================
export function EmployeeProfile() {
  const {
    employeeId,
    employeeFirstName,
    employeeSurname,
    employeeFullName,
    actorId,
  } = useUserStore((state) => ({
    employeeId: state.employeeId,
    employeeFirstName: state.employeeFirstName,
    employeeSurname: state.employeeSurname,
    employeeFullName: state.employeeFullName,
    actorId: state.actorId,
  }))

  return (
    <div>
      <h2>Employee Profile</h2>
      <p>ID: {employeeId}</p>
      <p>Name: {employeeFullName}</p>
      <p>First Name: {employeeFirstName}</p>
      <p>Surname: {employeeSurname}</p>
      <p>Actor ID: {actorId}</p>
    </div>
  )
}

// ============================================
// Example 3: Conditional rendering based on branch
// ============================================
export function BranchSpecificFeature() {
  const selectedBranchId = useUserStore((state) => state.selectedBranchId)

  if (!selectedBranchId) {
    return <div>Please select a branch to continue</div>
  }

  return <div>Content for branch: {selectedBranchId}</div>
}

// ============================================
// Example 4: Using actions (rare - Header already handles this)
// ============================================
export function AdminPanel() {
  const { setEmployee, setSelectedBranch, clearUser } = useUserStore()

  const handleSwitchBranch = () => {
    setSelectedBranch({
      id: 'branch-123',
      name: 'Downtown Branch',
    })
  }

  const handleLogout = () => {
    clearUser() // Clears all user data from store
  }

  return (
    <div>
      <button onClick={handleSwitchBranch}>Switch Branch</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

// ============================================
// Example 5: Use in API calls or utilities
// ============================================
export function fetchBranchData() {
  // Access store outside of React components
  const { selectedBranchId, employeeId } = useUserStore.getState()

  if (!selectedBranchId) {
    throw new Error('No branch selected')
  }

  // Use in API calls
  return fetch(`/api/branches/${selectedBranchId}/data`, {
    headers: {
      'X-Employee-ID': employeeId ?? '',
    },
  })
}

// ============================================
// Example 6: Subscribe to changes (advanced)
// ============================================
export function setupBranchListener() {
  // Listen to branch changes outside of React
  const unsubscribe = useUserStore.subscribe(
    (state, prevState) => {
      if (state.selectedBranchId !== prevState.selectedBranchId) {
        console.log('Branch changed to:', state.selectedBranchId)
        // Perform side effects when branch changes
      }
    }
  )

  // Call unsubscribe() when done
  return unsubscribe
}
