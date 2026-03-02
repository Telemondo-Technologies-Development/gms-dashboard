import { useQuery } from '@tanstack/react-query'
import { AssetApi } from '@/api/generated/apis/AssetApi'
import type { Pageable } from '@/api/generated/models/Pageable'

const fetchAssetsFromApi = async (pageable: Pageable) => {
  const assetApi = new AssetApi()
  const response = await assetApi.getAllAssets({ pageable })
  return response.data || []
}

export function useAssets(pageable: Pageable = { page: 0, size: 100, sort: [] }) {
  const query = useQuery({
    queryKey: ['assets', pageable],
    queryFn: () => fetchAssetsFromApi(pageable),
    staleTime: 1000 * 60 * 5,
  })

  return {
    assets: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}
