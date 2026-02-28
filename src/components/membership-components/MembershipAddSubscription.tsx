import { useMemo } from 'react'
import type { SubscriptionPlanFormState } from '@/types/membership/MembershipsubscriptionSchemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useBillingCycles } from '@/hooks/membership/useMembershipBillingCycles'

interface InlineAddSubscriptionFormProps {
  formState: SubscriptionPlanFormState
  setFormState: React.Dispatch<React.SetStateAction<SubscriptionPlanFormState>>
  onCancel: () => void
  error?: string | null
}

export function InlineAddSubscriptionForm({ formState, setFormState, onCancel, error }: InlineAddSubscriptionFormProps) {
  const billingCyclesQuery = useBillingCycles(true)

  const selectedCycle = useMemo(() => {
    return billingCyclesQuery.data?.find((c) => c.id === formState.billingCycleId)
  }, [billingCyclesQuery.data, formState.billingCycleId])

  return (
    <div className="mt-4 p-4 border rounded-lg bg-muted/30 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">New Subscription Plan</h4>
          <p className="text-sm text-muted-foreground">Create a new plan to assign to this member.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0" aria-label="Cancel">
          <span className="sr-only">Cancel</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

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
              className="pl-7 bg-background"
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
            <SelectTrigger id="billing-cycle" className="bg-background">
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
      
      {selectedCycle ? (
        <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground flex items-center justify-between">
          <span>Grace Period: <span className="font-medium text-foreground">{selectedCycle.gracePeriodDays} days</span></span>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      ) : null}
    </div>
  )
}