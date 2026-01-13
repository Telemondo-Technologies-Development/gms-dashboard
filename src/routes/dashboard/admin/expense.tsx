import { createFileRoute } from '@tanstack/react-router'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Search, Plus, Upload, DollarSign, CalendarIcon, Edit2, Trash2, FileText } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MonthlySpendingChart } from '@/components/expense-components/MonthlySpendingChart'
import { AnnualSpendingChart } from '@/components/expense-components/AnnualSpendingChart'

export const Route = createFileRoute('/dashboard/admin/expense')({
  component: ExpenseRoute,
})

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

// Sample data
const SAMPLE_EXPENSES: ExpenseFormData[] = [
  {
    id: '1',
    type: 'asset',
    name: 'Treadmill Purchase',
    date: new Date('2024-01-15'),
    amount: '45000',
    branch: 'Main Branch',
    paymentMethod: 'bank-transfer',
    category: 'capital',
    description: 'New cardio equipment',
    receipt: null,
  },
  {
    id: '2',
    type: 'utility',
    name: 'Electricity Bill - January',
    date: new Date('2024-01-10'),
    amount: '8500',
    branch: 'Main Branch',
    paymentMethod: 'bank-transfer',
    category: 'operational',
    description: 'Monthly electricity payment',
    receipt: null,
  },
  {
    id: '3',
    type: 'salary',
    name: 'Trainer Salary - January',
    date: new Date('2024-01-05'),
    amount: '25000',
    branch: 'Main Branch',
    paymentMethod: 'bank-transfer',
    category: 'operational',
    description: 'Monthly salary payment',
    receipt: null,
    salaryType: 'full',
  },
  {
    id: '4',
    type: 'asset-maintenance',
    name: 'Equipment Repair',
    date: new Date('2024-01-20'),
    amount: '3500',
    branch: 'Branch 2',
    paymentMethod: 'cash',
    category: 'operational',
    description: 'Repair of weight machines',
    receipt: null,
  },
  {
    id: '5',
    type: 'other',
    name: 'Cleaning Supplies',
    date: new Date('2024-01-12'),
    amount: '1200',
    branch: 'Main Branch',
    paymentMethod: 'cash',
    category: 'operational',
    description: 'Monthly cleaning supplies stock',
    receipt: null,
  },
  {
    id: '6',
    type: 'salary',
    name: 'Staff Advance Payment',
    date: new Date('2023-12-28'),
    amount: '5000',
    branch: 'Main Branch',
    paymentMethod: 'gcash',
    category: 'operational',
    description: 'Advance payment for staff',
    receipt: null,
    salaryType: 'advance',
  },
  {
    id: '7',
    type: 'utility',
    name: 'Water Bill - December',
    date: new Date('2023-12-15'),
    amount: '2800',
    branch: 'Main Branch',
    paymentMethod: 'bank-transfer',
    category: 'operational',
    description: 'Monthly water payment',
    receipt: null,
  },
]

const BRANCHES = ['Main Branch', 'Branch 2', 'Branch 3']

