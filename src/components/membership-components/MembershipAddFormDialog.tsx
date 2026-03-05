import { useEffect, useState } from 'react'
import { CalendarIcon, Plus } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import type { MemberFormValues } from '@/types/membership/MembershipManagementSchema'
import { AddBillingDialog } from '@/components/membership-components/MembershipBillForm'
import { InlineAddSubscriptionForm } from '@/components/membership-components/MembershipAddSubscription'
import { useAddMemberDialog } from '@/hooks/membership/useMembershipAdd'
import { useEmployeeDisplayName } from '@/hooks/users/useStaffDisplayName'

export function AddMemberDialog() {
  const [step, setStep] = useState<1 | 2>(1)

  const {
    open,
    setOpen,
    submitError,
    form,
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
    currentUserQuery,
    currentUserEmail,
    subscriptionsQuery,
    createMemberMutation,
    submitMemberOnly,
    newSubscriptionForm,
    newPaymentMethodForm,
  } = useAddMemberDialog()

  const creatorId = form.state.values.createdById.trim()
  const { displayName: createdByName, isLoading: isCreatorNameLoading } = useEmployeeDisplayName({
    ids: [creatorId],
    email: currentUserEmail ?? '',
  })

  useEffect(() => {
    if (!open) {
      setStep(1)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Member
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>Create a new member and assign membership details.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <form.Field name="createdById">
              {(field) => (
                <input
                  type="hidden"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>

            {step === 1 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-none tracking-tight">Member Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <form.Field
                      name="firstName"
                      validators={{
                        onChange: ({ value }) => (!value.trim() ? 'First name is required.' : undefined),
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>First name <span className="text-destructive">*</span></Label>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="First name"
                          />
                          {field.state.meta.isTouched && field.state.meta.errors.length ? (
                            <p className="text-sm text-destructive" role="alert">
                              {field.state.meta.errors[0]}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </form.Field>

                    <form.Field
                      name="surname"
                      validators={{
                        onChange: ({ value }) => (!value.trim() ? 'Surname is required.' : undefined),
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Surname <span className="text-destructive">*</span></Label>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Surname"
                          />
                          {field.state.meta.isTouched && field.state.meta.errors.length ? (
                            <p className="text-sm text-destructive" role="alert">
                              {field.state.meta.errors[0]}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </form.Field>
                    <div className="grid grid-cols-2 gap-4">
                       <form.Field name="middleName">
                        {(field) => (
                          <div className="space-y-2">
                            <Label htmlFor={field.name}>Middle name</Label>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="Middle name"
                            />
                          </div>
                        )}
                      </form.Field>


                      <form.Field name="suffix">
                        {(field) => (
                          <div className="space-y-2">
                            <Label htmlFor={field.name}>Suffix</Label>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="Suffix"
                            />
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </div>
                  <form.Field name="status">
                    {(field) => (
                        <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as MemberFormValues['status'])}>
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
                    )}
                  </form.Field>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium leading-none tracking-tight">Subscription Details</h3>
                  <div className="space-y-4">
                    {subscriptionsQuery.isLoading ? (
                      <div className="text-sm text-muted-foreground">Loading subscriptions...</div>
                    ) : subscriptionsQuery.error ? (
                      <div className="text-sm text-destructive">Failed to load subscriptions</div>
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
                          <Select value={selectedSubscriptionId} onValueChange={setSelectedSubscriptionId}>
                            <SelectTrigger id="subscription">
                              <SelectValue placeholder="Select Plan" />
                            </SelectTrigger>
                            <SelectContent position="popper" sideOffset={4}>
                              {subscriptionsQuery.data?.map((sub: SubscriptionAvailedTableDTO) => (
                                <SelectItem key={sub.id} value={sub.id}>
                                  {sub.name} - PHP {sub.amount.toFixed(2)}
                                </SelectItem>
                              ))}
                              <SelectItem value="new_subscription" className="text-primary font-medium">
                                + New Subscription
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Start Date <span className="text-destructive">*</span></Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    'w-full justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap text-sm',
                                    !startDate && 'text-muted-foreground',
                                  )}
                                >
                                  <CalendarIcon className="h-4 w-4" />
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
                                    'w-full justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap text-sm',
                                    !endDate && 'text-muted-foreground',
                                  )}
                                >
                                  <CalendarIcon className=" h-4 w-4" />
                                  {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {selectedSubscriptionId === 'new_subscription' && (
                          <InlineAddSubscriptionForm
                            formState={newSubscriptionForm.state}
                            setFormState={newSubscriptionForm.setState}
                            onCancel={() => setSelectedSubscriptionId('')}
                            error={newSubscriptionForm.error}
                          />
                        )}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="membershipDetails">Additional Details</Label>
                      <Textarea
                        id="membershipDetails"
                        value={membershipDetails}
                        onChange={(e) => setMembershipDetails(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <AddBillingDialog
                  selectedSubscription={selectedSubscription ?? null}
                  paymentMethodId={paymentMethodId}
                  onPaymentMethodChange={(id, _name) => {
                    setPaymentMethodId(id)
                    setPaymentReferenceNum('')
                    if (id !== 'new_payment_method') newPaymentMethodForm.reset()
                  }}
                  paymentReferenceNum={paymentReferenceNum}
                  onPaymentReferenceNumChange={setPaymentReferenceNum}
                  totalCost={totalCost}
                  createdById={form.state.values.createdById.trim() || null}
                  newPaymentMethodForm={newPaymentMethodForm}
                />
              </div>
            )}
          </div>

          <div className="shrink-0 border-t bg-background px-6 py-4">
            <div className="flex flex-col gap-4">
            <div className="flex-1">
              {submitError ? (
                <p className="text-sm text-destructive" role="alert">
                  {submitError}
                </p>
              ) : null}

              {createMemberMutation.error && !submitError ? (
                <p className="text-sm text-destructive" role="alert">
                  {createMemberMutation.error instanceof Error ? createMemberMutation.error.message : 'Failed to create member.'}
                </p>
              ) : null}
            </div>
            
              <div className="flex w-full items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                <Label>User: {(currentUserQuery.isLoading || isCreatorNameLoading) ? 'Loading…' : (createdByName || currentUserEmail || '—')}</Label> 
              </div>
              <div className="flex gap-2">
                {step === 1 ? (
                  <div className="flex flex-col items-end gap-2">
                    <form.Subscribe
                      selector={(state) => {
                        const firstName = state.values.firstName.trim()
                        const surname = state.values.surname.trim()
                        return !(firstName && surname)
                      }}
                    >
                      {(isNextDisabled) => (
                        <>
                          <Button
                            type="button"
                            onClick={() => setStep(2)}
                            disabled={isNextDisabled || createMemberMutation.isPending}
                          >
                            Next: Billing
                          </Button>

                        </>
                      )}
                    </form.Subscribe>
                  </div>
                ) : (
                  <>
                    <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={createMemberMutation.isPending}>
                      Back
                    </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              void submitMemberOnly()
                            }}
                            disabled={createMemberMutation.isPending}
                          >
                            Skip 
                          </Button>
                    <form.Subscribe
                      selector={(state) =>
                        !state.values.createdById.trim() ||
                        !selectedSubscriptionId ||
                        !startDate ||
                        !state.canSubmit ||
                        state.isSubmitting ||
                        createMemberMutation.isPending
                      }
                    >
                      {(isCreateDisabled) => (
                        <Button type="submit" disabled={isCreateDisabled}>
                          {createMemberMutation.isPending ? 'Creating…' : 'Create Member'}
                        </Button>
                      )}
                    </form.Subscribe>
                  </>
                )}
              </div>
            </div>
          </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
