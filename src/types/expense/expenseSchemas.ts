// Mirrors types/membership/memberSchemas.ts:
// domain/API types, UI form state, and dialog prop types all live here.

// ---------------------------------------------------------------------------
// Domain / API types — discriminated union consumed by useExpenses hooks
// ---------------------------------------------------------------------------

interface ExpenseFormBase {
  id: string
  actorId: string
  branchId: string
  branch: string
  amount: string
  paidAt: Date
  remarks?: string
  receipt: File | null
  objectIds?: Set<string>
}

export interface AssetExpenseFormData extends ExpenseFormBase {
  type: 'asset'
  assetId: string
}

export interface AssetMaintenanceExpenseFormData extends ExpenseFormBase {
  type: 'asset-maintenance'
  assetMaintenanceId: string
}

export interface SalaryExpenseFormData extends ExpenseFormBase {
  type: 'salary'
  salaryType: 'FULL' | 'PARTIAL' | 'ADVANCED'
  period: Date
}

export interface UtilityExpenseFormData extends ExpenseFormBase {
  type: 'utility'
  utilityTypeId: string
  meter: string
  period: Date
}

export interface SuppliesExpenseFormData extends ExpenseFormBase {
  type: 'supplies'
  suppliesLogId: string
}

export interface OtherExpenseFormData extends ExpenseFormBase {
  type: 'other'
  otherExpenseTypeId: string
}

export type ExpenseFormData =
  | AssetExpenseFormData
  | AssetMaintenanceExpenseFormData
  | SalaryExpenseFormData
  | UtilityExpenseFormData
  | SuppliesExpenseFormData
  | OtherExpenseFormData

// Distributed Omit — preserves the discriminated union after removing fields.
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never

export type ExpenseCreateForm = DistributiveOmit<ExpenseFormData, 'id' | 'receipt'>
export type ExpenseUpdateForm = DistributiveOmit<ExpenseFormData, 'receipt'>

// ---------------------------------------------------------------------------
// Legacy flat row — consumed by chart and table components
// ---------------------------------------------------------------------------
export interface LegacyExpenseRow {
  id: string
  type: string
  name: string
  date: Date
  amount: string
  branch: string
  paymentMethod: string
  category: string
  description: string
  receipt: File | null
  salaryType?: string
}

// ---------------------------------------------------------------------------
// UI form state — mirrors MemberFormValues / MemberFormData in memberSchemas.ts.
// Used by useExpenseForm and useExpenseEdit hooks.
// ---------------------------------------------------------------------------

export interface AddExpenseFormData {
  type: string
  name: string
  amount: string
  branch: string
  remarks: string
  description: string
  /** ID from PaymentMethodTableDTO — resolved to a display name inline in the component */
  paymentMethod: string
  // type-specific optional fields
  salaryType?: string
  assetId?: string
  assetMaintenanceId?: string
  utilityTypeId?: string
  meter?: string
  suppliesLogId?: string
  otherExpenseTypeId?: string
}

export const DEFAULT_ADD_FORM: AddExpenseFormData = {
  type: '',
  name: '',
  amount: '',
  branch: '',           // populated at runtime from BRANCHES[0]
  remarks: '',
  description: '',
  paymentMethod: '',
  salaryType: '',
}

export interface EditExpenseFormData {
  type: string
  name: string
  amount: string
  branch: string

  paymentMethod: string
  remarks: string
  description: string
  salaryType: string
}

export const DEFAULT_EDIT_FORM: EditExpenseFormData = {
  type: '',
  name: '',
  amount: '',
  branch: '',
  paymentMethod: '',
  remarks: '',
  description: '',
  salaryType: '',
}