import { useEffect, useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { apiResponseMemberTableSchema, memberPostDtoSchema } from '@/types/membership/memberSchemas'
import type { MemberFormData } from '@/types/membership/memberSchemas'
import type { MemberFormValues } from '@/types/membership/memberSchemas'
import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import { SubscriptionApi } from '@/api/generated/apis/SubscriptionApi'
import { MemberApi } from '@/api/generated/apis/MemberApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { useAuthSession } from '@/lib/auth/auth-session'
import { useSelectedBranchId } from '@/hooks/useSelectedBranchId'
import { AddBillingDialog } from '@/components/membership-components/AddBillingForm'
import { useAddMemberDialogData } from '@/hooks/membership/useAddMemberDialogData'
import { useBillingActions } from '@/hooks/billing/useBillingActions'
import { memberQueryKeys } from '@/lib/QueryKeys'


const looksLikeUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

export function AddMemberDialog() {
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const session = useAuthSession()
  const selectedBranchId = useSelectedBranchId()
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [paymentMethodName, setPaymentMethodName] = useState('')
  const [membershipDetails, setMembershipDetails] = useState('')

  const {
    token,
    currentUserQuery,
    resolvedActorId,
    currentUserEmail,
    branchPersonnelQuery,
    subscriptionsQuery,
  } = useAddMemberDialogData({ session, open })

  const { ensureInvoiceForSubscription, createPaymentIfNeeded } = useBillingActions()

  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
  const subscriptionApi = getAuthenticatedApi(SubscriptionApi)
  const memberApi = getAuthenticatedApi(MemberApi)

  const defaultValues: MemberFormValues = {
    createdById: '',
    firstName: '',
    middleName: '',
    surname: '',
    suffix: '',
    profilePictureId: '',
    status: 'IN',
  }

  const selectedSubscription = subscriptionsQuery.data?.find(
    (s: SubscriptionAvailedTableDTO) => s.id === selectedSubscriptionId,
  )

  const totalCost = useMemo(() => {
    const amount = selectedSubscription?.amount ?? 0
    return amount.toFixed(2)
  }, [selectedSubscription])

  const createMemberMutation = useMutation({
    mutationFn: async (values: MemberFormValues) => {
      const createdById = values.createdById.trim()
      if (!createdById) {
        throw new Error('Missing actor id for the current user. Please log in again or ask admin to create an actor record.')
      }
      
      if (!selectedSubscriptionId) {
        throw new Error('Please select a subscription plan.')
      }
      
      if (!startDate) {
        throw new Error('Please select a start date.')
      }
      
      const branchId = branchPersonnelQuery.data?.branchId ?? selectedBranchId
      if (!branchId) {
        throw new Error('User branch not found. Please ensure you are assigned to a branch.')
      }

      const memberPostDTO = {
        createdById,
        firstName: values.firstName.trim(),
        middleName: values.middleName.trim() || undefined,
        profilePictureId: values.profilePictureId.trim() || undefined,
        surname: values.surname.trim(),
        suffix: values.suffix.trim() || undefined,
        status: values.status,
      }

      const validated = memberPostDtoSchema.parse(memberPostDTO)

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
      const response = await fetch(`${base}/api/member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(validated),
      })

      const rawText = await response.text().catch(() => '')
      if (!response.ok) {
        throw new Error(`Create member failed (${response.status}). ${rawText || 'Check server logs for details.'}`)
      }

      const parsedJson: unknown = rawText.trim() ? JSON.parse(rawText) : null
      const envelope = apiResponseMemberTableSchema.parse(parsedJson)
      if (!envelope.success) {
        throw new Error(envelope.message ?? 'Failed to create member.')
      }

      const member = envelope.data

      let memberActorId = member.actorId
      if (!memberActorId) {
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const refreshed = await memberApi.getMember({ id: member.id })
            if (refreshed.success && refreshed.data?.actorId) {
              memberActorId = refreshed.data.actorId
              break
            }
          } catch {
            // Retry on error
          }
          await new Promise((r) => setTimeout(r, 400))
        }
      }
      const effectiveMemberActorId = memberActorId ?? member.id
      
      let createdMemberSubscriptionId: string | undefined
      let createdInvoiceId: string | undefined
      try {
        let subscriptionIdToUse: string = selectedSubscriptionId
        if (selectedSubscription) {
          try {
            const subsResp = await subscriptionApi.getAllSubscriptions({ pageable: { page: 0, size: 500 } })
            const match = (subsResp.data ?? []).find(
              (s) => s.name.trim().toLowerCase() === selectedSubscription.name.trim().toLowerCase() && s.amount === selectedSubscription.amount,
            )
            if (match) subscriptionIdToUse = match.id
          } catch {
            console.warn('Failed to map subscription; using selected id')
          }
        }
        const subEnvelope = await memberSubscriptionApi.createMemberSubscription({
          memberSubscriptionPostDTO: {
            actorId: effectiveMemberActorId,
            branchId,
            createdById,
            startDate,
            endDate,
            status: 'ACTIVE',
            subscriptionId: subscriptionIdToUse,
          },
        })
        if (!subEnvelope.success || !subEnvelope.data) {
          throw new Error(subEnvelope.message ?? 'Failed to create subscription.')
        }
        createdMemberSubscriptionId = subEnvelope.data.id

        if (createdMemberSubscriptionId && selectedSubscription) {
          const dueDate = startDate ?? new Date()
          createdInvoiceId = await ensureInvoiceForSubscription({
            actorId: effectiveMemberActorId,
            branchId,
            createdById,
            memberSubscriptionId: createdMemberSubscriptionId,
            subscriptionAvailedId: selectedSubscriptionId,
            dueDate,
            gracePeriodDays: selectedSubscription.gracePeriodDays ?? 0,
            subtotal: selectedSubscription.amount,
          })
        }
      } catch (subError) {
        console.error('Failed to create subscription:', subError)
        throw new Error('Member created but failed to create subscription. Please add subscription manually.')
      }

      try {
        await createPaymentIfNeeded({
          paymentMethodId,
          invoiceId: createdInvoiceId,
          createdById,
          amount: selectedSubscription?.amount ?? 0,
          paidAt: new Date(),
        })
      } catch (payError) {
        console.warn('Payment creation skipped or failed:', payError)
      }

      return member
    },
    onSuccess: (data) => {
      setSubmitError(null)

      void queryClient.invalidateQueries({ queryKey: [memberQueryKeys.members] })
      void queryClient.invalidateQueries({ queryKey: [memberQueryKeys.memberSubscriptions] })

      // Invalidate members cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: [memberQueryKeys.members] })
    },
  })

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      if (!value.createdById.trim()) {
        setSubmitError('Current user actor id is missing. Cannot create member.')
        return
      }

      try {
        await createMemberMutation.mutateAsync(value)
        setOpen(false)
        form.reset()
        setStartDate(undefined)
        setEndDate(undefined)
        setSelectedSubscriptionId('')
        setPaymentMethodId('')
        setPaymentMethodName('')
        setMembershipDetails('')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create member.'
        setSubmitError(message)
      }
    },
  })

  useEffect(() => {
    if (!resolvedActorId) return
    const current = form.state.values.createdById
    if (current !== resolvedActorId) {
      form.setFieldValue('createdById', resolvedActorId)
    }
  }, [resolvedActorId, form])

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
                    <Label htmlFor={field.name}>First name</Label>
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
                    <Label htmlFor={field.name}>Middle name (optional)</Label>
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
                    <Label htmlFor={field.name}>Surname</Label>
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
                    <Label htmlFor={field.name}>Suffix (optional)</Label>
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
                  <Label htmlFor={field.name}>Profile picture id (optional)</Label>
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
                  ) : (
                    <p className="text-xs text-muted-foreground">Backend expects an existing uploaded image id.</p>
                  )}
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
              onPaymentMethodChange={(id, name) => {
                setPaymentMethodId(id)
                setPaymentMethodName(name)
              }}
              totalCost={totalCost}
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
