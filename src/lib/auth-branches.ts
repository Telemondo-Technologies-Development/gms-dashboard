import { z } from 'zod'
import type { BranchListDTO } from '@/api/generated/models'

const branchListSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
})

const branchesSchema = z.array(branchListSchema)

export function normalizeBranches(input: unknown): BranchListDTO[] {
  const parsed = branchesSchema.safeParse(input)
  return parsed.success ? parsed.data : []
}

export function getStoredAuthBranches(): BranchListDTO[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem('auth_branches')
  if (!raw) return []

  try {
    const parsedJson: unknown = JSON.parse(raw)
    return normalizeBranches(parsedJson)
  } catch {
    return []
  }
}

export function storeAuthBranches(branches: BranchListDTO[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('auth_branches', JSON.stringify(branches))
}
