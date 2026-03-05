/**
 * expense-sample-data.ts
 *
 * Sample expense data for development and manual testing of the
 * Expense Management page. Import wherever mock data is needed.
 *
 * Usage:
 *   import { SAMPLE_EXPENSES, SAMPLE_BRANCH } from '@/lib/expense/expense-sample-data'
 */

import type {
  AssetExpenseFormData,
  AssetMaintenanceExpenseFormData,
  SalaryExpenseFormData,
  UtilityExpenseFormData,
  SuppliesExpenseFormData,
  OtherExpenseFormData,
  ExpenseFormData,
} from '@/types/expense/expenseSchemas'

// ─── Shared branch ────────────────────────────────────────────────────────────

export const SAMPLE_BRANCH = {
  id:   'branch-001',
  name: 'Matina',
} as const

export const SAMPLE_ACTOR_ID = 'actor-001'

// ─── Individual sample records ────────────────────────────────────────────────

export const SAMPLE_SALARY_EXPENSE: SalaryExpenseFormData = {
  id:         'exp-salary-001',
  type:       'salary',
  actorId:    SAMPLE_ACTOR_ID,
  branchId:   SAMPLE_BRANCH.id,
  branch:     SAMPLE_BRANCH.name,
  amount:     '15000',
  paidAt:     new Date('2026-02-01'),
  salaryType: 'FULL',
  period:     new Date('2026-02-01'),
  receipt:    null,
}

export const SAMPLE_ASSET_EXPENSE: AssetExpenseFormData = {
  id:       'exp-asset-001',
  type:     'asset',
  actorId:  SAMPLE_ACTOR_ID,
  branchId: SAMPLE_BRANCH.id,
  branch:   SAMPLE_BRANCH.name,
  amount:   '12000',
  paidAt:   new Date('2026-02-05'),
  assetId:  'asset-treadmill-001',
  receipt:  null,
}

export const SAMPLE_ASSET_MAINTENANCE_EXPENSE: AssetMaintenanceExpenseFormData = {
  id:                 'exp-maintenance-001',
  type:               'asset-maintenance',
  actorId:            SAMPLE_ACTOR_ID,
  branchId:           SAMPLE_BRANCH.id,
  branch:             SAMPLE_BRANCH.name,
  amount:             '2500',
  paidAt:             new Date('2026-02-10'),
  assetMaintenanceId: 'maintenance-001',
  receipt:            null,
}

export const SAMPLE_UTILITY_EXPENSE: UtilityExpenseFormData = {
  id:            'exp-utility-001',
  type:          'utility',
  actorId:       SAMPLE_ACTOR_ID,
  branchId:      SAMPLE_BRANCH.id,
  branch:        SAMPLE_BRANCH.name,
  amount:        '4800',
  paidAt:        new Date('2026-02-12'),
  utilityTypeId: 'utility-electric-001',
  meter:         'MTR-00421',
  period:        new Date('2026-02-01'),
  receipt:       null,
}

export const SAMPLE_SUPPLIES_EXPENSE: SuppliesExpenseFormData = {
  id:            'exp-supplies-001',
  type:          'supplies',
  actorId:       SAMPLE_ACTOR_ID,
  branchId:      SAMPLE_BRANCH.id,
  branch:        SAMPLE_BRANCH.name,
  amount:        '1200',
  paidAt:        new Date('2026-02-14'),
  suppliesLogId: 'supplies-log-001',
  receipt:       null,
}

export const SAMPLE_OTHER_EXPENSE: OtherExpenseFormData = {
  id:                 'exp-other-001',
  type:               'other',
  actorId:            SAMPLE_ACTOR_ID,
  branchId:           SAMPLE_BRANCH.id,
  branch:             SAMPLE_BRANCH.name,
  amount:             '3500',
  paidAt:             new Date('2026-02-15'),
  otherExpenseTypeId: 'other-type-001',
  receipt:            null,
}

// ─── All samples as a single array ───────────────────────────────────────────

export const SAMPLE_EXPENSES: ExpenseFormData[] = [
  SAMPLE_SALARY_EXPENSE,
  SAMPLE_ASSET_EXPENSE,
  SAMPLE_ASSET_MAINTENANCE_EXPENSE,
  SAMPLE_UTILITY_EXPENSE,
  SAMPLE_SUPPLIES_EXPENSE,
  SAMPLE_OTHER_EXPENSE,
]

// ─── Sample branches list (mirrors useBranches shape) ────────────────────────

export const SAMPLE_BRANCHES = [
  { id: 'branch-001', name: 'Matina' },
  { id: 'branch-002', name: 'Buhangin' },
]

// ─── Sample payment methods (mirrors PaymentApi shape) ───────────────────────

export const SAMPLE_PAYMENT_METHODS = [
  { id: 'pm-001', name: 'Cash' },
  { id: 'pm-002', name: 'GCash' },
  { id: 'pm-003', name: 'Bank Transfer' },
]