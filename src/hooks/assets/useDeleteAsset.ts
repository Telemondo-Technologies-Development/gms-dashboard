import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AssetApi } from '@/api/generated/apis/AssetApi'
import { apiConfiguration } from '@/api/config'

export function useDeleteAsset() {
  const queryClient = useQueryClient()
  const assetApi = new AssetApi(apiConfiguration)

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await assetApi.deleteAsset({ id })
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete asset')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Asset deleted successfully', {
        description: 'The asset has been removed from the system.',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to delete asset:', error)
      toast.error('Failed to delete asset', {
        description: error.message || 'An unexpected error occurred.',
      })
    },
  })

  return mutation
}
