/**
 * Branch Data Validation & Normalization
 * 
 * Zod schemas for validating and normalizing branch data from API responses.
 * 
 * Note: Branch persistence is handled by Zustand persist middleware in auth-session.ts.
 * This module only provides validation - no localStorage access needed.
 * 
 * @see auth-session.ts for branch storage and retrieval
 */

import { z } from 'zod'
import type { BranchListDTO } from '@/api/generated/models'

const branchListSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
})

const branchesSchema = z.array(branchListSchema)

/**
 * Validates and normalizes branch data from API responses.
 * Note: Branch persistence is handled by Zustand in auth-session.ts
 */
export function normalizeBranches(input: unknown): BranchListDTO[] {
  const parsed = branchesSchema.safeParse(input)
  return parsed.success ? parsed.data : []
}
