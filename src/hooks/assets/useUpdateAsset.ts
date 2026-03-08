import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AssetApi } from '@/api/generated/apis/AssetApi'
import type { AssetPutDTO } from '@/api/generated/models/AssetPutDTO'
import { parseAssetResponse, assetPutFormToDTO, type AssetPutFormValues } from '@/types/asset/assetSchemas'
import { apiConfiguration } from '@/api/config'

export function useUpdateAsset() {
  const queryClient = useQueryClient()
  const assetApi = new AssetApi(apiConfiguration)

  const mutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: AssetPutFormValues }) => {
      const assetData = assetPutFormToDTO(formData)
      const response = await assetApi.updateAsset({ id, assetPutDTO: assetData as unknown as AssetPutDTO })
      return parseAssetResponse(response)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['asset', data.id] })
      toast.success('Asset updated successfully', {
        description: `${data.name} has been updated.`,
      })
    },
    onError: (error: Error) => {
      console.error('Failed to update asset:', error)
      toast.error('Failed to update asset', {
        description: error.message || 'An unexpected error occurred.',
      })
    },
  })

  return mutation
}
