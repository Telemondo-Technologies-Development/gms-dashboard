import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AssetApi } from '@/api/generated/apis/AssetApi'
import type { AssetPostDTO } from '@/api/generated/models/AssetPostDTO'
import { parseAssetResponse, assetPostFormToDTO, type AssetPostFormValues } from '@/types/asset/assetSchemas'
import { apiConfiguration } from '@/api/config'

export function useCreateAsset() {
  const queryClient = useQueryClient()
  const assetApi = new AssetApi(apiConfiguration)

  const mutation = useMutation({
    mutationFn: async (formData: AssetPostFormValues) => {
      const assetData = assetPostFormToDTO(formData)
      console.log('Creating asset with data:', assetData)
      const response = await assetApi.createAsset({ assetPostDTO: assetData as AssetPostDTO })
      return parseAssetResponse(response)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Asset created successfully', {
        description: `${data.name} has been added to the system.`,
      })
    },
    onError: async (error: any) => {
      console.error('Failed to create asset:', error)
      
      // Try to get detailed error message from response
      let errorMessage = 'An unexpected error occurred.'
      if (error.response) {
        try {
          const errorData = await error.response.json()
          console.error('Error response data:', errorData)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          console.error('Could not parse error response')
        }
      }
      
      toast.error('Failed to create asset', {
        description: error.message || errorMessage,
      })
    },
  })

  return mutation
}
