import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AssetApi } from '@/api/generated/apis/AssetApi'

export function useDeleteAsset() {
  const queryClient = useQueryClient()
  const assetApi = new AssetApi()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return await assetApi.deleteAsset({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })

  return mutation
}
