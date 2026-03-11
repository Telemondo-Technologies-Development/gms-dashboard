import type {
  AssetExpenseFormData,
  AssetMaintenanceExpenseFormData,
  SalaryExpenseFormData,
  UtilityExpenseFormData,
  SuppliesExpenseFormData,
  OtherExpenseFormData,
  ExpenseFormData,
} from '@/types/expense/expenseSchemas'
import type { LegacyExpenseRow } from '@/lib/expense/expense-types'

const str  = (v: unknown): string => String(v ?? '')
const date = (v: unknown): Date   => v ? new Date(String(v)) : new Date()

export function extractList<T>(
  data: unknown,
  mapper: (r: Record<string, unknown>) => T,
): T[] {
  if (!data) return []
  if (Array.isArray(data)) return data.map((r) => mapper(r as Record<string, unknown>))
  if (typeof data === 'object' && 'content' in (data as object)) {
    return ((data as { content: unknown[] }).content ?? []).map((r) =>
      mapper(r as Record<string, unknown>),
    )
  }
  return []
}

export function rawToAsset(r: Record<string, unknown>): AssetExpenseFormData {
  return {
    id: str(r.id), type: 'asset',
    actorId: str(r.actorId), branchId: str(r.branchId),
    branch: str(r.branchName ?? r.branch),
    amount: str(r.amount ?? '0'), paidAt: date(r.paidAt),
    assetId: str(r.assetId), receipt: null,
  }
}

export function rawToAssetMaintenance(r: Record<string, unknown>): AssetMaintenanceExpenseFormData {
  return {
    id: str(r.id), type: 'asset-maintenance',
    actorId: str(r.actorId), branchId: str(r.branchId),
    branch: str(r.branchName ?? r.branch),
    amount: str(r.amount ?? '0'), paidAt: date(r.paidAt),
    assetMaintenanceId: str(r.assetMaintenanceId), receipt: null,
  }
}

export function rawToSalary(r: Record<string, unknown>): SalaryExpenseFormData {
  return {
    id: str(r.id), type: 'salary',
    actorId: str(r.actorId), branchId: str(r.branchId),
    branch: str(r.branchName ?? r.branch),
    amount: str(r.amount ?? '0'), paidAt: date(r.paidAt),
    salaryType: (r.salaryType as SalaryExpenseFormData['salaryType']) ?? 'FULL',
    period: date(r.period), receipt: null,
  }
}

export function rawToUtility(r: Record<string, unknown>): UtilityExpenseFormData {
  return {
    id: str(r.id), type: 'utility',
    actorId: str(r.actorId), branchId: str(r.branchId),
    branch: str(r.branchName ?? r.branch),
    amount: str(r.amount ?? '0'), paidAt: date(r.paidAt),
    utilityTypeId: str(r.utilityTypeId), meter: str(r.meter),
    period: date(r.period), receipt: null,
  }
}

export function rawToSupplies(r: Record<string, unknown>): SuppliesExpenseFormData {
  return {
    id: str(r.id), type: 'supplies',
    actorId: str(r.actorId), branchId: str(r.branchId),
    branch: str(r.branchName ?? r.branch),
    amount: str(r.amount ?? '0'), paidAt: date(r.paidAt),
    suppliesLogId: str(r.suppliesLogId), receipt: null,
  }
}

export function rawToOther(r: Record<string, unknown>): OtherExpenseFormData {
  return {
    id: str(r.id), type: 'other',
    actorId: str(r.actorId), branchId: str(r.branchId),
    branch: str(r.branchName ?? r.branch),
    amount: str(r.amount ?? '0'), paidAt: date(r.paidAt),
    otherExpenseTypeId: str(r.otherExpenseTypeId), receipt: null,
  }
}

export const MAPPERS: Record<string, (r: Record<string, unknown>) => ExpenseFormData> = {
  asset:             rawToAsset,
  'asset-maintenance': rawToAssetMaintenance,
  salary:            rawToSalary,
  utility:           rawToUtility,
  supplies:          rawToSupplies,
  other:             rawToOther,
}

export function toLegacyRow(e: ExpenseFormData): LegacyExpenseRow {
  const salaryType = e.type === 'salary' ? (e as SalaryExpenseFormData).salaryType : undefined
  return {
    id:            e.id,
    type:          e.type,
    name:          e.type,          // API has no display-name field; type is best proxy
    date:          (e as any).paidAt,
    amount:        (e as any).amount,
    branch:        (e as any).branch,
    paymentMethod: '',              // not stored on expense API entities
    category:      'operational',
    description:   (e as any).remarks ?? '',
    receipt:       (e as any).receipt ?? null,
    salaryType,
  }
}