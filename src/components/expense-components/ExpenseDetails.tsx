import type { ChangeEvent, FormEvent } from 'react'
import { Upload, Edit2, Trash2, FileText, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BRANCHES, EXPENSE_TYPES, SALARY_TYPES, PAYMENT_METHODS } from '@/lib/expense-constants'
import type { ExpenseFormData } from '@/lib/expense-types'

interface ExpenseDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  expense: ExpenseFormData | null
  type: string
  setType: (type: string) => void
  name: string
  setName: (name: string) => void
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  amount: string
  setAmount: (amount: string) => void
  branch: string
  setBranch: (branch: string) => void
  paymentMethod: string
  setPaymentMethod: (method: string) => void
  description: string
  setDescription: (description: string) => void
  receipt: File | null
  setReceipt: (file: File | null) => void
  salaryType: string
  setSalaryType: (type: string) => void
  onSubmit: (e: FormEvent) => void
  onDelete: () => void
  onCancel: () => void
}

export function ExpenseDetailsDialog({
  open,
  onOpenChange,
  isEditing,
  setIsEditing,
  type,
  setType,
  name,
  setName,
  date,
  setDate,
  amount,
  setAmount,
  branch,
  setBranch,
  paymentMethod,
  setPaymentMethod,
  description,
  setDescription,
  receipt,
  setReceipt,
  salaryType,
  setSalaryType,
  onSubmit,
  onDelete,
  onCancel,
}: ExpenseDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle>
              {isEditing ? 'Edit Expense' : 'Expense Details'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Expense Information */}
            <div className="space-y-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">Expense Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-type">Expense Type</Label>
                      {isEditing ? (
                        <Select
                          value={type}
                          onValueChange={(v) => {
                            setType(v)
                            if (v !== 'salary') {
                              setSalaryType('')
                            }
                          }}
                        >
                          <SelectTrigger id="edit-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPENSE_TYPES.map((expenseType) => (
                              <SelectItem key={expenseType.value} value={expenseType.value}>
                                {expenseType.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center h-9">
                          <Badge variant="secondary" className="capitalize">
                            {type.replace('-', ' ')}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {type === 'salary' && (
                      <div className="space-y-2">
                        <Label htmlFor="edit-salaryType">Salary Type</Label>
                        {isEditing ? (
                          <Select value={salaryType} onValueChange={setSalaryType}>
                            <SelectTrigger id="edit-salaryType">
                              <SelectValue placeholder="Select salary type" />
                            </SelectTrigger>
                            <SelectContent>
                              {SALARY_TYPES.map((salType) => (
                                <SelectItem key={salType.value} value={salType.value}>
                                  {salType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center h-9">
                            <Badge variant="outline" className="capitalize">
                              {salaryType}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name / Note</Label>
                    {isEditing ? (
                      <Input
                        id="edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    ) : (
                      <Input 
                        value={name} 
                        disabled 
                        className="bg-muted text-muted-foreground"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      {isEditing ? (
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
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground h-9">
                          <CalendarIcon className="h-3 w-3" />
                          {date ? format(date, 'MMM dd, yyyy') : '—'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-amount">Amount (PHP)</Label>
                      {isEditing ? (
                        <Input
                          id="edit-amount"
                          type="number"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      ) : (
                        <Input 
                          value={`₱${Number.parseFloat(amount).toLocaleString('en-PH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                          disabled 
                          className="bg-muted text-muted-foreground font-semibold"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    {isEditing ? (
                      <Textarea
                        id="edit-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <div className="min-h-[60px] rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                        {description || 'No description provided'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Receipt / Document</Label>
                    {isEditing ? (
                      <div className="space-y-3">
                        {receipt && (
                          <div className="rounded-lg border border-dashed p-4 bg-muted/50">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{receipt.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(receipt.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <label
                          htmlFor="edit-receipt"
                          className="flex w-full items-center justify-center rounded-lg border border-dashed px-4 py-6 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="text-center space-y-2">
                            <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                              {receipt ? 'Change file' : 'Click to upload'}
                            </div>
                          </div>
                        </label>
                        <input
                          id="edit-receipt"
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
                    ) : (
                      <div className="rounded-lg border border-dashed p-8 bg-muted/50">
                        {receipt ? (
                          <div className="flex items-center justify-center gap-3">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                            <div className="text-center">
                              <p className="text-sm font-medium">{receipt.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(receipt.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-center text-sm text-muted-foreground">
                            No receipt attached
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Additional Details */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-branch">Branch</Label>
                  {isEditing ? (
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger id="edit-branch">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANCHES.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      value={branch} 
                      disabled 
                      className="bg-muted text-muted-foreground"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-paymentMethod">Payment Method</Label>
                  {isEditing ? (
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger id="edit-paymentMethod">
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
                  ) : (
                    <Input 
                      value={paymentMethod.replace('-', ' ')} 
                      disabled 
                      className="bg-muted text-muted-foreground capitalize"
                    />
                  )}
                </div>

                <div className="rounded-xl bg-muted/50 p-4 space-y-3 mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expense Type</span>
                    <span className="font-medium capitalize">{type.replace('-', ' ')}</span>
                  </div>
                  {type === 'salary' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Salary Type</span>
                      <span className="font-medium capitalize">{salaryType}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Branch</span>
                    <span className="font-medium">{branch}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">{paymentMethod.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Receipt Status</span>
                    <span className="font-medium">{receipt ? 'Attached' : 'Not attached'}</span>
                  </div>
                  <div className="border-t pt-3 flex items-center justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      PHP {Number.parseFloat(amount).toLocaleString('en-PH', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex items-center justify-between mt-6">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              {isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}