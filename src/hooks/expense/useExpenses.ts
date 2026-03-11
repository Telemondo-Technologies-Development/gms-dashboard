import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import {
  AssetExpenseApi,
  AssetMaintenanceExpenseApi,
  SalaryExpenseApi,
  UtilityExpenseApi,
  SuppliesExpenseApi,
  OtherExpenseApi,
} from '@/api/generated/apis'
import type {
  AssetExpenseCreateDTO, AssetExpenseUpdateDTO,
  AssetMaintenanceExpenseCreateDTO, AssetMaintenanceExpenseUpdateDTO,
  SalaryExpenseCreateDTO, SalaryExpenseUpdateDTO,
  UtilityExpenseCreateDTO, UtilityExpenseUpdateDTO,
  SuppliesExpenseCreateDTO, SuppliesExpenseUpdateDTO,
  OtherExpenseCreateDTO, OtherExpenseUpdateDTO,
} from '@/api/generated/models'
import {
  SalaryExpenseCreateDTOSalaryTypeEnum,
  SalaryExpenseUpdateDTOSalaryTypeEnum,
} from '@/api/generated/models'
import type {
  ExpenseFormData, ExpenseCreateForm, ExpenseUpdateForm,
  AssetExpenseFormData, AssetMaintenanceExpenseFormData,
  SalaryExpenseFormData, UtilityExpenseFormData,
  SuppliesExpenseFormData, OtherExpenseFormData,
} from '@/types/expense/expenseSchemas'
import { expenseQueryKeys } from '@/lib/QueryKeys'
import { getPageableApi, DUMMY_PAGEABLE } from '@/lib/expense/expense-api-client'
import {
  SAMPLE_SALARY_EXPENSE,
  SAMPLE_ASSET_EXPENSE,
  SAMPLE_ASSET_MAINTENANCE_EXPENSE,
  SAMPLE_UTILITY_EXPENSE,
  SAMPLE_SUPPLIES_EXPENSE,
  SAMPLE_OTHER_EXPENSE,
} from '@/lib/expense/expense-sample-data'

// Set to true to use local sample data instead of hitting the API.
// Flip back to false (or remove) before committing.
const USE_SAMPLE_DATA = true

