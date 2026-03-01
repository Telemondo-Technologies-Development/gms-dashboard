interface ExpenseFormBase {
  id: string
  actorId: string
  branchId: string
  branch: string
  amount: string
  paidAt: Date
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


type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never

export type ExpenseCreateForm = DistributiveOmit<ExpenseFormData, 'id' | 'receipt'>
export type ExpenseUpdateForm = DistributiveOmit<ExpenseFormData, 'receipt'>


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



export interface AddExpenseFormData {
  type: string
  name: string
  amount: string
  branch: string

  paymentMethod: string
  category: string
  description: string
  salaryType: string

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
  branch: '',           
  paymentMethod: '',
  category: 'operational',
  description: '',
  salaryType: '',
}

export interface EditExpenseFormData {
  type: string
  name: string
  amount: string
  branch: string
  paymentMethod: string
  description: string
  salaryType: string
}

export const DEFAULT_EDIT_FORM: EditExpenseFormData = {
  type: '',
  name: '',
  amount: '',
  branch: '',
  paymentMethod: '',
  description: '',
  salaryType: '',
}