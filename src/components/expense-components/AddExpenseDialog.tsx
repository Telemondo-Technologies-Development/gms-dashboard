import type { ChangeEvent, FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Plus, Upload, DollarSign } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface AddExpenseDialogProps {
  onAddExpense: (expense: ExpenseFormData) => void
  branches: string[]
}

export interface ExpenseFormData {
  id: string
  type: string
  name: string
  date: Date
  amount: string
  branch: string
  paymentMethod: string
  category: string
  description: string
  receipt: File | null
  salaryType?: string
}

export function AddExpenseDialog({ onAddExpense, branches }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [receipt, setReceipt] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    amount: '',
    branch: branches[0] || '',
    paymentMethod: '',
    category: 'operational',
    description: '',
    salaryType: '',
  })

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setReceipt(e.target.files[0])
  }

  const resetForm = () => {
    setFormData({
      type: '',
      name: '',
      amount: '',
      branch: branches[0] || '',
      paymentMethod: '',
      category: 'operational',
      description: '',
      salaryType: '',
    })
    setDate(new Date())
    setReceipt(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!date) return

    const payload: ExpenseFormData = {
      id: crypto.randomUUID(),
      type: formData.type,
      name: formData.name,
      date,
      amount: formData.amount,
      branch: formData.branch,
      paymentMethod: formData.paymentMethod,
      category: formData.category,
      description: formData.description,
      receipt,
      ...(formData.type === 'salary' && { salaryType: formData.salaryType }),
    }
    onAddExpense(payload)
    resetForm()
    setOpen(false)
  }

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add New Expense
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              resetForm()
              setOpen(false)
            }}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative flex flex-col bg-background text-foreground rounded-lg shadow-lg max-w-none w-[95vw] md:w-[900px] xl:w-[1100px] h-[85vh] overflow-hidden"
          >
            <div className="p-6 border-b flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold">Add New Expense</h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the expense details. Click save when you're done.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <Card className="h-fit">
                      <CardHeader className="pb-3">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Expense Information
                          </CardTitle>
                          <CardDescription>Add expense details</CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="type">Expense Type *</Label>
                            <Select
                              value={formData.type}
                              onValueChange={(v) => {
                                handleInputChange('type', v)
                                // Reset salary type when changing away from salary
                                if (v !== 'salary') {
                                  handleInputChange('salaryType', '')
                                }
                              }}
                            >
                              <SelectTrigger id="type">
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
                          </div>

                          {/* Conditional Salary Type field - only shows when type is 'salary' */}
                          {formData.type === 'salary' && (
                            <div className="space-y-2">
                              <Label htmlFor="salaryType">Salary Type *</Label>
                              <Select
                                value={formData.salaryType}
                                onValueChange={(v) => handleInputChange('salaryType', v)}
                              >
                                <SelectTrigger id="salaryType">
                                  <SelectValue placeholder="Select salary type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">Full</SelectItem>
                                  <SelectItem value="partial">Partial</SelectItem>
                                  <SelectItem value="advance">Advance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="name">Name / Note *</Label>
                            <Input
                              id="name"
                              placeholder="Enter expense name or note"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
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
                            <Label htmlFor="amount">Amount *</Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={formData.amount}
                              onChange={(e) => handleInputChange('amount', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              placeholder="Additional notes or details..."
                              value={formData.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
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
                          <Label htmlFor="receipt">Add Receipt Image or File</Label>
                          <label
                            htmlFor="receipt"
                            className="flex w-full items-center justify-center rounded-2xl border px-4 py-2 cursor-pointer bg-transparent hover:bg-muted/10"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            <span className="text-sm text-muted-foreground">
                              {receipt ? receipt.name : 'Choose file'}
                            </span>
                          </label>
                          <input
                            id="receipt"
                            type="file"
                            onChange={handleFileUpload}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            className="sr-only"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Card className="h-fit flex flex-col">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Additional Details</CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="branch">Branch *</Label>
                            <Select
                              value={formData.branch}
                              onValueChange={(v) => handleInputChange('branch', v)}
                            >
                              <SelectTrigger id="branch">
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                              <SelectContent>
                                {branches.map((branch) => (
                                  <SelectItem key={branch} value={branch}>
                                    {branch}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method *</Label>
                            <Select
                              value={formData.paymentMethod}
                              onValueChange={(v) => handleInputChange('paymentMethod', v)}
                            >
                              <SelectTrigger id="paymentMethod">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="gcash">GCash</SelectItem>
                                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="rounded-2xl border bg-muted/50 p-4 space-y-3 mt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Expense Type</span>
                            <span className="font-medium capitalize">{formData.type ? formData.type.replace('-', ' ') : '—'}</span>
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
                            <span className="font-medium capitalize">{formData.paymentMethod ? formData.paymentMethod.replace('-', ' ') : '—'}</span>
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
              </div>

              <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t flex-shrink-0">
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
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}