function ExpenseRoute() {
  const [expenses, setExpenses] = useState<ExpenseFormData[]>(SAMPLE_EXPENSES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch] = useState('Main Branch')
  
  // Add dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Add form state
  const [addFormData, setAddFormData] = useState({
    type: '',
    name: '',
    amount: '',
    branch: BRANCHES[0] || '',
    paymentMethod: '',
    category: 'operational',
    description: '',
    salaryType: '',
  })
  const [addDate, setAddDate] = useState<Date | undefined>(new Date())
  const [addReceipt, setAddReceipt] = useState<File | null>(null)

  // Edit form state
  const [editType, setEditType] = useState('')
  const [editName, setEditName] = useState('')
  const [editDate, setEditDate] = useState<Date | undefined>(undefined)
  const [editAmount, setEditAmount] = useState('')
  const [editBranch, setEditBranch] = useState('')
  const [editPaymentMethod, setEditPaymentMethod] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editReceipt, setEditReceipt] = useState<File | null>(null)
  const [editSalaryType, setEditSalaryType] = useState('')

  const selectedExpense = selectedExpenseId
    ? expenses.find(e => e.id === selectedExpenseId) ?? null
    : null

  // Reset add form
  const resetAddForm = () => {
    setAddFormData({
      type: '',
      name: '',
      amount: '',
      branch: BRANCHES[0] || '',
      paymentMethod: '',
      category: 'operational',
      description: '',
      salaryType: '',
    })
    setAddDate(new Date())
    setAddReceipt(null)
  }

  // Load expense data into edit form
  const loadEditForm = (expense: ExpenseFormData) => {
    setEditType(expense.type)
    setEditName(expense.name)
    setEditDate(expense.date)
    setEditAmount(expense.amount)
    setEditBranch(expense.branch)
    setEditPaymentMethod(expense.paymentMethod)
    setEditDescription(expense.description)
    setEditReceipt(expense.receipt)
    setEditSalaryType(expense.salaryType || '')
  }

  // Handle add expense
  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault()
    if (!addDate) return

    const newExpense: ExpenseFormData = {
      id: crypto.randomUUID(),
      type: addFormData.type,
      name: addFormData.name,
      date: addDate,
      amount: addFormData.amount,
      branch: addFormData.branch,
      paymentMethod: addFormData.paymentMethod,
      category: addFormData.category,
      description: addFormData.description,
      receipt: addReceipt,
      ...(addFormData.type === 'salary' && { salaryType: addFormData.salaryType }),
    }
    
    setExpenses(prev => [newExpense, ...prev])
    resetAddForm()
    setAddDialogOpen(false)
  }

  // Handle save edited expense
  const handleSaveExpense = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedExpense || !editDate) return

    const updated: ExpenseFormData = {
      ...selectedExpense,
      type: editType,
      name: editName,
      date: editDate,
      amount: editAmount,
      branch: editBranch,
      paymentMethod: editPaymentMethod,
      description: editDescription,
      receipt: editReceipt,
      ...(editType === 'salary' && { salaryType: editSalaryType }),
    }

    setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)))
    setIsEditing(false)
    setDetailsDialogOpen(false)
  }

  // Handle delete expense
  const handleDeleteExpense = () => {
    if (!selectedExpenseId) return
    setExpenses(prev => prev.filter(e => e.id !== selectedExpenseId))
    setDeleteDialogOpen(false)
    setDetailsDialogOpen(false)
    setSelectedExpenseId(null)
  }

  const filteredExpenses = expenses.filter(expense =>
    (expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    expense.branch === selectedBranch
  )

  const getReceiptBadge = (receipt: File | null) => {
    if (receipt) {
      return <Badge variant="default">Yes</Badge>
    }
    return <Badge variant="destructive">No</Badge>
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-4">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-semibold">Currently viewing expenses for: {selectedBranch}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Left Side - Charts */}
        <div className="flex flex-col gap-4 min-h-0">
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="text-base">Monthly Spending Trends</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <MonthlySpendingChart expenses={expenses} branch={selectedBranch} />
            </CardContent>
          </Card>

          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="text-base">Annual Spending Trends</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <AnnualSpendingChart expenses={expenses} branch={selectedBranch} />
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Table*/}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0">
              <CardTitle>Expense Records</CardTitle>
              <CardDescription>
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'} found
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filter by type or name / note..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add New Expense
                </Button>
              </div>

              {filteredExpenses.length === 0 ? (
                <div className="flex items-center justify-center flex-1">
                  <p className="text-muted-foreground">
                    {expenses.length === 0
                      ? 'No expenses recorded yet. Add your first expense to get started.'
                      : 'No expenses found matching your search.'}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border flex-1 min-h-0 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Name / Note</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-center">
                          <div>Receipt</div>
                          <div>Attached?</div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow
                          key={expense.id}
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedExpenseId(expense.id)
                            loadEditForm(expense)
                            setIsEditing(false)
                            setDetailsDialogOpen(true)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedExpenseId(expense.id)
                              loadEditForm(expense)
                              setIsEditing(false)
                              setDetailsDialogOpen(true)
                            }
                          }}
                        >
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {expense.type.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{expense.name}</div>
                            {expense.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {expense.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(expense.date, 'MMM dd, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ₱{Number.parseFloat(expense.amount).toLocaleString('en-PH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{getReceiptBadge(expense.receipt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <form onSubmit={handleAddExpense}>
          <DialogContent className="max-w-[95vw] md:max-w-[900px] xl:max-w-[1100px] max-h-[85vh] overflow-y-auto [&>button]:hidden">
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
                          value={addFormData.type}
                          onValueChange={(v) => {
                            setAddFormData(prev => ({ ...prev, type: v }))
                            if (v !== 'salary') {
                              setAddFormData(prev => ({ ...prev, salaryType: '' }))
                            }
                          }}
                        >
                          <SelectTrigger id="add-type">
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

                      {addFormData.type === 'salary' && (
                        <div className="space-y-2">
                          <Label htmlFor="add-salaryType">Salary Type *</Label>
                          <Select
                            value={addFormData.salaryType}
                            onValueChange={(v) => setAddFormData(prev => ({ ...prev, salaryType: v }))}
                          >
                            <SelectTrigger id="add-salaryType">
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
                        <Label htmlFor="add-name">Name / Note *</Label>
                        <Input
                          id="add-name"
                          placeholder="Enter expense name or note"
                          value={addFormData.name}
                          onChange={(e) => setAddFormData(prev => ({ ...prev, name: e.target.value }))}
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
                                !addDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {addDate ? format(addDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={addDate} onSelect={setAddDate} initialFocus />
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
                          value={addFormData.amount}
                          onChange={(e) => setAddFormData(prev => ({ ...prev, amount: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="add-description">Description</Label>
                        <Textarea
                          id="add-description"
                          placeholder="Additional notes or details..."
                          value={addFormData.description}
                          onChange={(e) => setAddFormData(prev => ({ ...prev, description: e.target.value }))}
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
                          {addReceipt ? addReceipt.name : 'Choose file'}
                        </span>
                      </label>
                      <input
                        id="add-receipt"
                        type="file"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setAddReceipt(e.target.files[0])
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
                        value={addFormData.branch}
                        onValueChange={(v) => setAddFormData(prev => ({ ...prev, branch: v }))}
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
                        value={addFormData.paymentMethod}
                        onValueChange={(v) => setAddFormData(prev => ({ ...prev, paymentMethod: v }))}
                      >
                        <SelectTrigger id="add-paymentMethod">
                          <SelectValue placeholder="Select method" />
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

                    <div className="rounded-2xl border bg-muted/50 p-4 space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Expense Type</span>
                        <span className="font-medium capitalize">
                          {addFormData.type ? addFormData.type.replace('-', ' ') : '—'}
                        </span>
                      </div>
                      {addFormData.type === 'salary' && addFormData.salaryType && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Salary Type</span>
                          <span className="font-medium capitalize">{addFormData.salaryType}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Branch</span>
                        <span className="font-medium">{addFormData.branch || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Payment Method</span>
                        <span className="font-medium capitalize">
                          {addFormData.paymentMethod ? addFormData.paymentMethod.replace('-', ' ') : '—'}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex items-center justify-between">
                        <span className="font-semibold">Amount</span>
                        <span className="text-2xl font-bold text-primary">
                          ₱{addFormData.amount ? Number.parseFloat(addFormData.amount).toLocaleString('en-PH', {
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetAddForm()
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* Details/Edit Dialog */}
      <Dialog 
        open={detailsDialogOpen && !deleteDialogOpen} 
        onOpenChange={(open) => {
          setDetailsDialogOpen(open)
          if (!open) {
            setSelectedExpenseId(null)
            setIsEditing(false)
          }
        }}
      >
        <form onSubmit={handleSaveExpense}>
          <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
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
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                    >
                      Close
                    </Button>
                  </DialogClose>
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
                        <Label htmlFor="edit-type">Expense Type</Label>
                        {isEditing ? (
                          <Select
                            value={editType}
                            onValueChange={(v) => {
                              setEditType(v)
                              if (v !== 'salary') {
                                setEditSalaryType('')
                              }
                            }}
                          >
                            <SelectTrigger id="edit-type">
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
                              {editType.replace('-', ' ')}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {editType === 'salary' && (
                        <div className="space-y-2">
                          <Label htmlFor="edit-salaryType">Salary Type</Label>
                          {isEditing ? (
                            <Select value={editSalaryType} onValueChange={setEditSalaryType}>
                              <SelectTrigger id="edit-salaryType">
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
                                {editSalaryType}
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
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                        />
                      ) : (
                        <div className="flex items-center h-9">
                          <span>{editName}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-date">Date</Label>
                        {isEditing ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !editDate && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editDate ? format(editDate, 'PPP') : 'Pick a date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={editDate} onSelect={setEditDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <div className="flex items-center h-9">
                            <span>{format(editDate || new Date(), 'PPP')}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-amount">Amount</Label>
                        {isEditing ? (
                          <Input
                            id="edit-amount"
                            type="number"
                            step="0.01"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            required
                          />
                        ) : (
                          <div className="flex items-center h-9">
                            <span className="font-semibold">
                              ₱{Number.parseFloat(editAmount).toLocaleString('en-PH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      {isEditing ? (
                        <Textarea
                          id="edit-description"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <div className="min-h-[60px] text-sm text-muted-foreground">
                          {editDescription || 'No description provided'}
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
                    {!isEditing && editReceipt && (
                      <div className="flex items-center justify-center bg-muted rounded-lg p-8">
                        <div className="text-center space-y-2">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm font-medium">{editReceipt.name}</p>
                        </div>
                      </div>
                    )}

                    {!isEditing && !editReceipt && (
                      <div className="flex items-center justify-center bg-muted rounded-lg p-8">
                        <p className="text-sm text-muted-foreground">No images or file attached</p>
                      </div>
                    )}

                    {isEditing && (
                      <div className="space-y-2">
                        <Label htmlFor="edit-receipt">
                          {editReceipt ? 'Update Receipt' : 'Add Receipt Image or File'}
                        </Label>
                        <div className="flex flex-col gap-2">
                          {editReceipt && (
                            <div className="flex items-center justify-center bg-muted rounded-lg p-4">
                              <div className="text-center space-y-1">
                                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                                <p className="text-xs font-medium">{editReceipt.name}</p>
                              </div>
                            </div>
                          )}
                          <label
                            htmlFor="edit-receipt"
                            className="flex flex-1 items-center justify-center rounded-2xl border px-4 py-2 cursor-pointer bg-transparent hover:bg-muted/10"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            <span className="text-sm text-muted-foreground">
                              {editReceipt ? 'Change file' : 'Choose file'}
                            </span>
                          </label>
                          <input
                            id="edit-receipt"
                            type="file"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setEditReceipt(e.target.files[0])
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

                <div className="space-y-4">
                  <div className="text-sm font-medium">Additional Details</div>

                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-branch">Branch</Label>
                      {isEditing ? (
                        <Select value={editBranch} onValueChange={setEditBranch}>
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
                          <span>{editBranch}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-paymentMethod">Payment Method</Label>
                      {isEditing ? (
                        <Select value={editPaymentMethod} onValueChange={setEditPaymentMethod}>
                          <SelectTrigger id="edit-paymentMethod">
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
                          <span className="capitalize">{editPaymentMethod.replace('-', ' ')}</span>
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
                    onClick={() => setDeleteDialogOpen(true)}
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
                        if (selectedExpense) {
                          loadEditForm(selectedExpense)
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
          </DialogContent>
        </form>
      </Dialog>

      {/* Delete Warning Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-destructive">WARNING!</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="destructive" onClick={handleDeleteExpense}>
              Yes
            </Button>
            <Button type="button" variant="default" onClick={() => setDeleteDialogOpen(false)}>
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}