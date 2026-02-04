import type { ChangeEvent, FormEvent } from 'react'
import { Upload, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BRANCHES, EXPENSE_TYPES, SALARY_TYPES, PAYMENT_METHODS } from '@/lib/expense-constants'

// Define the form data type
type AddExpenseFormData = {
  type: string
  name: string
  amount: string
  branch: string
  paymentMethod: string
  category: string
  description: string
  salaryType: string
}

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: AddExpenseFormData
  setFormData: React.Dispatch<React.SetStateAction<AddExpenseFormData>>
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  receipt: File | null
  setReceipt: (file: File | null) => void
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  date,
  setDate,
  receipt,
  setReceipt,
  onSubmit,
  onCancel,
}: AddExpenseDialogProps) {
  
  // Client-side validation function
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    // Check type
    if (!formData.type) errors.push('Expense Type is required')
    
    // Check salary type only if expense type is salary
    if (formData.type === 'salary' && !formData.salaryType) {
      errors.push('Salary Type is required for salary expenses')
    }
    
    // Check name
    if (!formData.name.trim()) errors.push('Name/Note is required')
    
    // Check date
    if (!date) errors.push('Date is required')
    
    // Check amount
    const amountNum = Number.parseFloat(formData.amount)
    if (!formData.amount || isNaN(amountNum) || amountNum <= 0) {
      errors.push('Valid Amount is required (greater than 0)')
    }
    
    // Check branch
    if (!formData.branch) errors.push('Branch is required')
    
    // Check payment method
    if (!formData.paymentMethod) errors.push('Payment Method is required')
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  // Enhanced form submit handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const validation = validateForm()
    
    if (!validation.isValid) {
      alert(`Please fix the following errors:\n\n${validation.errors.join('\n')}`)
      return
    }
    
    // If all validation passes, call the parent's onSubmit
    onSubmit(e)
  }
  
  // Handle amount change with validation
  const handleAmountChange = (value: string) => {
    // Allow only numbers and one decimal point
    const regex = /^\d*\.?\d*$/
    if (value === '' || regex.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }))
    }
  }

  const handleCancel = () => {
    onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>Record a new expense entry with receipt and payment details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Expense Details */}
            <div className="space-y-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">Expense Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-type">Expense Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => {
                          setFormData(prev => ({
                            ...prev,
                            type: v,
                            salaryType: v === 'salary' ? prev.salaryType : ''
                          }))
                        }}
                      >
                        <SelectTrigger id="add-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPENSE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.type === 'salary' && (
                      <div className="space-y-2">
                        <Label htmlFor="add-salaryType">Salary Type *</Label>
                        <Select
                          value={formData.salaryType}
                          onValueChange={(v) => setFormData(prev => ({ ...prev, salaryType: v }))}
                        >
                          <SelectTrigger id="add-salaryType">
                            <SelectValue placeholder="Select salary type" />
                          </SelectTrigger>
                          <SelectContent>
                            {SALARY_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-name">Name / Note *</Label>
                    <Input
                      id="add-name"
                      placeholder="Enter expense name or note"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !date && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar 
                            mode="single" 
                            selected={date} 
                            onSelect={setDate}
                            initialFocus 
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-amount">Amount (PHP) *</Label>
                      <Input
                        id="add-amount"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-description">Description</Label>
                    <Textarea
                      id="add-description"
                      placeholder="Additional notes or details..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-receipt">Receipt / Document</Label>
                    <label
                      htmlFor="add-receipt"
                      className="flex w-full items-center justify-center rounded-lg border border-dashed px-4 py-8 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-center space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          {receipt ? (
                            <span className="font-medium">{receipt.name}</span>
                          ) : (
                            <span>Click to upload or drag and drop</span>
                          )}
                        </div>
                        {!receipt && (
                          <p className="text-xs text-muted-foreground">
                            PDF, JPG, PNG, DOC (max 10MB)
                          </p>
                        )}
                      </div>
                    </label>
                    <input
                      id="add-receipt"
                      type="file"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setReceipt(e.target.files[0])
                        }
                      }}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="sr-only"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Summary */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="add-branch">Branch *</Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, branch: v }))}
                  >
                    <SelectTrigger id="add-branch">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-paymentMethod">Payment Method *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, paymentMethod: v }))}
                  >
                    <SelectTrigger id="add-paymentMethod">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expense Type</span>
                    <span className="font-medium capitalize">
                      {formData.type ? formData.type.replace('-', ' ') : '—'}
                    </span>
                  </div>
                  {formData.type === 'salary' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Salary Type</span>
                      <span className="font-medium capitalize">
                        {formData.salaryType || '—'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Branch</span>
                    <span className="font-medium">{formData.branch || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">
                      {formData.paymentMethod ? formData.paymentMethod.replace('-', ' ') : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Receipt</span>
                    <span className="font-medium">{receipt ? 'Attached' : 'Not attached'}</span>
                  </div>
                  <div className="border-t pt-3 flex items-center justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      PHP {formData.amount && Number.parseFloat(formData.amount) > 0
                        ? Number.parseFloat(formData.amount).toLocaleString('en-PH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : '0.00'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit">Create Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}