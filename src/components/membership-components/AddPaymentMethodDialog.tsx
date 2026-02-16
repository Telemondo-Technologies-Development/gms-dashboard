import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreatePaymentMethod } from '@/hooks/billing/useCreatePaymentMethod'

interface AddPaymentMethodDialogProps {
  createdById: string | null
  onCreated?: (id: string, name: string) => void
}

export function AddPaymentMethodDialog({ createdById, onCreated }: AddPaymentMethodDialogProps) {
  const [open, setOpen] = useState(false)
  const { name, setName, submitError, isSubmitting, handleSubmit, reset } = useCreatePaymentMethod({
    createdById,
    onCreated: (method) => {
      onCreated?.(method.id, method.name)
      setOpen(false)
      reset()
    },
  })

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen)
      if (!nextOpen) reset()
    }}>
      <DialogTrigger asChild>
        <Button type="button" variant="link" className="h-auto p-0 text-xs">
          Add payment method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Payment Method</DialogTitle>
          <DialogDescription>Add a new mode of payment for billing.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="payment-method-name">Name</Label>
          <Input
            id="payment-method-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cash"
          />
        </div>

        {submitError ? (
          <p className="text-sm text-destructive" role="alert">
            {submitError}
          </p>
        ) : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Create method'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}