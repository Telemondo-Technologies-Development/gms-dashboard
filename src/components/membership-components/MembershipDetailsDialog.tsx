import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Unlock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import type { MemberDetailsDialogProps } from '@/types/membership/MembershipManagementSchema'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { AddBillingDialog } from './MembershipBillForm'
import { InlineAddSubscriptionForm } from './MembershipAddSubscription'
import { useMembershipDetailsDialog } from '@/hooks/membership/useMembershipDetailsDialog'
import { EditAdminConfirmDialog } from '@/components/common/EditAdminConfirm'

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
    paymentReferenceNum,
    setPaymentReferenceNum,
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

  const [editUnlocked, setEditUnlocked] = useState(false)
  const [showEditConfirm, setShowEditConfirm] = useState(false)

  // Staff can request admin unlock; once confirmed the form becomes editable
  const canEdit = canEditBilling || editUnlocked

  // Use the recorder name embedded in the member record (createdByFirstName + createdBySurname from API)
  const recorderName = memberGroup?.recorderName ?? null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
          <DialogTitle>Member Details</DialogTitle>
          <DialogDescription>
            Review member info and update billing to renew memberships when they expire.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {!memberGroup ? (
              <div className="text-sm text-muted-foreground">No member selected.</div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium leading-none tracking-tight">Member Information</h3>
                      {members.map((member) => (
                        <div key={member.id} className="rounded-lg space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`firstName-${member.id}`}>First Name <span className="text-destructive">*</span></Label>
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
                              <Label htmlFor={`surname-${member.id}`}>Surname <span className="text-destructive">*</span></Label>
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

                            <div className="space-y-2">
                              <Label>Status <span className="text-destructive">*</span></Label>
                              <Select value={member.status || 'UNDECIDED'} disabled>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                  <SelectItem value="DEACTIVATED">DEACTIVATED</SelectItem>
                                  <SelectItem value="UNDECIDED">UNDECIDED</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium leading-none tracking-tight">Subscription Details</h3>
                      {!canEdit ? (
                        <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">
                            Billing details are locked because this member has an active subscription. Admin confirmation is required to edit.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0 gap-1.5"
                            onClick={() => setShowEditConfirm(true)}
                          >
                            <Unlock className="h-3.5 w-3.5" />
                            Unlock Edit
                          </Button>
                        </div>
                      ) : editUnlocked ? (
                        <div className="rounded-md border border-yellow-400 bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                          Edit access granted via admin confirmation. Changes will be saved when you click &ldquo;Save changes&rdquo;.
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
                            <Label htmlFor="subscription">Subscription Plan <span className="text-destructive">*</span></Label>
                            <Select
                              value={selectedSubscriptionId}
                              onValueChange={setSelectedSubscriptionId}
                              disabled={!canEdit}
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
                                {canEdit && (
                                  <SelectItem value="new_subscription" className="text-primary font-medium">
                                    + Add New Subscription
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>

                            {canEdit && selectedSubscriptionId === 'new_subscription' && (
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

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date <span className="text-destructive">*</span></Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !startDate && 'text-muted-foreground',
                                )}
                                disabled={!canEdit}
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
                                disabled={!canEdit}
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
                          disabled={!canEdit}
                        />
                      </div>
                </div>

                <AddBillingDialog
                  selectedSubscription={selectedSubscription}
                  paymentMethodId={paymentMethodId}
                  onPaymentMethodChange={(id, _name) => {
                    setPaymentMethodId(id)
                    setPaymentReferenceNum('')
                    if (id !== 'new_payment_method') createPaymentMethod.reset()
                  }}
                  paymentReferenceNum={paymentReferenceNum}
                  onPaymentReferenceNumChange={setPaymentReferenceNum}
                  totalCost={totalCost}
                  disabled={!canEdit}
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
            )}
          </div>

          <div className="shrink-0 flex items-center justify-between gap-2 border-t bg-background px-6 py-4">
            <div className="text-sm text-muted-foreground">
              <Label>Recorded by: {recorderName ?? '—'}</Label>
            </div>
            <div className="flex items-center gap-2">
            {!canEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setShowEditConfirm(true)}
              >
                <Unlock className="h-3.5 w-3.5" />
                Unlock Edit
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateSubscriptionMutation.isPending}
            >
              Close
            </Button>
            <Button type="submit" disabled={!memberGroup || !canEdit || updateSubscriptionMutation.isPending}>
              {updateSubscriptionMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
            </div>
          </div>
        </form>
      </DialogContent>

      <EditAdminConfirmDialog
        open={showEditConfirm}
        onOpenChange={setShowEditConfirm}
        title="Unlock Edit Access"
        description="This member has an active subscription. Enter your admin password to unlock editing for this session."
        confirmText="Unlock & Edit"
        onConfirm={() => {
          setEditUnlocked(true)
        }}
      />
    </Dialog>
  )
}