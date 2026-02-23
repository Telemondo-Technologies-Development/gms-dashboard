import { useMemo, useState } from 'react'
import { Plus, Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useBillingCycles } from '@/hooks/membership/useBillingCycles'
import { useCreateSubscriptionPlan } from '@/hooks/membership/useAddSubscriptionPlan'

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
    <Drawer open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen)
      if (!nextOpen) reset()
    }}>
      <DrawerTrigger asChild>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add subscription plan</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>New Subscription Plan</DrawerTitle>
            <DrawerDescription>Create a subscription plan so it can be assigned to members.</DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="subscription-name">Plan Name</Label>
                <Input
                  id="subscription-name"
                  value={formState.name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Monthly Gold"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscription-amount">Amount (PHP)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">₱</span>
                  <Input
                    id="subscription-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-7"
                    value={formState.amount}
                    onChange={(e) => setFormState((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing-cycle">Billing Cycle</Label>
                <Select
                  value={formState.billingCycleId}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, billingCycleId: value }))}
                >
                  <SelectTrigger id="billing-cycle">
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {billingCyclesQuery.isLoading ? (
                      <SelectItem value="__loading__" disabled>Loading...</SelectItem>
                    ) : billingCyclesQuery.data?.length ? (
                      billingCyclesQuery.data.map((cycle) => (
                        <SelectItem key={cycle.id} value={cycle.id}>
                          {cycle.name} ({cycle.intervalCount} {cycle.intervals})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="__empty__" disabled>No cycles found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription-description">Description</Label>
              <Textarea
                id="subscription-description"
                value={formState.description}
                onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="What does this plan include?"
                className="resize-none min-h-[80px]"
              />
            </div>
            
            {selectedCycle ? (
              <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground flex items-center justify-between">
                <span>Grace Period: <span className="font-medium text-foreground">{selectedCycle.gracePeriodDays} days</span></span>
              </div>
            ) : null}

            {submitError ? (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                {submitError}
              </div>
            ) : null}
          </div>

          <DrawerFooter>
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
              className="w-full"
            >
              {isSubmitting ? 'Creating Plan...' : 'Create Subscription Plan'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}