import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AssetApi } from '@/api/generated/apis/AssetApi'
import type { Pageable } from '@/api/generated/models/Pageable'
import { parseAssetsResponse } from '@/types/asset/assetSchemas'
import { apiConfiguration } from '@/api/config'

const fetchAssetsFromApi = async (pageable: Pageable) => {
  const assetApi = new AssetApi(apiConfiguration)
  const response = await assetApi.getAllAssets({ pageable })
  return parseAssetsResponse(response)
}

export function useAssets(pageable: Pageable = { page: 0, size: 100, sort: [] }) {
  const query = useQuery({
    queryKey: ['assets', pageable],
    queryFn: () => fetchAssetsFromApi(pageable),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  // Handle errors
  if (query.error) {
    console.error('Failed to fetch assets:', query.error)
    toast.error('Failed to load assets', {
      description: query.error.message || 'An unexpected error occurred.',
    })
  }

  return {
    assets: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}
