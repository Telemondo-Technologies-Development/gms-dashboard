import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AssetApi } from '@/api/generated/apis/AssetApi'
import type { AssetPostDTO } from '@/api/generated/models/AssetPostDTO'

export function useCreateAsset() {
  const queryClient = useQueryClient()
  const assetApi = new AssetApi()

  const mutation = useMutation({
    mutationFn: async (assetData: AssetPostDTO) => {
      return await assetApi.createAsset({ assetPostDTO: assetData })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })

  return mutation
}
