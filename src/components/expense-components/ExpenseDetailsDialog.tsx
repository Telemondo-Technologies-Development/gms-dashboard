import type { ChangeEvent, FormEvent } from 'react'
import { Upload, Edit2, Trash2, FileText, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  //expense,
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
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle>
              {isEditing ? 'Edit Expense History' : 'Expense Details'}
            </DialogTitle>
            {!isEditing && (
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} id="edit-expense-form">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="text-sm font-medium">Expense Information</div>

                <div className="rounded-lg border p-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
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
                      <div className="space-y-1.5">
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

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-name">Name / Note</Label>
                    {isEditing ? (
                      <Input
                        id="edit-name"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-date">Date</Label>
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

                    <div className="space-y-1.5">
                      <Label htmlFor="edit-amount">Amount</Label>
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

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-description">Description</Label>
                    {isEditing ? (
                      <Textarea
                        id="edit-description"
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

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="text-sm font-medium">Receipt / Document</div>

                <div className="rounded-lg border p-3 space-y-3">
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
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-receipt">
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
                          htmlFor="edit-receipt"
                          className="flex flex-1 items-center justify-center rounded-2xl border px-4 py-2 cursor-pointer bg-transparent hover:bg-muted/10"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          <span className="text-sm text-muted-foreground">
                            {receipt ? 'Change file' : 'Choose file'}
                          </span>
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
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Additional Details</div>

                <div className="rounded-lg border p-3 space-y-3">
                  <div className="space-y-1.5">
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
                      <div className="flex items-center h-9">
                        <span>{branch}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
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
                      <div className="flex items-center h-9">
                        <span className="capitalize">{paymentMethod.replace('-', ' ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between pt-4">
            <div>
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
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={onCancel}>
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
  )
}