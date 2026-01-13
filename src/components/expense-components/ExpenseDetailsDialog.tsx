import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Upload, Trash2, Edit2, FileText } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ExpenseFormData } from '@/components/expense-components/AddExpenseDialog'
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
import { Badge } from '@/components/ui/badge'

interface ExpenseDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense: ExpenseFormData | null
  branches: string[]
  onSave: (updated: ExpenseFormData) => void
  onDelete: (id: string) => void
}

export function ExpenseDetailsDialog({
  open,
  onOpenChange,
  expense,
  branches,
  onSave,
  onDelete,
}: ExpenseDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [amount, setAmount] = useState('')
  const [branch, setBranch] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [description, setDescription] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [salaryType, setSalaryType] = useState('')

  useEffect(() => {
    if (!expense) return

    setType(expense.type)
    setName(expense.name)
    setDate(expense.date)
    setAmount(expense.amount)
    setBranch(expense.branch)
    setPaymentMethod(expense.paymentMethod)
    setDescription(expense.description)
    setReceipt(expense.receipt)
    setSalaryType(expense.salaryType || '')
    setIsEditing(false)
    setShowDeleteWarning(false)
  }, [expense])

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setReceipt(e.target.files[0])
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!expense || !date) return

    const updated: ExpenseFormData = {
      ...expense,
      type,
      name,
      date,
      amount,
      branch,
      paymentMethod,
      category: expense.category, // Keep original category
      description,
      receipt,
      ...(type === 'salary' && { salaryType }),
    }

    onSave(updated)
    setIsEditing(false)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (!expense) return
    onDelete(expense.id)
    setShowDeleteWarning(false)
  }

  if (!expense) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>No expense selected.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open && !showDeleteWarning} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle>
                    {isEditing ? 'Edit Expense History' : 'Expense Details'}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditing
                      ? 'Update expense information and details.'
                      : 'View expense information and details.'}
                  </DialogDescription>
                </div>
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                )}
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-sm font-medium">Expense Information</div>

                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-type">Expense Type</Label>
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
                            <SelectTrigger id="expense-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asset">Asset</SelectItem>
                              <SelectItem value="asset-maintenance">Asset Maintenance</SelectItem>
                              <SelectItem value="salary">Salary</SelectItem>
                              <SelectItem value="utility">Utility</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
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
                          <Label htmlFor="salary-type">Salary Type</Label>
                          {isEditing ? (
                            <Select value={salaryType} onValueChange={setSalaryType}>
                              <SelectTrigger id="salary-type">
                                <SelectValue placeholder="Select salary type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full">Full</SelectItem>
                                <SelectItem value="partial">Partial</SelectItem>
                                <SelectItem value="advance">Advance</SelectItem>
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
                      <Label htmlFor="expense-name">Name / Note</Label>
                      {isEditing ? (
                        <Input
                          id="expense-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      ) : (
                        <div className="flex items-center h-9">
                          <span>{name}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-date">Date</Label>
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
                              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <div className="flex items-center h-9">
                            <span>{format(date || new Date(), 'PPP')}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expense-amount">Amount</Label>
                        {isEditing ? (
                          <Input
                            id="expense-amount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                          />
                        ) : (
                          <div className="flex items-center h-9">
                            <span className="font-semibold">
                              ₱{Number.parseFloat(amount).toLocaleString('en-PH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expense-description">Description</Label>
                      {isEditing ? (
                        <Textarea
                          id="expense-description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <div className="min-h-[60px] text-sm text-muted-foreground">
                          {description || 'No description provided'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-sm font-medium">Receipt / Document</div>

                  <div className="rounded-lg border p-4 space-y-4">
                    {!isEditing && receipt && (
                      <div className="flex items-center justify-center bg-muted rounded-lg p-8">
                        <div className="text-center space-y-2">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm font-medium">{receipt.name}</p>
                        </div>
                      </div>
                    )}

                    {!isEditing && !receipt && (
                      <div className="flex items-center justify-center bg-muted rounded-lg p-8">
                        <p className="text-sm text-muted-foreground">No images or file attached</p>
                      </div>
                    )}

                    {isEditing && (
                      <div className="space-y-2">
                        <Label htmlFor="receipt-upload">
                          {receipt ? 'Update Receipt' : 'Add Receipt Image or File'}
                        </Label>
                        <div className="flex flex-col gap-2">
                          {receipt && (
                            <div className="flex items-center justify-center bg-muted rounded-lg p-4">
                              <div className="text-center space-y-1">
                                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                                <p className="text-xs font-medium">{receipt.name}</p>
                              </div>
                            </div>
                          )}
                          <label
                            htmlFor="receipt-upload"
                            className="flex flex-1 items-center justify-center rounded-2xl border px-4 py-2 cursor-pointer bg-transparent hover:bg-muted/10"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            <span className="text-sm text-muted-foreground">
                              {receipt ? 'Change file' : 'Choose file'}
                            </span>
                          </label>
                          <input
                            id="receipt-upload"
                            type="file"
                            onChange={handleFileUpload}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            className="sr-only"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium">Additional Details</div>

                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      {isEditing ? (
                        <Select value={branch} onValueChange={setBranch}>
                          <SelectTrigger id="branch">
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center h-9">
                          <span>{branch}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      {isEditing ? (
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger id="payment-method">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="gcash">GCash</SelectItem>
                            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center h-9">
                          <span className="capitalize">{paymentMethod.replace('-', ' ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <div>
                {isEditing && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteWarning(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        if (expense) {
                          setType(expense.type)
                          setName(expense.name)
                          setDate(expense.date)
                          setAmount(expense.amount)
                          setBranch(expense.branch)
                          setPaymentMethod(expense.paymentMethod)
                          setDescription(expense.description)
                          setReceipt(expense.receipt)
                          setSalaryType(expense.salaryType || '')
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save changes</Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Warning Dialog */}
      <Dialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
        <DialogContent className="max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-destructive">WARNING!</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="default"
              onClick={handleDelete}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteWarning(false)}
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}