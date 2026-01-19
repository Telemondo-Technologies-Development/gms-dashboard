import type { ChangeEvent, FormEvent } from 'react'
import { Upload, DollarSign, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
//import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
      <DialogContent className="max-w-[95vw] md:max-w-[900px] xl:max-w-[1100px] max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="add-expense-form">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Expense Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="add-type">
                        Expense Type *
                      </Label>
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
                                            <div className="space-y-1.5">
                        <Label htmlFor="add-salaryType">
                          Salary Type *
                        </Label>
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

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="add-name">
                        Name / Note *
                      </Label>
                      <Input
                        id="add-name"
                        placeholder="Enter expense name or note"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>
                        Date *
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
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
                      <Label htmlFor="add-amount">
                        Amount *
                      </Label>
                      <Input
                        id="add-amount"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Enter amount in PHP</p>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="add-description">Description</Label>
                      <Textarea
                        id="add-description"
                        placeholder="Additional notes or details..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>


                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="add-receipt">Upload Receipt Image or File</Label>
                    <label
                      htmlFor="add-receipt"
                      className="flex w-full items-center justify-center rounded-2xl border px-4 py-2 cursor-pointer bg-transparent hover:bg-muted/10"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {receipt ? receipt.name : 'Choose file'}
                      </span>
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
                    <p className="text-xs text-muted-foreground">
                      Supported formats: PDF, JPG, PNG, DOC
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Additional Details</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="add-branch">
                      Branch *
                    </Label>
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
                    <Label htmlFor="add-paymentMethod">
                      Payment Method *
                    </Label>
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

                  <div className="rounded-2xl border bg-muted/50 p-3 space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Expense Type</span>
                      <span className="font-medium capitalize">
                        {formData.type ? formData.type.replace('-', ' ') : (
                          <span className="text-destructive text-sm">Required</span>
                        )}
                      </span>
                    </div>
                    {formData.type === 'salary' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Salary Type</span>
                        <span className="font-medium capitalize">
                          {formData.salaryType || (
                            <span className="text-destructive text-sm">Required</span>
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Branch</span>
                      <span className="font-medium">
                        {formData.branch || (
                          <span className="text-destructive text-sm">Required</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Payment Method</span>
                      <span className="font-medium capitalize">
                        {formData.paymentMethod ? formData.paymentMethod.replace('-', ' ') : (
                          <span className="text-destructive text-sm">Required</span>
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex items-center justify-between">
                      <span className="font-semibold">Amount</span>
                      <span className="text-2xl font-bold text-primary">
                        {formData.amount && Number.parseFloat(formData.amount) > 0 ? (
                          `₱${Number.parseFloat(formData.amount).toLocaleString('en-PH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        ) : (
                          <span className="text-destructive text-sm">Required</span>
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-4">
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}