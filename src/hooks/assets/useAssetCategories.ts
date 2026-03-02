import { useQuery } from '@tanstack/react-query'
import { AssetCategoryApi } from '@/api/generated/apis/AssetCategoryApi'
import { apiConfiguration } from '@/api/config'

const fetchAssetCategoriesFromApi = async () => {
  const assetCategoryApi = new AssetCategoryApi(apiConfiguration)
  const response = await assetCategoryApi.getAllAssetCategories()
  return response.data || []
}

export function useAssetCategories() {
  const query = useQuery({
    queryKey: ['assetCategories'],
    queryFn: fetchAssetCategoriesFromApi,
    staleTime: 1000 * 60 * 5,
  })

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}
