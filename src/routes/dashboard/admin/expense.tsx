import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, type FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MonthlySpendingChart } from '@/components/expense-components/ExpenseMonthly'
import { AnnualSpendingChart } from '@/components/expense-components/ExpenseAnnual'
import { ExpenseTable } from '@/components/expense-components/ExpenseList'
import { AddExpenseDialog } from '@/components/expense-components/ExpenseAdd'
import { ExpenseDetailsDialog } from '@/components/expense-components/ExpenseDetails'
import { DeleteConfirmDialog } from '@/components/expense-components/ExpenseDelete'
import { useExpenseForm, useExpenseEdit } from '@/hooks/useExpenseForm'
import { useBranches } from '@/hooks/branch/useBranches'
import { SAMPLE_EXPENSES } from '@/lib/expense-constants'
import type { ExpenseFormData } from '@/lib/expense-types'

export const Route = createFileRoute('/dashboard/admin/expense')({
  component: ExpenseRoute,
})

function ExpenseRoute() {
  const [expenses, setExpenses] = useState<ExpenseFormData[]>(SAMPLE_EXPENSES)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeBranch, setActiveBranch] = useState<string>('')

  // Fetch branches from API
  const { branches, isLoading: branchesLoading, error: branchesError } = useBranches()

  // Auto-select first branch once loaded
  useEffect(() => {
    if (!activeBranch && branches.length > 0) {
      setActiveBranch(branches[0]?.name ?? '')
    }
  }, [branches, activeBranch])

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Forms
  const addForm = useExpenseForm()
  const selectedExpense = selectedExpenseId
    ? expenses.find(e => e.id === selectedExpenseId) ?? null
    : null
  const editForm = useExpenseEdit(selectedExpense)

  // Filter expenses by search + active branch
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch =
      expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBranch = expense.branch === activeBranch
    return matchesSearch && matchesBranch
  })

  // Total spend for the active branch (unaffected by search)
  const totalSpend = expenses
    .filter(e => e.branch === activeBranch)
    .reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0)

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault()
    if (!addForm.date) return
    const newExpense: ExpenseFormData = {
      id: crypto.randomUUID(),
      type: addForm.formData.type,
      name: addForm.formData.name,
      date: addForm.date,
      amount: addForm.formData.amount,
      branch: addForm.formData.branch,
      paymentMethod: addForm.formData.paymentMethod,
      category: addForm.formData.category,
      description: addForm.formData.description,
      receipt: addForm.receipt,
      ...(addForm.formData.type === 'salary' && { salaryType: addForm.formData.salaryType }),
    }
    setExpenses(prev => [newExpense, ...prev])
    addForm.resetForm()
    setAddDialogOpen(false)
  }

  const handleSaveExpense = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedExpense || !editForm.date) return
    const updatedExpense: ExpenseFormData = {
      ...selectedExpense,
      type: editForm.type,
      name: editForm.name,
      date: editForm.date,
      amount: editForm.amount,
      branch: editForm.branch,
      paymentMethod: editForm.paymentMethod,
      description: editForm.description,
      receipt: editForm.receipt,
      ...(editForm.type === 'salary' && { salaryType: editForm.salaryType }),
    }
    setExpenses(prev => prev.map(e => (e.id === updatedExpense.id ? updatedExpense : e)))
    setIsEditing(false)
    setDetailsDialogOpen(false)
  }

  const handleDeleteExpense = () => {
    if (!selectedExpenseId) return
    setExpenses(prev => prev.filter(e => e.id !== selectedExpenseId))
    setDeleteDialogOpen(false)
    setDetailsDialogOpen(false)
    setSelectedExpenseId(null)
  }

  const handleRowClick = (expense: ExpenseFormData) => {
    setSelectedExpenseId(expense.id)
    editForm.loadExpense(expense)
    setIsEditing(false)
    setDetailsDialogOpen(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (selectedExpense) editForm.loadExpense(selectedExpense)
  }

  const branchNames = branches
    .map((b: { name?: string }) => b.name ?? '')
    .filter(Boolean)

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-semibold">Expense Management</h1>
          {branchesLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : branchesError ? (
            <p className="text-sm text-destructive">
              {branchesError?.message ?? 'Failed to load branches.'}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Total spend for {activeBranch}:{' '}
              <span className="font-medium text-foreground">
                ₱{totalSpend.toLocaleString('en-PH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
          )}
        </div>

        {/* Branch Switcher */}
        <Select
          value={activeBranch}
          onValueChange={setActiveBranch}
          disabled={branchesLoading || !!branchesError}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {branchNames.map((name: string) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Left Side - Charts */}
        <div className="flex flex-col gap-4 min-h-0">
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="text-base">Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <MonthlySpendingChart expenses={expenses} branch={activeBranch} />
            </CardContent>
          </Card>

          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="text-base">Annual Spending</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <AnnualSpendingChart expenses={expenses} branch={activeBranch} />
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Table */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <ExpenseTable
            expenses={filteredExpenses}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddClick={() => setAddDialogOpen(true)}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {/* Dialogs */}
      <AddExpenseDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        formData={addForm.formData}
        setFormData={addForm.setFormData}
        date={addForm.date}
        setDate={addForm.setDate}
        receipt={addForm.receipt}
        setReceipt={addForm.setReceipt}
        onSubmit={handleAddExpense}
        onCancel={addForm.resetForm}
        branches={branchNames}
      />

      <ExpenseDetailsDialog
        open={detailsDialogOpen && !deleteDialogOpen}
        onOpenChange={(open) => {
          setDetailsDialogOpen(open)
          if (!open) {
            setSelectedExpenseId(null)
            setIsEditing(false)
          }
        }}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        expense={selectedExpense}
        type={editForm.type}
        setType={editForm.setType}
        name={editForm.name}
        setName={editForm.setName}
        date={editForm.date}
        setDate={editForm.setDate}
        amount={editForm.amount}
        setAmount={editForm.setAmount}
        branch={editForm.branch}
        setBranch={editForm.setBranch}
        paymentMethod={editForm.paymentMethod}
        setPaymentMethod={editForm.setPaymentMethod}
        description={editForm.description}
        setDescription={editForm.setDescription}
        receipt={editForm.receipt}
        setReceipt={editForm.setReceipt}
        salaryType={editForm.salaryType}
        setSalaryType={editForm.setSalaryType}
        onSubmit={handleSaveExpense}
        onDelete={() => setDeleteDialogOpen(true)}
        onCancel={handleCancelEdit}
        branches={branchNames}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteExpense}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  )
}