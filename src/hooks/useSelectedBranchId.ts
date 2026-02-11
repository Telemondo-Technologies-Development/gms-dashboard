/**

 * 
 * Branch selection flow:
 * 1. Login → setAuthSession(token, assignedBranches)
 * 2. User selects branch → setSelectedBranch(id, name)
 * 3. Pages use useSelectedBranchId() → queries depend on branch
 * 4. React Query handles caching globally per branch
 */

import { useUserStore } from '@/lib/auth/user-store'

export function useSelectedBranchId(): string | null {
  return useUserStore((state) => state.selectedBranchId)
}

export function useSelectedBranchName(): string | null {
  return useUserStore((state) => state.selectedBranchName)
}

export function useSelectedBranch(): { id: string | null; name: string | null } {
  const id = useUserStore((state) => state.selectedBranchId)
  const name = useUserStore((state) => state.selectedBranchName)
  return { id, name }
}
