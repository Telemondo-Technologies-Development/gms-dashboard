import type { ChangeEvent, FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ChevronRight, Plus, Upload, Users, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

interface AddMemberDialogProps {
  onAddMember: (member: MemberFormData) => void
}

export interface MemberInfo {
  id: string
  name: string
  email: string
  phone: string
}

export interface MemberFormData {
  id: string
  members: MemberInfo[]
  startDate?: Date
  endDate?: Date
  membershipType: string
  membershipDuration: string
  billingAmount: string
  billingCycle: string
  paymentMethod: string
  membershipDetails: string
  documents: File[]
}

export function AddMemberDialog({ onAddMember }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'membership' | 'billing'>('membership')
  const [stepError, setStepError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [documents, setDocuments] = useState<File[]>([])

  const [member, setMember] = useState<MemberInfo>({
    id: crypto.randomUUID(),
    name: '',
    email: '',
    phone: '',
  })

  const [formData, setFormData] = useState({
    membershipType: '',
    membershipDuration: '',
    billingAmount: '',
    billingCycle: '',
    paymentMethod: '',
    membershipDetails: '',
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMemberChange = (field: keyof MemberInfo, value: string) => {
    setMember((prev) => ({ ...prev, [field]: value }))
  }

  const totalCost = useMemo(() => {
    const amount = Number.parseFloat(formData.billingAmount)
    const safe = Number.isFinite(amount) ? amount : 0
    return (safe * 1).toFixed(2)
  }, [formData.billingAmount])

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setDocuments(Array.from(e.target.files))
  }

  const resetForm = () => {
    setMember({ id: crypto.randomUUID(), name: '', email: '', phone: '' })
    setFormData({
      membershipType: '',
      membershipDuration: '',
      billingAmount: '',
      billingCycle: '',
      paymentMethod: '',
      membershipDetails: '',
    })
    setStep('membership')
    setStepError(null)
    setStartDate(undefined)
    setEndDate(undefined)
    setDocuments([])
  }

  const validateMembershipStep = () => {
    if (!member.name.trim()) return 'Full name is required.'
    if (!member.email.trim()) return 'Email is required.'
    if (!member.phone.trim()) return 'Phone number is required.'
    if (!formData.membershipType) return 'Membership type is required.'
    if (!formData.membershipDuration) return 'Membership duration is required.'
    if (!startDate) return 'Start date is required.'
    return null
  }

  const validateBillingStep = () => {
    const amount = Number.parseFloat(formData.billingAmount)
    if (!Number.isFinite(amount) || amount <= 0) return 'Billing amount must be greater than 0.'
    if (!formData.billingCycle) return 'Billing cycle is required.'
    if (!formData.paymentMethod) return 'Mode of payment is required.'
    return null
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const err = validateBillingStep()
    if (err) {
      setStepError(err)
      return
    }

    const payload: MemberFormData = {
      id: crypto.randomUUID(),
      members: [member],
      startDate,
      endDate,
      membershipType: formData.membershipType,
      membershipDuration: formData.membershipDuration,
      billingAmount: formData.billingAmount,
      billingCycle: formData.billingCycle,
      paymentMethod: formData.paymentMethod,
      membershipDetails: formData.membershipDetails,
      documents,
    }
    onAddMember(payload)
    resetForm()
    setOpen(false)
  }

  const handleSkipBilling = () => {
    const membershipErr = validateMembershipStep()
    if (membershipErr) {
      setStepError(membershipErr)
      setStep('membership')
      return
    }

    const payload: MemberFormData = {
      id: crypto.randomUUID(),
      members: [member],
      startDate,
      endDate,
      membershipType: formData.membershipType,
      membershipDuration: formData.membershipDuration,
      billingAmount: '',
      billingCycle: '',
      paymentMethod: '',
      membershipDetails: formData.membershipDetails,
      documents,
    }
    onAddMember(payload)
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          resetForm()
          setOpen(true)
          return
        }
        resetForm()
        setOpen(false)
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Member
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-none w-[95vw] sm:max-w-none md:w-275 xl:w-350 h-[95vh] overflow-hidden p-0 flex flex-col gap-0"
      >
        <div className="p-6 border-b">
          <DialogHeader className="text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>
                  {step === 'membership'
                    ? 'Step 1: Membership details (no billing yet).'
                    : 'Step 2: Choose billing subscription.'}
                </DialogDescription>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold',
                      step === 'membership'
                        ? 'border-primary text-primary'
                        : 'border-muted-foreground/30 text-muted-foreground',
                    )}
                  >
                    1
                  </span>
                  <span className={step === 'membership' ? 'text-foreground' : undefined}>Membership</span>
                  <ChevronRight className="h-4 w-4" />
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold',
                      step === 'billing'
                        ? 'border-primary text-primary'
                        : 'border-muted-foreground/30 text-muted-foreground',
                    )}
                  >
                    2
                  </span>
                  <span className={step === 'billing' ? 'text-foreground' : undefined}>Billing</span>
                </div>
              </div>

              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Member Information
                      </CardTitle>
                      <CardDescription>Add member details</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={member.name}
                          onChange={(e) => handleMemberChange('name', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={member.email}
                          onChange={(e) => handleMemberChange('email', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={member.phone}
                          onChange={(e) => handleMemberChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardHeader>
                    <CardTitle className="text-lg">Membership Details</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="membershipType">Membership Type *</Label>
                        <Select
                          value={formData.membershipType}
                          onValueChange={(v) => handleInputChange('membershipType', v)}
                        >
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
                        <Label htmlFor="membershipDuration">Duration *</Label>
                        <Select
                          value={formData.membershipDuration}
                          onValueChange={(v) => handleInputChange('membershipDuration', v)}
                        >
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
                        <Label>Start Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !startDate && 'text-muted-foreground',
                              )}
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
                        placeholder="Any special requirements or notes..."
                        value={formData.membershipDetails}
                        onChange={(e) => handleInputChange('membershipDetails', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>

                  <CardHeader>
                    <CardTitle className="text-lg">Member Documents</CardTitle>
                    <CardDescription>Upload ID, medical certificates, etc.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="documents">Upload Documents</Label>
                      <div className="flex items-center gap-2 w-100">
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
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {step === 'billing' ? (
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">Billing</CardTitle>
                      <CardDescription>Select what subscription the member will take.</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingAmount">Amount per Member (PHP) *</Label>
                          <Input
                            id="billingAmount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.billingAmount}
                            onChange={(e) => handleInputChange('billingAmount', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2 m-auto">
                          <Label htmlFor="billingCycle">Billing Cycle *</Label>
                          <Select
                            value={formData.billingCycle}
                            onValueChange={(v) => handleInputChange('billingCycle', v)}
                          >
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

                        <div className="space-y-2 m-auto">
                          <Label htmlFor="paymentMethod">Mode of Payment *</Label>
                          <Select
                            value={formData.paymentMethod}
                            onValueChange={(v) => handleInputChange('paymentMethod', v)}
                          >
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

                        <div className="rounded-2xl border bg-muted/50 p-4 space-y-3 mt-auto pb-6">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Member</span>
                            <span className="font-medium">{member.name || '—'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Price per member</span>
                            <span className="font-medium">PHP {formData.billingAmount || '0.00'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Billing cycle</span>
                            <span className="font-medium">{formData.billingCycle || '—'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Mode of payment</span>
                            <span className="font-medium">{formData.paymentMethod || '—'}</span>
                          </div>
                          <div className="border-t pt-3 flex items-center justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="text-2xl font-bold text-primary">PHP {totalCost}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">Billing</CardTitle>
                      <CardDescription>Billing is set up in Step 2 after saving membership info.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Click “Next” when you’re ready to select a subscription.
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-6 pt-4 border-t sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-destructive">{stepError ?? ''}</div>
            <div className="flex items-center justify-end gap-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setOpen(false)
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>

              {step === 'membership' ? (
                <Button
                  type="button"
                  onClick={() => {
                    const err = validateMembershipStep()
                    if (err) {
                      setStepError(err)
                      return
                    }
                    setStepError(null)
                    setStep('billing')
                  }}
                >
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStepError(null)
                      setStep('membership')
                    }}
                  >
                    Back
                  </Button>
                  <Button type="button" variant="outline" onClick={handleSkipBilling}>
                    Save (membership only)
                  </Button>
                  <Button type="submit">Save</Button>
                </>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
