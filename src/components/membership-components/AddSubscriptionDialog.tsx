import { useMemo, useState } from 'react'

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useBillingCycles } from '@/hooks/membership/useBillingCycles'
import { useCreateSubscriptionPlan } from '@/hooks/membership/useCreateSubscriptionPlan'

interface AddSubscriptionDialogProps {
  createdById: string | null
  onCreated?: (subscriptionAvailedId: string) => void
}

export function AddSubscriptionDialog({ createdById, onCreated }: AddSubscriptionDialogProps) {
  const [open, setOpen] = useState(false)
  const billingCyclesQuery = useBillingCycles(open)

  const { formState, setFormState, submitError, isSubmitting, handleSubmit, reset } =
    useCreateSubscriptionPlan({
      createdById,
      onCreated: (plan) => {
        onCreated?.(plan.id)
        setOpen(false)
        reset()
      },
    })

  const selectedCycle = useMemo(() => {
    return billingCyclesQuery.data?.find((c) => c.id === formState.billingCycleId)
  }, [billingCyclesQuery.data, formState.billingCycleId])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen)
      if (!nextOpen) reset()
    }}>
      <DialogTrigger asChild>
        <Button type="button" variant="link" className="h-auto p-0 text-xs">
          Add subscription plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Subscription Plan</DialogTitle>
          <DialogDescription>Create a subscription plan so it can be assigned to members.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subscription-name">Plan name</Label>
            <Input
              id="subscription-name"
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Monthly Unlimited"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscription-description">Description</Label>
            <Textarea
              id="subscription-description"
              value={formState.description}
              onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Access to all facilities"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscription-amount">Amount (PHP)</Label>
            <Input
              id="subscription-amount"
              type="number"
              min="0"
              step="0.01"
              value={formState.amount}
              onChange={(e) => setFormState((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing-cycle">Billing cycle</Label>
            <Select
              value={formState.billingCycleId}
              onValueChange={(value) => setFormState((prev) => ({ ...prev, billingCycleId: value }))}
            >
              <SelectTrigger id="billing-cycle">
                <SelectValue placeholder={billingCyclesQuery.isLoading ? 'Loading cycles...' : 'Select billing cycle'} />
              </SelectTrigger>
              <SelectContent>
                {billingCyclesQuery.data?.length ? (
                  billingCyclesQuery.data.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name} · {cycle.intervalCount} {cycle.intervals}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__no_cycles__" disabled>
                    {billingCyclesQuery.isLoading ? 'Loading cycles...' : 'No billing cycles found'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedCycle ? (
              <p className="text-xs text-muted-foreground">
                Grace period: {selectedCycle.gracePeriodDays} days
              </p>
            ) : null}
          </div>
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
            disabled={
              !formState.name.trim() ||
              !formState.description.trim() ||
              !formState.amount.trim() ||
              !formState.billingCycleId ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Saving...' : 'Create plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}