import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import type { MemberFormData, MemberInfo } from '@/types/membership/memberSchemas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { MemberDetailsDialogProps } from '@/types/membership/memberSchemas'
import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { useAuthSession } from '@/lib/auth-session'
import { AddBillingDialog } from './AddBillingForm'
import { useMemberDetailsDialogData } from '@/hooks/useMemberDetailsDialogData'
import { isAdminToken } from '@/lib/auth-permissions'
import { useBillingActions } from '@/hooks/useBillingActions'
import { memberQueryKeys } from '@/lib/QueryKeys'



export function MemberDetailsDialog({ open, onOpenChange, memberGroup, onSave }: MemberDetailsDialogProps) {
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [documents, setDocuments] = useState<File[]>([])

  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [paymentMethodName, setPaymentMethodName] = useState('')
  const [membershipDetails, setMembershipDetails] = useState('')
  const [currentMemberSubscriptionId, setCurrentMemberSubscriptionId] = useState<string | undefined>(undefined)
  
  const queryClient = useQueryClient()
  
  // Initialize API clients
  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)

  const session = useAuthSession()

  const memberActorId = memberGroup?.actorId ?? memberGroup?.id ?? null

  const isAdmin = useMemo(() => isAdminToken(session.token), [session.token])

  const { ensureInvoiceForSubscription, createPaymentIfNeeded } = useBillingActions()

  const { subscriptionsQuery, memberSubscriptionQuery } = useMemberDetailsDialogData({
    open,
    memberActorId,
  })

  const hasActiveSubscription = !!memberSubscriptionQuery.data
  const canEditBilling = !hasActiveSubscription || isAdmin
  
  const selectedSubscription = subscriptionsQuery.data?.find(
    (s: SubscriptionAvailedTableDTO) => s.id === selectedSubscriptionId,
  )

  useEffect(() => {
    if (!memberGroup) return

    setMembers(memberGroup.members)
    setStartDate(memberGroup.startDate)
    setEndDate(memberGroup.endDate)
    setDocuments(memberGroup.documents)
    // MemberFormData stores a display string, not a DB id.
    setPaymentMethodName(memberGroup.paymentMethod)
    setPaymentMethodId('')
    setMembershipDetails(memberGroup.membershipDetails)
    
    // Set subscription from backend data if available
    if (memberSubscriptionQuery.data) {
      // Note: MemberSubscriptionTableDTO has subscriptionAvailedId, need to query SubscriptionAvailed to get subscriptionId
      setCurrentMemberSubscriptionId(memberSubscriptionQuery.data.id)
      if (memberSubscriptionQuery.data.startDate) {
        setStartDate(new Date(memberSubscriptionQuery.data.startDate))
      }
      if (memberSubscriptionQuery.data.endDate) {
        setEndDate(new Date(memberSubscriptionQuery.data.endDate))
      }

      if (memberSubscriptionQuery.data.subscriptionAvailedId) {
        setSelectedSubscriptionId(memberSubscriptionQuery.data.subscriptionAvailedId)
      }
    }
  }, [memberGroup, memberSubscriptionQuery.data])

  const totalCost = useMemo(() => {
    const amount = selectedSubscription?.amount ?? 0
    return (amount * Math.max(1, members.length)).toFixed(2)
  }, [selectedSubscription, members.length])

  const updateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!memberGroup?.id || !selectedSubscriptionId || !startDate) {
        throw new Error('Missing required fields for subscription update')
      }
      
      const memberSub = memberSubscriptionQuery.data
      const branchId = memberSub?.branchId ?? session.primaryBranchId
      if (!branchId) {
        throw new Error('Branch not found. Please ensure your user is assigned to a branch and try again.')
      }
      
      // Auth may be token-based or cookie-based; if the UI reached here, proceed.
      
      // Get current user's actor ID from localStorage or token
      const updatedById = memberSub?.updatedById || memberSub?.createdById
      if (!updatedById) {
        throw new Error(`Cannot determine user ID (current session: ${session.username ?? session.email ?? 'unknown'})`)
      }
      
      let resultingMemberSubscriptionId: string | undefined = currentMemberSubscriptionId
      let creatorIdForPayment = updatedById
      if (currentMemberSubscriptionId) {
        // Update existing subscription
        await memberSubscriptionApi.updateMemberSubscription({
          id: currentMemberSubscriptionId,
          memberSubscriptionPutDTO: {
            actorId: memberActorId ?? memberGroup.id,
            branchId,
            startDate,
            endDate,
            status: 'ACTIVE',
            subscriptionId: selectedSubscriptionId,
            updateCurrentSubscription: true,
            updatedById,
          },
        })
      } else {
        // Create new subscription (if none exists)
        const createdById = memberSub?.createdById || updatedById
        if (!createdById) {
          throw new Error('Cannot determine creator ID')
        }
        
        const createResp = await memberSubscriptionApi.createMemberSubscription({
          memberSubscriptionPostDTO: {
            actorId: memberActorId ?? memberGroup.id,
            branchId,
            createdById,
            startDate,
            endDate,
            status: 'ACTIVE',
            subscriptionId: selectedSubscriptionId,
          },
        })
        if (!createResp.success || !createResp.data) {
          throw new Error(createResp.message ?? 'Failed to create subscription')
        }
        resultingMemberSubscriptionId = createResp.data.id
        creatorIdForPayment = createdById
      }
      return { memberSubscriptionId: resultingMemberSubscriptionId, createdById: creatorIdForPayment }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [memberQueryKeys.memberSubscription, memberActorId] })
      void queryClient.invalidateQueries({ queryKey: [memberQueryKeys.members] })
    },
  })
  
  const handleMemberFieldChange = (index: number, field: keyof MemberInfo, value: unknown) => {
    setMembers((prev) => {
      const next = [...prev]
      const member = next[index]
      if (!member) return prev
      next[index] = { ...member, [field]: value }
      return next
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!memberGroup) return

    try {
      // Update subscription if changed
      let subscriptionResult: { memberSubscriptionId?: string; createdById?: string } | undefined
      if (canEditBilling && selectedSubscriptionId && startDate) {
        subscriptionResult = await updateSubscriptionMutation.mutateAsync()
      }

      // Ensure an invoice exists even if payment is not recorded yet
      let ensuredInvoiceId: string | undefined
      try {
        if (!canEditBilling) {
          // Billing is locked for non-admin users when an active subscription exists.
          ensuredInvoiceId = undefined
        }
        const memberSubscriptionId = subscriptionResult?.memberSubscriptionId ?? currentMemberSubscriptionId
        const createdById = subscriptionResult?.createdById ?? memberSubscriptionQuery.data?.createdById
        const branchId = memberSubscriptionQuery.data?.branchId ?? session.primaryBranchId
        if (canEditBilling && memberSubscriptionId && selectedSubscription && createdById && branchId) {
          const dueDate = startDate ?? new Date()
          const graceDays = selectedSubscription.gracePeriodDays ?? 0
          const actorId = memberActorId ?? memberGroup.id

          ensuredInvoiceId = await ensureInvoiceForSubscription({
            actorId,
            branchId,
            createdById,
            memberSubscriptionId,
            subscriptionAvailedId: selectedSubscriptionId,
            dueDate,
            gracePeriodDays: graceDays,
            subtotal: selectedSubscription.amount,
          })
        }
      } catch (invError) {
        console.warn('Invoice creation skipped or failed (details dialog):', invError)
      }

      // Create payment if method selected and we can resolve an invoice
      try {
        if (!canEditBilling) {
          // Billing is locked.
          // Member info edits are still allowed.
          throw new Error('Billing locked')
        }
        const memberSubscriptionId = subscriptionResult?.memberSubscriptionId ?? currentMemberSubscriptionId
        const createdById = subscriptionResult?.createdById ?? memberSubscriptionQuery.data?.createdById
        const branchId = memberSubscriptionQuery.data?.branchId ?? session.primaryBranchId
        if (memberSubscriptionId && selectedSubscription && createdById && branchId) {
          await createPaymentIfNeeded({
            paymentMethodId,
            invoiceId: ensuredInvoiceId,
            createdById,
            amount: selectedSubscription.amount,
            paidAt: new Date(),
          })
        }
      } catch (payError) {
        if (!(payError instanceof Error && payError.message === 'Billing locked')) {
          console.warn('Payment creation skipped or failed (details dialog):', payError)
        }
      }
      
      const updated: MemberFormData = {
        ...memberGroup,
        members,
        startDate,
        endDate,
        membershipType: selectedSubscription?.name ?? memberGroup.membershipType,
        membershipDuration: selectedSubscription
          ? `${selectedSubscription.intervalCount} ${selectedSubscription.intervals}`
          : memberGroup.membershipDuration,
        billingAmount: selectedSubscription?.amount.toString() ?? memberGroup.billingAmount,
        billingCycle: selectedSubscription
          ? `${selectedSubscription.intervalCount} ${selectedSubscription.intervals}`
          : memberGroup.billingCycle,
        paymentMethod: paymentMethodName,
        membershipDetails,
        documents,
      }

      onSave(updated)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save member details:', error)
      alert(error instanceof Error ? error.message : 'Failed to save changes')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>

          {!memberGroup ? (
            <div className="text-sm text-muted-foreground">No member selected.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Member & Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="font-semibold leading-none tracking-tight">Member Information</h3>
                      {members.map((m, index) => (
                        <div key={m.id} className="rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`firstName-${m.id}`}>First Name</Label>
                              <Input
                                id={`firstName-${m.id}`}
                                value={m.firstName || ''}
                                onChange={(e) => handleMemberFieldChange(index, 'firstName', e.target.value)}
                                placeholder="Juan"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`middleName-${m.id}`}>Middle Name</Label>
                              <Input
                                id={`middleName-${m.id}`}
                                value={m.middleName || ''}
                                onChange={(e) => handleMemberFieldChange(index, 'middleName', e.target.value)}
                                placeholder="D."
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`surname-${m.id}`}>Surname</Label>
                              <Input
                                id={`surname-${m.id}`}
                                value={m.surname || ''}
                                onChange={(e) => handleMemberFieldChange(index, 'surname', e.target.value)}
                                placeholder="Dela Cruz"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`suffix-${m.id}`}>Suffix</Label>
                              <Input
                                id={`suffix-${m.id}`}
                                value={m.suffix || ''}
                                onChange={(e) => handleMemberFieldChange(index, 'suffix', e.target.value)}
                                placeholder="Jr."
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label>Status</Label>
                              <Select
                                value={m.status || 'UNDECIDED'}
                                onValueChange={(v) => handleMemberFieldChange(index, 'status', v)}
                              >
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
                          onChange={(e) => setMembershipDetails(e.target.value)}
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
                  onPaymentMethodChange={(id, name) => {
                    setPaymentMethodId(id)
                    setPaymentMethodName(name)
                  }}
                  totalCost={totalCost}
                  disabled={!canEditBilling}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateSubscriptionMutation.isPending}>
              Close
            </Button>
            <Button type="submit" disabled={!memberGroup || updateSubscriptionMutation.isPending}>
              {updateSubscriptionMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}