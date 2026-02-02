import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import type { MemberFormData, MemberInfo } from '@/types/membership/memberSchemas'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import { BranchPersonnelApi } from '@/api/generated/apis/BranchPersonnelApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import type { BranchPersonnelTableDTO } from '@/api/generated/models/BranchPersonnelTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'



export function MemberDetailsDialog({ open, onOpenChange, memberGroup, onSave }: MemberDetailsDialogProps) {
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [documents, setDocuments] = useState<File[]>([])

  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [membershipDetails, setMembershipDetails] = useState('')
  const [currentMemberSubscriptionId, setCurrentMemberSubscriptionId] = useState<string | undefined>(undefined)
  
  const queryClient = useQueryClient()
  
  // Initialize API clients
  const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)
  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
  const branchPersonnelApi = getAuthenticatedApi(BranchPersonnelApi)
  
  // Fetch available subscription availed
  const subscriptionsQuery = useQuery<SubscriptionAvailedTableDTO[]>({
    queryKey: ['subscriptionAvailed'],
    enabled: open,
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
  
  // Fetch member's current subscription
  const memberSubscriptionQuery = useQuery<MemberSubscriptionTableDTO | null>({
    queryKey: ['memberSubscription', memberGroup?.id],
    enabled: open && !!memberGroup?.id,
    queryFn: async () => {
      if (!memberGroup?.id) return null
      try {
        const response = await memberSubscriptionApi.getAllMemberSubscriptions({ pageable: {} })
        const subscription = response.data?.find(
          (sub: MemberSubscriptionTableDTO) => sub.actorId === memberGroup.id && sub.status === 'ACTIVE'
        )
        return subscription ?? null
      } catch (error) {
        console.error('Failed to fetch member subscription:', error)
        return null
      }
    },
    retry: false,
  })

  // Fetch member branch as a fallback (in case MemberSubscription record is missing branchId)
  const memberBranchQuery = useQuery<BranchPersonnelTableDTO | null>({
    queryKey: ['memberBranch', memberGroup?.id],
    enabled: open && !!memberGroup?.id,
    queryFn: async () => {
      if (!memberGroup?.id) return null
      try {
        const response = await branchPersonnelApi.getAllBranchPersonnel({ pageable: {} })
        const record = response.data?.find(
          (r: BranchPersonnelTableDTO) => r.actorId === memberGroup.id && r.status === 'IN',
        )
        return record ?? null
      } catch (error) {
        console.error('Failed to fetch member branch:', error)
        return null
      }
    },
    retry: false,
  })
  
  const selectedSubscription = subscriptionsQuery.data?.find(
    (s: SubscriptionAvailedTableDTO) => s.id === selectedSubscriptionId,
  )

  useEffect(() => {
    if (!memberGroup) return

    setMembers(memberGroup.members)
    setStartDate(memberGroup.startDate)
    setEndDate(memberGroup.endDate)
    setDocuments(memberGroup.documents)
    setPaymentMethod(memberGroup.paymentMethod)
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
      const branchId = memberSub?.branchId ?? memberBranchQuery.data?.branchId
      if (!branchId) {
        throw new Error('Member branch information not found. Please assign this member to a branch first.')
      }
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('auth_email') : null
      
      if (!token && !storedEmail) {
        throw new Error('User not authenticated')
      }
      
      // Get current user's actor ID from localStorage or token
      const updatedById = memberSub?.updatedById || memberSub?.createdById
      if (!updatedById) {
        throw new Error('Cannot determine user ID')
      }
      
      if (currentMemberSubscriptionId) {
        // Update existing subscription
        await memberSubscriptionApi.updateMemberSubscription({
          id: currentMemberSubscriptionId,
          memberSubscriptionPutDTO: {
            actorId: memberGroup.id,
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
        
        await memberSubscriptionApi.createMemberSubscription({
          memberSubscriptionPostDTO: {
            actorId: memberGroup.id,
            branchId,
            createdById,
            startDate,
            endDate,
            status: 'ACTIVE',
            subscriptionId: selectedSubscriptionId,
          },
        })
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['memberSubscription', memberGroup?.id] })
      void queryClient.invalidateQueries({ queryKey: ['members'] })
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
      if (selectedSubscriptionId && startDate) {
        await updateSubscriptionMutation.mutateAsync()
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
        paymentMethod,
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
            <DialogDescription>View and update membership and billing information.</DialogDescription>
          </DialogHeader>

          {!memberGroup ? (
            <div className="text-sm text-muted-foreground">No member selected.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="">
                  <div className="space-y-4 border border-border p-4 rounded-2xl mb-4">
                    <div className="text-sm font-medium">Member Information</div>

                    {members.map((m, index) => (
                      <div key={m.id} className="rounded-lg p-2 space-y-4">

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

                  <div className="space-y-4 border border-border p-4 rounded-2xl mb-4">
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
                        <Label>Amount per Member (PHP)</Label>
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
                      {memberSubscriptionQuery.isLoading ? 'Loading subscription...' : 'No subscription selected'}
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
                      <span className="text-sm text-muted-foreground">Members</span>
                      <span className="font-medium">{Math.max(1, members.length)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Subscription</span>
                      <span className="font-medium">{selectedSubscription?.name || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price per member</span>
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