export interface UseAllExpensesResult {
  expenses: ExpenseFormData[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
}


function typeToQueryKey(type: string): readonly string[] {
  const map: Record<string, readonly string[]> = {
    'asset':             expenseQueryKeys.asset,
    'asset-maintenance': expenseQueryKeys.assetMaintenance,
    'salary':            expenseQueryKeys.salary,
    'utility':           expenseQueryKeys.utility,
    'supplies':          expenseQueryKeys.supplies,
  }
  return map[type] ?? expenseQueryKeys.other
}

function toDate(d: Date | string | undefined): Date {
  if (!d) return new Date()
  if (d instanceof Date) return d
  return new Date(d)
}


const str  = (v: unknown): string => String(v ?? '')
const date = (v: unknown): Date   => v ? new Date(String(v)) : new Date()

function extractList<T>(data: unknown, mapper: (r: Record<string, unknown>) => T): T[] {
  if (!data) return []
  if (Array.isArray(data)) return data.map((r) => mapper(r as Record<string, unknown>))
  if (typeof data === 'object' && 'content' in (data as object)) {
    return ((data as { content: unknown[] }).content ?? []).map((r) =>
      mapper(r as Record<string, unknown>),
    )
  }
  return []
}

function rawToAsset(r: Record<string, unknown>): AssetExpenseFormData {
  return { id: str(r.id), type: 'asset', actorId: str(r.actorId), branchId: str(r.branchId), branch: str(r.branchName ?? r.branch), amount: str(r.amount ?? '0'), paidAt: date(r.paidAt), assetId: str(r.assetId), receipt: null }
}
function rawToAssetMaintenance(r: Record<string, unknown>): AssetMaintenanceExpenseFormData {
  return { id: str(r.id), type: 'asset-maintenance', actorId: str(r.actorId), branchId: str(r.branchId), branch: str(r.branchName ?? r.branch), amount: str(r.amount ?? '0'), paidAt: date(r.paidAt), assetMaintenanceId: str(r.assetMaintenanceId), receipt: null }
}
function rawToSalary(r: Record<string, unknown>): SalaryExpenseFormData {
  return { id: str(r.id), type: 'salary', actorId: str(r.actorId), branchId: str(r.branchId), branch: str(r.branchName ?? r.branch), amount: str(r.amount ?? '0'), paidAt: date(r.paidAt), salaryType: (r.salaryType as SalaryExpenseFormData['salaryType']) ?? 'FULL', period: date(r.period), receipt: null }
}
function rawToUtility(r: Record<string, unknown>): UtilityExpenseFormData {
  return { id: str(r.id), type: 'utility', actorId: str(r.actorId), branchId: str(r.branchId), branch: str(r.branchName ?? r.branch), amount: str(r.amount ?? '0'), paidAt: date(r.paidAt), utilityTypeId: str(r.utilityTypeId), meter: str(r.meter), period: date(r.period), receipt: null }
}
function rawToSupplies(r: Record<string, unknown>): SuppliesExpenseFormData {
  return { id: str(r.id), type: 'supplies', actorId: str(r.actorId), branchId: str(r.branchId), branch: str(r.branchName ?? r.branch), amount: str(r.amount ?? '0'), paidAt: date(r.paidAt), suppliesLogId: str(r.suppliesLogId), receipt: null }
}
function rawToOther(r: Record<string, unknown>): OtherExpenseFormData {
  return { id: str(r.id), type: 'other', actorId: str(r.actorId), branchId: str(r.branchId), branch: str(r.branchName ?? r.branch), amount: str(r.amount ?? '0'), paidAt: date(r.paidAt), otherExpenseTypeId: str(r.otherExpenseTypeId), receipt: null }
}


function useAssetExpenses() {
  return useQuery<AssetExpenseFormData[]>({
    queryKey: expenseQueryKeys.asset,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      if (USE_SAMPLE_DATA) return [SAMPLE_ASSET_EXPENSE]
      try {
        return extractList(
          (await getPageableApi(AssetExpenseApi).getAllAssetExpense({ pageable: DUMMY_PAGEABLE })).data,
          rawToAsset,
        )
      } catch (err) {
        console.error('[useAssetExpenses] failed to fetch:', err)
        return []
      }
    },
  })
}
function useAssetMaintenanceExpenses() {
  return useQuery<AssetMaintenanceExpenseFormData[]>({
    queryKey: expenseQueryKeys.assetMaintenance,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      if (USE_SAMPLE_DATA) return [SAMPLE_ASSET_MAINTENANCE_EXPENSE]
      try {
        return extractList(
          (await getPageableApi(AssetMaintenanceExpenseApi).getAllAssetMaintenanceExpense({ pageable: DUMMY_PAGEABLE })).data,
          rawToAssetMaintenance,
        )
      } catch (err) {
        console.error('[useAssetMaintenanceExpenses] failed to fetch:', err)
        return []
      }
    },
  })
}
function useSalaryExpenses() {
  return useQuery<SalaryExpenseFormData[]>({
    queryKey: expenseQueryKeys.salary,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      if (USE_SAMPLE_DATA) return [SAMPLE_SALARY_EXPENSE]
      try {
        return extractList(
          (await getPageableApi(SalaryExpenseApi).getAllSalaryExpense({ pageable: DUMMY_PAGEABLE })).data,
          rawToSalary,
        )
      } catch (err) {
        console.error('[useSalaryExpenses] failed to fetch:', err)
        return []
      }
    },
  })
}
function useUtilityExpenses() {
  return useQuery<UtilityExpenseFormData[]>({
    queryKey: expenseQueryKeys.utility,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      if (USE_SAMPLE_DATA) return [SAMPLE_UTILITY_EXPENSE]
      try {
        return extractList(
          (await getPageableApi(UtilityExpenseApi).getAllUtilityExpense({ pageable: DUMMY_PAGEABLE })).data,
          rawToUtility,
        )
      } catch (err) {
        console.error('[useUtilityExpenses] failed to fetch:', err)
        return []
      }
    },
  })
}
function useSuppliesExpenses() {
  return useQuery<SuppliesExpenseFormData[]>({
    queryKey: expenseQueryKeys.supplies,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      if (USE_SAMPLE_DATA) return [SAMPLE_SUPPLIES_EXPENSE]
      try {
        return extractList(
          (await getPageableApi(SuppliesExpenseApi).getAllSuppliesExpense({ pageable: DUMMY_PAGEABLE })).data,
          rawToSupplies,
        )
      } catch (err) {
        console.error('[useSuppliesExpenses] failed to fetch:', err)
        return []
      }
    },
  })
}
function useOtherExpenses() {
  return useQuery<OtherExpenseFormData[]>({
    queryKey: expenseQueryKeys.other,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      if (USE_SAMPLE_DATA) return [SAMPLE_OTHER_EXPENSE]
      try {
        return extractList(
          (await getPageableApi(OtherExpenseApi).getAllOtherExpense({ pageable: DUMMY_PAGEABLE })).data,
          rawToOther,
        )
      } catch (err) {
        console.error('[useOtherExpenses] failed to fetch:', err)
        return []
      }
    },
  })
}


