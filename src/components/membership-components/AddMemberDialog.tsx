import { useEffect, useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarIcon, Plus } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import type { AddMemberDialogProps, MemberFormData } from '@/types/membership/memberSchemas'
import { apiResponseListUserTableSchema, apiResponseUserTableSchema, type UserTable } from '@/types/user/userSchemas'
import type { JwtClaims } from '@/types/user/userSchemas'
import type { MemberFormValues } from '@/types/membership/memberSchemas'
import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import { BranchPersonnelApi } from '@/api/generated/apis/BranchPersonnelApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import type { BranchPersonnelTableDTO } from '@/api/generated/models/BranchPersonnelTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'



function tryDecodeJwtClaims(token: string): JwtClaims | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const payload = parts[1]
  if (!payload) return null

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    if (typeof atob !== 'function') return null
    const json = atob(padded)
    const parsed: unknown = JSON.parse(json)
    return parsed && typeof parsed === 'object' ? (parsed as JwtClaims) : null
  } catch {
    return null
  }
}

function getStringClaim(claims: JwtClaims | null, key: string): string | undefined {
  if (!claims) return undefined
  const value = claims[key]
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function looksLikeUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

async function fetchJsonOrThrow(url: string, token?: string): Promise<unknown> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  })

  const rawText = await response.text().catch(() => '')
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). ${rawText || 'Check server logs for details.'}`)
  }

  try {
    return JSON.parse(rawText)
  } catch {
    throw new Error('Unexpected response from the server (invalid JSON).')
  }
}

async function fetchUserById(userId: string, token?: string): Promise<UserTable> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
  const url = `${base}/api/user/${encodeURIComponent(userId)}`

  const json = await fetchJsonOrThrow(url, token)
  const parsed = apiResponseUserTableSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Failed to validate user response.')
  }
  if (!parsed.data.success) {
    throw new Error(parsed.data.message ?? 'Failed to fetch user.')
  }
  return parsed.data.data
}

async function fetchUserByEmail(email: string, token?: string): Promise<UserTable | null> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
  const url = `${base}/api/user`

  const json = await fetchJsonOrThrow(url, token)
  const parsed = apiResponseListUserTableSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Failed to validate users response.')
  }
  if (!parsed.data.success) {
    throw new Error(parsed.data.message ?? 'Failed to fetch users.')
  }

  const needle = email.trim().toLowerCase()
  return parsed.data.data.find((u) => u.email.toLowerCase() === needle) ?? null
}

export function AddMemberDialog({ onAddMember }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // States for membership and billing
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [membershipDetails, setMembershipDetails] = useState('')

  const queryClient = useQueryClient()
  
  // Initialize API clients
  const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)
  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
  const branchPersonnelApi = getAuthenticatedApi(BranchPersonnelApi)

  const defaultValues: MemberFormValues = {
    createdById: '',
    firstName: '',
    middleName: '',
    surname: '',
    suffix: '',
    profilePictureId: '',
    status: 'IN',
  }

  const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') ?? '') : ''
  const storedEmail = typeof window !== 'undefined' ? (localStorage.getItem('auth_email') ?? '') : ''
  const claims = token ? tryDecodeJwtClaims(token) : null
  const authUserId = (() => {
    const sub = getStringClaim(claims, 'sub')
    return sub && looksLikeUuid(sub) ? sub : undefined
  })()

  const currentUserQuery = useQuery({
    queryKey: ['currentUser', authUserId ?? null, storedEmail || null],
    enabled: typeof window !== 'undefined' && (!!authUserId || !!storedEmail),
    queryFn: async () => {
      if (authUserId) return await fetchUserById(authUserId, token)
      if (storedEmail) return await fetchUserByEmail(storedEmail, token)
      return null
    },
    retry: false,
  })

  const createdByActorId = currentUserQuery.data?.actorId
  const currentUserEmail = currentUserQuery.data?.email ?? storedEmail
  
  // Fetch user's branch
  const branchPersonnelQuery = useQuery<BranchPersonnelTableDTO | null>({
    queryKey: ['branchPersonnel', createdByActorId],
    enabled: !!createdByActorId,
    queryFn: async () => {
      if (!createdByActorId) return null
      try {
        const response = await branchPersonnelApi.getAllBranchPersonnel({ pageable: {} })
        const record = response.data?.find(
          (r: BranchPersonnelTableDTO) => r.actorId === createdByActorId && r.status === 'IN'
        )
        return record ?? null
      } catch (error) {
        console.error('Failed to fetch branch:', error)
        return null
      }
    },
    retry: false,
  })
  
  // Fetch available subscription availed
  const subscriptionsQuery = useQuery<SubscriptionAvailedTableDTO[]>({
    queryKey: ['subscriptionAvailed'],
    queryFn: async () => {
      try {
        console.log('Fetching subscription availed...')
        const response = await subscriptionAvailedApi.getAllSubscriptionAvailed({ pageable: {} })
        console.log('Subscription availed response:', response)
        console.log('Subscription availed data:', response.data)
        return response.data ?? []
      } catch (error) {
        console.error('Failed to fetch subscription availed:', error)
        return []
      }
    },
    retry: false,
  })
  
  // No need to fetch billing cycles separately - they're included in SubscriptionAvailed
  
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
      
      const branchId = branchPersonnelQuery.data?.branchId
      if (!branchId) {
        throw new Error('User branch not found. Please ensure you are assigned to a branch.')
      }

      // Step 1: Create Member
      const memberPostDTO = {
        createdById,
        firstName: values.firstName.trim(),
        middleName: values.middleName.trim() ? values.middleName.trim() : undefined,
        profilePictureId: values.profilePictureId.trim() ? values.profilePictureId.trim() : undefined,
        surname: values.surname.trim(),
        suffix: values.suffix.trim() ? values.suffix.trim() : undefined,
        status: values.status,
      }

      const validated = memberPostDtoSchema.parse(memberPostDTO)

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
      const url = `${base}/api/member`

      const response = await fetch(url, {
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
      
      // Step 2: Create Member Subscription
      try {
        await memberSubscriptionApi.createMemberSubscription({
          memberSubscriptionPostDTO: {
            actorId: member.id,
            branchId,
            createdById,
            startDate,
            endDate,
            status: 'ACTIVE',
            subscriptionId: selectedSubscriptionId,
          },
        })
      } catch (subError) {
        console.error('Failed to create subscription:', subError)
        throw new Error('Member created but failed to create subscription. Please add subscription manually.')
      }

      return member
    },
    onSuccess: (data) => {
      setSubmitError(null)

      void queryClient.invalidateQueries({ queryKey: ['members'] })
      void queryClient.invalidateQueries({ queryKey: ['memberSubscriptions'] })

      const fullName = [data.firstName, data.middleName, data.surname, data.suffix].filter(Boolean).join(' ')
      const payload: MemberFormData = {
        id: data.id,
        members: [
          {
            id: data.id,
            firstName: data.firstName,
            middleName: data.middleName,
            surname: data.surname,
            suffix: data.suffix,
            status: data.status,
            name: fullName || 'Unknown',
            email: '',
            phone: '',
          },
        ],
        startDate,
        endDate,
        membershipType: selectedSubscription?.name ?? '',
        membershipDuration: selectedSubscription ? `${selectedSubscription.intervalCount} ${selectedSubscription.intervals}` : '',
        billingAmount: selectedSubscription?.amount.toString() ?? '',
        billingCycle: selectedSubscription ? `${selectedSubscription.intervalCount} ${selectedSubscription.intervals}` : '',
        paymentMethod,
        membershipDetails,
        documents: [],
      }

      onAddMember(payload)
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
        // Reset local states
        setStartDate(undefined)
        setEndDate(undefined)
        setSelectedSubscriptionId('')
        setPaymentMethod('')
        setMembershipDetails('')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create member.'
        setSubmitError(message)
      }
    },
  })

  useEffect(() => {
    if (!createdByActorId) return
    const current = form.state.values.createdById
    if (current !== createdByActorId) {
      form.setFieldValue('createdById', createdByActorId)
    }
  }, [createdByActorId, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Member
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
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Member Information */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="">
                  <div className="space-y-4 border border-border p-4 rounded-2xl mb-4" >
                    <div className="text-sm font-medium">Member Information</div>
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
                              placeholder="Juan"
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
                              placeholder="D."
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
                              placeholder="Dela Cruz"
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
                              placeholder="Jr."
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
                            <p className="text-xs text-muted-foreground">
                              Backend expects an existing uploaded image id.
                            </p>
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

                  <div className="space-y-4 border border-border p-4 rounded-2xl">
                    <div className="text-sm font-medium">Member Subscription</div>
                    
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
                              Interval: {selectedSubscription.intervalCount} {selectedSubscription.intervals} · Grace: {selectedSubscription.gracePeriodDays} days
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
                </div>
              </div>
            </div>

            {/* Right Column: Membership & Billing */}
            <div className="space-y-6">
              <div className="space-y-4 border border-border p-4 rounded-2xl">
                <div className="text-sm font-medium">Billing</div>

                {selectedSubscription ? (
                  <>
                    <div className="space-y-2">
                      <Label>Subscription Plan</Label>
                      <Input value={selectedSubscription.name} disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Amount (PHP)</Label>
                      <Input value={selectedSubscription.amount.toFixed(2)} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label>Billing Interval</Label>
                      <Input
                        value={`${selectedSubscription.intervalCount} ${selectedSubscription.intervals}`}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Grace Period (days)</Label>
                      <Input value={String(selectedSubscription.gracePeriodDays)} disabled />
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Please select a subscription plan to view billing details
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Mode of Payment</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="gcash">GCash</SelectItem>
                      <SelectItem value="paymaya">PayMaya</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="debit-card">Debit Card</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="online">Other Online Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-2xl border bg-muted/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subscription</span>
                    <span className="font-medium">{selectedSubscription?.name || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-medium">PHP {selectedSubscription?.amount.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Billing cycle</span>
                    <span className="font-medium">
                      {selectedSubscription ? `${selectedSubscription.intervalCount} ${selectedSubscription.intervals}` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Mode of payment</span>
                    <span className="font-medium">{paymentMethod || '—'}</span>
                  </div>
                  <div className="border-t pt-3 flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">PHP {totalCost}</span>
                  </div>
                </div>
              </div>
            </div>
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
            
            <div className="flex items-center gap-2 w-full  justify-evenly ">
              <div className="w-full">
                <Label>User: {currentUserQuery.isLoading ? 'Loading…' : (currentUserEmail || '—')}  </Label>
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
