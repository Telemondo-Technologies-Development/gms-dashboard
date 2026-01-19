import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-destructive">WARNING!</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Yes
          </Button>
          <Button type="button" variant="default" onClick={onCancel}>
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}