export function useAllExpenses(): UseAllExpensesResult {
  const queries = [
    useAssetExpenses(),
    useAssetMaintenanceExpenses(),
    useSalaryExpenses(),
    useUtilityExpenses(),
    useSuppliesExpenses(),
    useOtherExpenses(),
  ]
  
  const isError = queries.some((q) => q.isError)
  const errors = queries.filter((q) => q.isError).map((q) => q.error)
  
  if (isError && errors.length > 0) {
    console.warn('[useAllExpenses] some expense queries failed:', errors)
  }
  
  return {
    expenses:   queries.flatMap((q): ExpenseFormData[] => q.data ?? []),
    isLoading:  queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching),
    isError,
    error:      isError ? (errors[0] ?? new Error('Failed to load expenses')) : null,
  }
}


export function useCreateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: ExpenseCreateForm): Promise<unknown> => {
      if (USE_SAMPLE_DATA) {
        console.debug('[useCreateExpense] sample mode — skipping API call', form)
        return Promise.resolve()
      }
      console.debug('[useCreateExpense] submitting form:', form)
      const base = {
        actorId:  form.actorId,
        branchId: form.branchId,
        amount:   parseFloat(form.amount),
        paidAt:   toDate(form.paidAt),
        remarks:  (form as any).remarks || undefined,
      }
      switch (form.type) {
        case 'asset':
          return getAuthenticatedApi(AssetExpenseApi).createAssetExpense({
            assetExpenseCreateDTO: {
              ...base,
              assetId: form.assetId || undefined,
            } as AssetExpenseCreateDTO,
          })
        case 'asset-maintenance':
          return getAuthenticatedApi(AssetMaintenanceExpenseApi).createAssetMaintenanceExpense({
            assetMaintenanceExpenseCreateDTO: {
              ...base,
              assetMaintenanceId: form.assetMaintenanceId || undefined,
            } as AssetMaintenanceExpenseCreateDTO,
          })
        case 'salary':
          return getAuthenticatedApi(SalaryExpenseApi).createSalaryExpense({
            salaryExpenseCreateDTO: {
              ...base,
              period:     toDate(form.period),
              salaryType: form.salaryType as SalaryExpenseCreateDTOSalaryTypeEnum,
            } as SalaryExpenseCreateDTO,
          })
        case 'utility':
          return getAuthenticatedApi(UtilityExpenseApi).createUtilityExpense({
            utilityExpenseCreateDTO: {
              ...base,
              period:        toDate(form.period),
              utilityTypeId: form.utilityTypeId || undefined,
              meter:         form.meter || undefined,
            } as UtilityExpenseCreateDTO,
          })
        case 'supplies':
          return getAuthenticatedApi(SuppliesExpenseApi).createSuppliesExpense({
            suppliesExpenseCreateDTO: {
              ...base,
              suppliesLogId: form.suppliesLogId || undefined,
            } as SuppliesExpenseCreateDTO,
          })
        default: {
          const f = form as OtherExpenseFormData
          return getAuthenticatedApi(OtherExpenseApi).createOtherExpense({
            otherExpenseCreateDTO: {
              ...base,
              otherExpenseTypeId: f.otherExpenseTypeId || undefined,
            } as OtherExpenseCreateDTO,
          })
        }
      }
    },
    onSuccess: (_, v) => {
      if (USE_SAMPLE_DATA) {
        // In sample mode the query never re-fetches, so push the new entry into
        // the cache directly so it appears in the table immediately.
        const queryKey = typeToQueryKey(v.type)
        const newEntry = {
          ...v,
          id: `sample-${v.type}-${Date.now()}`,
          receipt: null,
        } as ExpenseFormData
        qc.setQueryData<ExpenseFormData[]>(queryKey, (prev) => [...(prev ?? []), newEntry])
      } else {
        qc.invalidateQueries({ queryKey: typeToQueryKey(v.type) })
      }
    },
    onError: (err, vars) => {
      console.error('[useCreateExpense] mutation failed for:', vars, err)
    },
  })
}


