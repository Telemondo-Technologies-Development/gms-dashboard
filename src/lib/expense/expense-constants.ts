export const BRANCHES = ['Main Branch'] as const

export const EXPENSE_TYPES = [
  { value: 'salary',            label: 'Salary' },
  { value: 'asset',             label: 'Asset' },
  { value: 'asset-maintenance', label: 'Asset Maintenance' },
  { value: 'supplies',          label: 'Supplies' },
  { value: 'utility',           label: 'Utility' },
  { value: 'other',             label: 'Other' },
] as const

export const SALARY_TYPES = [
  { value: 'FULL',     label: 'Full' },
  { value: 'PARTIAL',  label: 'Partial' },
  { value: 'ADVANCED', label: 'Advance' },
] as const