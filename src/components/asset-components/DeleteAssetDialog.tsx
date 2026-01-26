import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Asset } from '@/lib/asset-utils'

interface DeleteAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: Asset | null
  onConfirmDelete: (assetId: string) => void
}

export function DeleteAssetDialog({
  open,
  onOpenChange,
  asset,
  onConfirmDelete,
}: DeleteAssetDialogProps) {
  if (!asset) return null

  const handleDelete = () => {
    onConfirmDelete(asset.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Asset</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete this asset? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
          <div className="font-semibold">{asset.name}</div>
          <div className="text-sm text-muted-foreground">
            <div>Category: {asset.category}</div>
            <div>Branch: {asset.branch}</div>
            {asset.serialNumber && <div>Serial Number: {asset.serialNumber}</div>}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
