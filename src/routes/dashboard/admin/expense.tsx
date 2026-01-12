import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { format } from 'date-fns'

import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddExpenseDialog, type ExpenseFormData } from '@/components/expense-components/AddExpenseDialog'
import { ExpenseDetailsDialog } from '@/components/expense-components/ExpenseDetailsDialog'
import { MonthlySpendingChart } from '@/components/expense-components/MonthlySpendingChart'
import { AnnualSpendingChart } from '@/components/expense-components/AnnualSpendingChart'

export const Route = createFileRoute('/dashboard/admin/expense')({
  component: ExpenseRoute,
})

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
  const [selectedBranch] = useState('Main Branch') // Removed setSelectedBranch since it's unused
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)

  const handleAddExpense = (expense: ExpenseFormData) => {
    setExpenses(prev => [expense, ...prev])
  }

  const handleSaveExpense = (updated: ExpenseFormData) => {
    setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)))
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
    setDetailsOpen(false)
    setSelectedExpenseId(null)
  }

  const filteredExpenses = expenses.filter(expense =>
    (expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    expense.branch === selectedBranch
  )

  const selectedExpense = selectedExpenseId
    ? expenses.find(e => e.id === selectedExpenseId) ?? null
    : null

  const getReceiptBadge = (receipt: File | null) => {
    if (receipt) {
      return <Badge variant="default">Yes</Badge>
    }
    return <Badge variant="destructive">No</Badge>
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-4">
      {/* Header Section - Fixed height */}
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
                <AddExpenseDialog onAddExpense={handleAddExpense} branches={BRANCHES} />
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
                            setDetailsOpen(true)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedExpenseId(expense.id)
                              setDetailsOpen(true)
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

      <ExpenseDetailsDialog
        open={detailsOpen}
        onOpenChange={(open: boolean) => {
          setDetailsOpen(open)
          if (!open) setSelectedExpenseId(null)
        }}
        expense={selectedExpense}
        branches={BRANCHES}
        onSave={handleSaveExpense}
        onDelete={handleDeleteExpense}
      />
    </div>
  )
}