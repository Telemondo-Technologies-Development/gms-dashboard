import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Upload } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { MemberFormData, MemberInfo } from '@/components/membership-components/AddMemberDialog'
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

interface MemberDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberGroup: MemberFormData | null
  onSave: (updated: MemberFormData) => void
}

export function MemberDetailsDialog({ open, onOpenChange, memberGroup, onSave }: MemberDetailsDialogProps) {
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [documents, setDocuments] = useState<File[]>([])

  const [membershipType, setMembershipType] = useState('')
  const [membershipDuration, setMembershipDuration] = useState('')
  const [billingAmount, setBillingAmount] = useState('')
  const [billingCycle, setBillingCycle] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [membershipDetails, setMembershipDetails] = useState('')

  useEffect(() => {
    if (!memberGroup) return

    setMembers(memberGroup.members)
    setStartDate(memberGroup.startDate)
    setEndDate(memberGroup.endDate)
    setDocuments(memberGroup.documents)

    setMembershipType(memberGroup.membershipType)
    setMembershipDuration(memberGroup.membershipDuration)
    setBillingAmount(memberGroup.billingAmount)
    setBillingCycle(memberGroup.billingCycle)
    setPaymentMethod(memberGroup.paymentMethod)
    setMembershipDetails(memberGroup.membershipDetails)
  }, [memberGroup])

  const totalCost = useMemo(() => {
    const amount = Number.parseFloat(billingAmount)
    const safeAmount = Number.isFinite(amount) ? amount : 0
    return (safeAmount * Math.max(1, members.length)).toFixed(2)
  }, [billingAmount, members.length])

  const handleMemberFieldChange = (index: number, field: keyof MemberInfo, value: string) => {
    setMembers((prev) => {
      const next = [...prev]
      const member = next[index]
      if (!member) return prev
      next[index] = { ...member, [field]: value }
      return next
    })
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setDocuments(Array.from(e.target.files))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!memberGroup) return

    const updated: MemberFormData = {
      ...memberGroup,
      members,
      startDate,
      endDate,
      membershipType,
      membershipDuration,
      billingAmount,
      billingCycle,
      paymentMethod,
      membershipDetails,
      documents,
    }

    onSave(updated)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl h-[95vh]">
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
                <div className="space-y-4">
                  <div className="text-sm font-medium">Member Information</div>

                  {members.map((m, index) => (
                    <div key={m.id} className="rounded-lg border p-4 space-y-4">
                      <div className="text-sm font-medium text-muted-foreground">Member {index + 1}</div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${m.id}`}>Full Name</Label>
                          <Input
                            id={`name-${m.id}`}
                            value={m.name}
                            onChange={(e) => handleMemberFieldChange(index, 'name', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`email-${m.id}`}>Email</Label>
                          <Input
                            id={`email-${m.id}`}
                            type="email"
                            value={m.email}
                            onChange={(e) => handleMemberFieldChange(index, 'email', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`phone-${m.id}`}>Phone Number</Label>
                          <Input
                            id={`phone-${m.id}`}
                            value={m.phone}
                            onChange={(e) => handleMemberFieldChange(index, 'phone', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium">Membership</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="membershipType">Membership Type</Label>
                      <Select value={membershipType} onValueChange={setMembershipType}>
                        <SelectTrigger id="membershipType">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="membershipDuration">Duration</Label>
                      <Select value={membershipDuration} onValueChange={setMembershipDuration}>
                        <SelectTrigger id="membershipDuration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day Tour</SelectItem>
                          <SelectItem value="1-month">1 Month</SelectItem>
                          <SelectItem value="3-months">3 Months</SelectItem>
                          <SelectItem value="6-months">6 Months</SelectItem>
                          <SelectItem value="12-months">12 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

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

                <div className="space-y-2">
                  <div className="text-sm font-medium">Documents</div>

                  {documents.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Current: {documents.map((d) => d.name).join(', ')}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="documents">Update Documents</Label>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="documents"
                        className="flex w-full items-center justify-center rounded-2xl border px-4 py-2 cursor-pointer bg-transparent hover:bg-muted/10"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        <span className="text-sm text-muted-foreground">
                          {documents.length > 0 ? `${documents.length} file(s) selected` : 'No files chosen'}
                        </span>
                      </label>
                      <input
                        id="documents"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="sr-only"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium">Billing</div>

                <div className="space-y-2">
                  <Label htmlFor="billingAmount">Amount per Member (PHP)</Label>
                  <Input
                    id="billingAmount"
                    type="number"
                    step="0.01"
                    value={billingAmount}
                    onChange={(e) => setBillingAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select value={billingCycle} onValueChange={setBillingCycle}>
                    <SelectTrigger id="billingCycle">
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day (Day Tour)</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                    <span className="text-sm text-muted-foreground">Price per member</span>
                    <span className="font-medium">PHP {billingAmount || '0.00'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Billing cycle</span>
                    <span className="font-medium">{billingCycle || '—'}</span>
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
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit" disabled={!memberGroup}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
