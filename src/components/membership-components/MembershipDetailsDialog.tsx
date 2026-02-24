import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { MemberDetailsDialogProps } from '@/types/membership/memberSchemas'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { AddBillingDialog } from './MembershipBillForm'
import { InlineAddSubscriptionForm } from './MembershipAddSubscription'
import { useMembershipDetailsDialog } from '@/hooks/membership/useMembershipDetailsDialog'

export function MemberDetailsDialog({ open, onOpenChange, memberGroup }: MemberDetailsDialogProps) {
  const {
    members,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedSubscriptionId,
    setSelectedSubscriptionId,
    paymentMethodId,
    setPaymentMethodId,
    membershipDetails,
    setMembershipDetails,
    selectedSubscription,
    totalCost,
    subscriptionsQuery,
    canEditBilling,
    createSubscriptionPlan,
    createPaymentMethod,
    updateSubscriptionMutation,
    resolvedActorId,
    handleSubmit,
  } = useMembershipDetailsDialog({
    open,
    memberGroup,
    onClose: () => onOpenChange(false),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl h-[95vh] max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <DialogTitle>Member Details</DialogTitle>
          <DialogDescription>
            Review member info and update billing to renew memberships when they expire.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
          {!memberGroup ? (
            <div className="text-sm text-muted-foreground px-6 py-4">No member selected.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto px-6 py-4 min-h-0 flex-1">
              <div className="space-y-6">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Member & Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="font-semibold leading-none tracking-tight">Member Information</h3>
                      {members.map((member) => (
                        <div key={member.id} className="rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`firstName-${member.id}`}>First Name *</Label>
                              <Input
                                id={`firstName-${member.id}`}
                                value={member.firstName || ''}
                                placeholder="Enter first name"
                                disabled
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`middleName-${member.id}`}>Middle Name </Label>
                              <Input
                                id={`middleName-${member.id}`}
                                value={member.middleName || ''}
                                placeholder="Enter middle name"
                                disabled
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`surname-${member.id}`}>Surname *</Label>
                              <Input
                                id={`surname-${member.id}`}
                                value={member.surname || ''}
                                placeholder="Enter surname"
                                disabled
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`suffix-${member.id}`}>Suffix </Label>
                              <Input
                                id={`suffix-${member.id}`}
                                value={member.suffix || ''}
                                placeholder="Enter suffix"
                                disabled
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label>Status</Label>
                              <Select value={member.status || 'UNDECIDED'} disabled>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="IN">IN</SelectItem>
                                  <SelectItem value="OUT">OUT</SelectItem>
                                  <SelectItem value="UNDECIDED">UNDECIDED</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-6 pt-4 border-t">
                      <h3 className="font-semibold leading-none tracking-tight">Subscription Details</h3>
                      {!canEditBilling ? (
                        <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                          Billing details are locked because this member has an active subscription. Only admins can edit billing.
                        </div>
                      ) : null}
                      {subscriptionsQuery.isLoading ? (
                        <div className="text-sm text-muted-foreground">Loading subscriptions...</div>
                      ) : subscriptionsQuery.error ? (
                        <div className="text-sm text-destructive">
                          {subscriptionsQuery.error instanceof Error
                            ? subscriptionsQuery.error.message
                            : 'Failed to load subscriptions.'}
                        </div>
                      ) : subscriptionsQuery.data && subscriptionsQuery.data.length === 0 ? (
                        <div className="text-sm text-destructive">
                          No subscriptions available. Please create subscriptions in the admin panel first.
                          <br />
                          <span className="text-xs">Debug: Query returned {subscriptionsQuery.data.length} items</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="subscription">Subscription Plan *</Label>
                            <Select
                              value={selectedSubscriptionId}
                              onValueChange={setSelectedSubscriptionId}
                              disabled={!canEditBilling}
                            >
                              <SelectTrigger id="subscription">
                                <SelectValue placeholder="Select subscription plan" />
                              </SelectTrigger>
                              <SelectContent position="popper" sideOffset={4}>
                                {subscriptionsQuery.data?.map((sub: SubscriptionAvailedTableDTO) => (
                                  <SelectItem key={sub.id} value={sub.id}>
                                    {sub.name} - PHP {sub.amount.toFixed(2)}
                                  </SelectItem>
                                ))}
                                {canEditBilling && (
                                  <SelectItem value="new_subscription" className="text-primary font-medium">
                                    + Add New Subscription
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>

                            {canEditBilling && selectedSubscriptionId === 'new_subscription' && (
                              <>
                                <InlineAddSubscriptionForm
                                  formState={createSubscriptionPlan.formState}
                                  setFormState={createSubscriptionPlan.setFormState}
                                  onCancel={() => {
                                    setSelectedSubscriptionId('')
                                    createSubscriptionPlan.reset()
                                  }}
                                  error={createSubscriptionPlan.submitError}
                                />
                                <div className="flex justify-end pt-2">
                                  <Button
                                    type="button"
                                    onClick={(event) => {
                                      event.preventDefault()
                                      void createSubscriptionPlan.handleSubmit()
                                    }}
                                    disabled={createSubscriptionPlan.isSubmitting || !createSubscriptionPlan.formState.name}
                                  >
                                    Create Plan
                                  </Button>
                                </div>
                              </>
                            )}

                            {selectedSubscription ? (
                              <p className="text-xs text-muted-foreground">
                                Interval: {selectedSubscription.intervalCount} {selectedSubscription.intervals} · Grace:{' '}
                                {selectedSubscription.gracePeriodDays} days
                              </p>
                            ) : null}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !startDate && 'text-muted-foreground',
                                )}
                                disabled={!canEditBilling}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !endDate && 'text-muted-foreground',
                                )}
                                disabled={!canEditBilling}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="membershipDetails">Additional Details</Label>
                        <Textarea
                          id="membershipDetails"
                          value={membershipDetails}
                          onChange={(event) => setMembershipDetails(event.target.value)}
                          rows={3}
                          disabled={!canEditBilling}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <AddBillingDialog
                  selectedSubscription={selectedSubscription}
                  paymentMethodId={paymentMethodId}
                  onPaymentMethodChange={(id, _name) => {
                    setPaymentMethodId(id)
                    if (id !== 'new_payment_method') createPaymentMethod.reset()
                  }}
                  totalCost={totalCost}
                  disabled={!canEditBilling}
                  createdById={resolvedActorId ?? null}
                  newPaymentMethodForm={{
                    name: createPaymentMethod.name,
                    setName: createPaymentMethod.setName,
                    error: createPaymentMethod.submitError,
                  }}
                  onCreatePaymentMethod={async () => {
                    const newMethod = await createPaymentMethod.handleSubmit()
                    setPaymentMethodId(newMethod.id)
                  }}
                  isCreatingPaymentMethod={createPaymentMethod.isSubmitting}
                />
              </div>
            </div>
          )}

          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateSubscriptionMutation.isPending}
            >
              Close
            </Button>
            <Button type="submit" disabled={!memberGroup || updateSubscriptionMutation.isPending}>
              {updateSubscriptionMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}