export function useUpdateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: ExpenseUpdateForm): Promise<unknown> => {
      if (USE_SAMPLE_DATA) {
        console.debug('[useUpdateExpense] sample mode — skipping API call', form)
        return Promise.resolve()
      }
      const base = {
        actorId:  form.actorId,
        branchId: form.branchId,
        amount:   parseFloat(form.amount),
        paidAt:   toDate(form.paidAt),
        remarks:  (form as any).remarks || undefined,
      }
      switch (form.type) {
        case 'asset':
          return getAuthenticatedApi(AssetExpenseApi).updateAssetExpense({
            id: form.id,
            assetExpenseUpdateDTO: {
              ...base,
              assetId: form.assetId || undefined,
            } as AssetExpenseUpdateDTO,
          })
        case 'asset-maintenance':
          return getAuthenticatedApi(AssetMaintenanceExpenseApi).updateAssetMaintenanceExpense({
            id: form.id,
            assetMaintenanceExpenseUpdateDTO: {
              ...base,
              assetMaintenanceId: form.assetMaintenanceId || undefined,
            } as AssetMaintenanceExpenseUpdateDTO,
          })
        case 'salary':
          return getAuthenticatedApi(SalaryExpenseApi).updateSalaryExpense({
            id: form.id,
            salaryExpenseUpdateDTO: {
              ...base,
              period:     toDate(form.period),
              salaryType: form.salaryType as SalaryExpenseUpdateDTOSalaryTypeEnum,
            } as SalaryExpenseUpdateDTO,
          })
        case 'utility':
          return getAuthenticatedApi(UtilityExpenseApi).updateUtilityExpense({
            id: form.id,
            utilityExpenseUpdateDTO: {
              ...base,
              period:        toDate(form.period),
              utilityTypeId: form.utilityTypeId || undefined,
              meter:         form.meter || undefined,
            } as UtilityExpenseUpdateDTO,
          })
        case 'supplies':
          return getAuthenticatedApi(SuppliesExpenseApi).updateSuppliesExpense({
            id: form.id,
            suppliesExpenseUpdateDTO: {
              ...base,
              suppliesLogId: form.suppliesLogId || undefined,
            } as SuppliesExpenseUpdateDTO,
          })
        default: {
          const f = form as OtherExpenseFormData
          return getAuthenticatedApi(OtherExpenseApi).updateOtherExpense({
            id: f.id,
            otherExpenseUpdateDTO: {
              ...base,
              otherExpenseTypeId: f.otherExpenseTypeId || undefined,
            } as OtherExpenseUpdateDTO,
          })
        }
      }
    },
    onSuccess: (_, v) => {
      if (USE_SAMPLE_DATA) {
        // Replace the matching entry in the cache with the updated values.
        const queryKey = typeToQueryKey(v.type)
        qc.setQueryData<ExpenseFormData[]>(queryKey, (prev) =>
          (prev ?? []).map((e) => e.id === v.id ? ({ ...e, ...v, receipt: e.receipt }) as ExpenseFormData : e)
        )
      } else {
        qc.invalidateQueries({ queryKey: typeToQueryKey(v.type) })
      }
    },
  })
}

// useDeleteExpense
export function useDeleteExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: string }): Promise<void> => {
      if (USE_SAMPLE_DATA) {
        console.debug('[useDeleteExpense] sample mode — skipping API call', { id, type })
        return
      }
      switch (type) {
        case 'asset':             await getAuthenticatedApi(AssetExpenseApi).deleteAssetExpense({ id }); break
        case 'asset-maintenance': await getAuthenticatedApi(AssetMaintenanceExpenseApi).deleteAssetMaintenanceExpense({ id }); break
        case 'salary':            await getAuthenticatedApi(SalaryExpenseApi).deleteSalaryExpense({ id }); break
        case 'utility':           await getAuthenticatedApi(UtilityExpenseApi).deleteUtilityExpense({ id }); break
        case 'supplies':          await getAuthenticatedApi(SuppliesExpenseApi).deleteSuppliesExpense({ id }); break
        default:                  await getAuthenticatedApi(OtherExpenseApi).deleteOtherExpense({ id })
      }
    },
    onSuccess: (_, v) => {
      if (USE_SAMPLE_DATA) {
        // Remove the deleted entry from the cache directly.
        const queryKey = typeToQueryKey(v.type)
        qc.setQueryData<ExpenseFormData[]>(queryKey, (prev) =>
          (prev ?? []).filter((e) => e.id !== v.id)
        )
      } else {
        qc.invalidateQueries({ queryKey: typeToQueryKey(v.type) })
      }
    },
  })
}