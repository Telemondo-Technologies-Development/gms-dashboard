import type { ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react'
import { Upload, DollarSign, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  setFormData: Dispatch<SetStateAction<AddExpenseFormData>>
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={onSubmit}>
        <DialogContent className="max-w-[95vw] md:max-w-[900px] xl:max-w-[1100px] max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Fill in the expense details. Click save when you're done.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Expense Information
                  </CardTitle>
                  <CardDescription>Add expense details</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="add-type">Expense Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => {
                          setFormData((prev) => ({ ...prev, type: v }))
                          if (v !== 'salary') {
                            setFormData((prev) => ({ ...prev, salaryType: '' }))
                          }
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
                          onValueChange={(v) => setFormData((prev) => ({ ...prev, salaryType: v }))}
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

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="add-name">Name / Note *</Label>
                      <Input
                        id="add-name"
                        placeholder="Enter expense name or note"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

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
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-amount">Amount *</Label>
                      <Input
                        id="add-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="add-description">Description</Label>
                      <Textarea
                        id="add-description"
                        placeholder="Additional notes or details..."
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Receipt / Document</CardTitle>
                  <CardDescription>Upload receipt image or file</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="add-receipt">Add Receipt Image or File</Label>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Additional Details</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-branch">Branch *</Label>
                    <Select
                      value={formData.branch}
                      onValueChange={(v) => setFormData((prev) => ({ ...prev, branch: v }))}
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
                      onValueChange={(v) => setFormData((prev) => ({ ...prev, paymentMethod: v }))}
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

                  <div className="rounded-2xl border bg-muted/50 p-4 space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Expense Type</span>
                      <span className="font-medium capitalize">
                        {formData.type ? formData.type.replace('-', ' ') : '—'}
                      </span>
                    </div>
                    {formData.type === 'salary' && formData.salaryType && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Salary Type</span>
                        <span className="font-medium capitalize">{formData.salaryType}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Branch</span>
                      <span className="font-medium">{formData.branch || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Payment Method</span>
                      <span className="font-medium capitalize">
                        {formData.paymentMethod ? formData.paymentMethod.replace('-', ' ') : '—'}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="font-semibold">Amount</span>
                      <span className="text-2xl font-bold text-primary">
                        ₱{formData.amount ? Number.parseFloat(formData.amount).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) : '0.00'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}