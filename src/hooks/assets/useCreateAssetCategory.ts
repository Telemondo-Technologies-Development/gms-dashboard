import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AssetCategoryApi } from '@/api/generated/apis/AssetCategoryApi'
import type { AssetCategoryPostDTO } from '@/api/generated/models/AssetCategoryPostDTO'
import { apiConfiguration } from '@/api/config'

export function useCreateAssetCategory() {
  const queryClient = useQueryClient()
  const assetCategoryApi = new AssetCategoryApi(apiConfiguration)

  const mutation = useMutation({
    mutationFn: async (data: { name: string; createdById: string }) => {
      const response = await assetCategoryApi.createAssetCategory({ 
        assetCategoryPostDTO: data as AssetCategoryPostDTO 
      })
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create asset category')
      }
      
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assetCategories'] })
      toast.success('Category created successfully', {
        description: `${data.name} has been added.`,
      })
    },
    onError: async (error: any) => {
      console.error('Failed to create asset category:', error)
      
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
      
      toast.error('Failed to create category', {
        description: error.message || errorMessage,
      })
    },
  })

  return mutation
}
