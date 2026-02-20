import { CalendarIcon, Plus } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
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
import type { MemberFormValues } from '@/types/membership/memberSchemas'
import { AddBillingDialog } from '@/components/membership-components/MembershipBillForm'
import { AddSubscriptionDialog } from '@/components/membership-components/MembershipAddSubscriptionDrawer'
import { useAddMemberDialog } from '@/hooks/membership/useAddMembership'


const looksLikeUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

export function AddMemberDialog() {
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
    membershipDetails,
    setMembershipDetails,
    selectedSubscription,
    totalCost,
    currentUserQuery,
    currentUserEmail,
    subscriptionsQuery,
    createMemberMutation,
  } = useAddMemberDialog()

  function MemberSubscriptionDetailsCard() {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Member & Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <h3 className="font-semibold leading-none tracking-tight">Member Information</h3>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="firstName"
                validators={{
                  onChange: ({ value }) => (!value.trim() ? 'First name is required.' : undefined),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>First name *</Label>
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

              <form.Field
                name="surname"
                validators={{
                  onChange: ({ value }) => (!value.trim() ? 'Surname is required.' : undefined),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Surname *</Label>
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

            <form.Field
              name="profilePictureId"
              validators={{
                onChange: ({ value }) => {
                  const trimmed = value.trim()
                  if (!trimmed) return undefined
                  return looksLikeUuid(trimmed) ? undefined : 'Must be a UUID.'
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Upload Picture </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="UUID"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <p className="text-sm text-destructive" role="alert">
                      {field.state.meta.errors[0]}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as MemberFormValues['status'])}>
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
              )}
            </form.Field>
          </div>

          <div className="space-y-6 pt-4 border-t">
            <h3 className="font-semibold leading-none tracking-tight">Subscription Details</h3>
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
                  <Label htmlFor="subscription">Subscription Plan *</Label>
                  <Select value={selectedSubscriptionId} onValueChange={setSelectedSubscriptionId}>
                    <SelectTrigger id="subscription">
                      <SelectValue placeholder="Select subscription plan" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      {subscriptionsQuery.data?.map((sub: SubscriptionAvailedTableDTO) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name} - PHP {sub.amount.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center">
                    <AddSubscriptionDialog
                      createdById={form.state.values.createdById.trim() || null}
                      onCreated={(id) => setSelectedSubscriptionId(id)}
                    />
                  </div>

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
                      className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
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
                      className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
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
                onChange={(e) => setMembershipDetails(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Member
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>Create a new member and assign membership details.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className=""
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <MemberSubscriptionDetailsCard />
            </div>

            {/* Right Column: Billing */}
            <AddBillingDialog
              selectedSubscription={selectedSubscription ?? null}
              paymentMethodId={paymentMethodId}
              onPaymentMethodChange={(id) => {
                setPaymentMethodId(id)
              }}
              totalCost={totalCost}
              createdById={form.state.values.createdById.trim() || null}
            />
          </div>

          <div className="flex items-center justify-between">
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
            
            <div className="flex items-center gap-2 w-full  justify-evenly mt-4 ">
              <div className="w-full">
                <Label>
                  User: {currentUserQuery.isLoading ? 'Loading…' : (currentUserEmail || '—')}
                </Label>
              </div>
              <div className="w-full justify-end flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={createMemberMutation.isPending}>
                    Cancel
                  </Button>
                </DialogClose>
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
                  {([canSubmit, isSubmitting]) => (
                    <Button
                      type="submit"
                      disabled={
                        !form.state.values.createdById.trim() || 
                        !selectedSubscriptionId || 
                        !startDate || 
                        !canSubmit || 
                        isSubmitting || 
                        createMemberMutation.isPending
                      }
                    >
                      {createMemberMutation.isPending ? 'Creating…' : 'Create Member'}
                    </Button>
                  )}
                </form.Subscribe>
              </div>

            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
