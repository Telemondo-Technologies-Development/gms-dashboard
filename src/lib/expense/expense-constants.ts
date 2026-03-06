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

export const DATE_RANGE_OPTIONS = [
  { value: '1m',  label: 'Last 1 Month' },
  { value: '3m',  label: 'Last 3 Months' },
  { value: '6m',  label: 'Last 6 Months' },
  { value: '1y',  label: 'Last 1 Year' },
  { value: 'all', label: 'All Time' },
] as const

export type DateRangeOption = typeof DATE_RANGE_OPTIONS[number]['value']

/** Returns a Date that is `months` months before today, or undefined for 'all'. */
export function dateRangeStart(range: DateRangeOption): Date | undefined {
  if (range === 'all') return undefined
  const d = new Date()
  const months = range === '1m' ? 1 : range === '3m' ? 3 : range === '6m' ? 6 : 12
  d.setMonth(d.getMonth() - months)
  return d
}