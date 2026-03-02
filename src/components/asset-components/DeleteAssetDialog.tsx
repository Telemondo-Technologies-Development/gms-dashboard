import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { AssetTable } from '@/types/asset/assetSchemas'
import { useDeleteAsset } from '@/hooks/assets/useDeleteAsset'

import { useAssetCategories } from '@/hooks/assets/useAssetCategories'
import { useBranches } from '@/hooks/branch/useBranches'

interface DeleteAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: AssetTable | null
}

export function DeleteAssetDialog({
  open,
  onOpenChange,
  asset,
}: DeleteAssetDialogProps) {
  const deleteAsset = useDeleteAsset()
  const { categories } = useAssetCategories()
  const { branches } = useBranches()

  if (!asset) return null

  const categoryName = categories.find(c => c.id === asset.assetCategoryId)?.name || asset.assetCategoryName || asset.assetCategoryId
  const branchName = branches.find((b: any) => b.id === asset.branchId)?.name || asset.branchName || asset.branchId

  const handleDelete = async () => {
    try {
      await deleteAsset.mutateAsync(asset.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting asset:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-md flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
          <DialogTitle>Delete Asset</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the asset from your inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-muted-foreground/10">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Name:</span>
                <span className="text-sm font-semibold">{asset.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Category:</span>
                <span className="text-sm font-semibold">{categoryName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Branch:</span>
                <span className="text-sm font-semibold">{branchName}</span>
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div className="text-sm text-destructive-foreground">
                <p className="font-medium mb-1">Warning</p>
                <p className="text-destructive/90">
                  All associated data, including maintenance records and history, will be permanently removed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0 border-t px-6 py-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={deleteAsset.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteAsset.isPending}
          >
            {deleteAsset.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Asset'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
