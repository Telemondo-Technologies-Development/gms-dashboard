import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AssetApi } from '@/api/generated/apis/AssetApi'
import type { AssetPutDTO } from '@/api/generated/models/AssetPutDTO'

export function useUpdateAsset() {
  const queryClient = useQueryClient()
  const assetApi = new AssetApi()

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AssetPutDTO }) => {
      return await assetApi.updateAsset({ id, assetPutDTO: data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })

  return mutation
}
