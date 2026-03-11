import { useQuery } from '@tanstack/react-query'
import { getPageableApi, DUMMY_PAGEABLE } from '@/lib/expense/expense-api-client'
import { AssetApi, AssetMaintenanceApi, SuppliesLogsApi } from '@/api/generated/apis'

export interface AssetOption       { id: string; label: string }
export interface MaintenanceOption { id: string; label: string }
export interface SuppliesLogOption { id: string; label: string }

export function useAssetOptions(enabled: boolean) {
  return useQuery<AssetOption[]>({
    queryKey: ['expense-picker', 'assets'],
    enabled,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      try {
        const res = await getPageableApi(AssetApi).getAllAssets({ pageable: DUMMY_PAGEABLE })
        const list = Array.isArray(res.data)
          ? res.data
          : ((res.data as any)?.content ?? [])
        return (list as Array<{ id: string; name: string }>).map((a) => ({
          id: a.id,
          label: a.name,
        }))
      } catch { return [] }
    },
  })
}

export function useMaintenanceOptions(enabled: boolean) {
  return useQuery<MaintenanceOption[]>({
    queryKey: ['expense-picker', 'maintenance'],
    enabled,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      try {
        const res = await getPageableApi(AssetMaintenanceApi).getAllMaintenance({ pageable: DUMMY_PAGEABLE })
        const list = Array.isArray(res.data)
          ? res.data
          : ((res.data as any)?.content ?? [])
        return (list as Array<{ id: string; maintenanceDate: string | Date; status: string }>).map((m) => {
          const d = m.maintenanceDate ? new Date(m.maintenanceDate).toLocaleDateString() : '—'
          return { id: m.id, label: `${d} · ${m.status}` }
        })
      } catch { return [] }
    },
  })
}

export function useSuppliesLogOptions(enabled: boolean) {
  return useQuery<SuppliesLogOption[]>({
    queryKey: ['expense-picker', 'supplies-logs'],
    enabled,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      try {
        const res = await getPageableApi(SuppliesLogsApi).getAllSuppliesLogs({ pageable: DUMMY_PAGEABLE })
        const list = Array.isArray(res.data)
          ? res.data
          : ((res.data as any)?.content ?? [])
        return (list as Array<{ id: string; name: string; quantity: number }>).map((s) => ({
          id: s.id,
          label: `${s.name} (qty: ${s.quantity})`,
        }))
      } catch { return [] }
    },
  })
}