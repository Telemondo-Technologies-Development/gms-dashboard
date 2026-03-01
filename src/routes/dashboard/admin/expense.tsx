import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MonthlySpendingChart } from '@/components/expense-components/ExpenseMonthlyCard'
import { AnnualSpendingChart }  from '@/components/expense-components/ExpenseAnnualCard'
import { ExpenseTable }         from '@/components/expense-components/ExpenseListTable'
import { AddExpenseDialog }     from '@/components/expense-components/ExpenseAddDialog'
import { ExpenseDetailsDialog } from '@/components/expense-components/ExpenseDetailsDialog'
import { DeleteConfirmDialog }  from '@/components/expense-components/ExpenseDeleteDialog'
import { useExpenseForm, useExpenseEdit } from '@/hooks/expense/useExpenseForm'
import { useExpenseHandlers }   from '@/hooks/expense/useExpenseHandlers'
import { useBranches }          from '@/hooks/branch/useBranches'
import { useAllExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from '@/hooks/expense/useExpenses'
import { useAuthStore }         from '@/lib/auth/auth-session'
import { toLegacyRow }          from '@/lib/expense/expense-mappers'
import { formatPeso }           from '@/lib/expense/expense-utils'

export const Route = createFileRoute('/dashboard/admin/expense')({ component: ExpenseRoute })

interface BranchDTO { id?: string; name?: string }

function ExpenseRoute() {
  const [searchQuery,  setSearchQuery]  = useState('')
  const [activeBranch, setActiveBranch] = useState('')
  const [addOpen,      setAddOpen]      = useState(false)
  const [detailsOpen,  setDetailsOpen]  = useState(false)
  const [deleteOpen,   setDeleteOpen]   = useState(false)
  const [selectedId,   setSelectedId]   = useState<string | null>(null)
  const [isEditing,    setIsEditing]    = useState(false)

  const actorId = useAuthStore((s) => s.actorId) ?? ''

  const { branches, isLoading: branchesLoading, error: branchesError } = useBranches()
  const { expenses, isLoading: expensesLoading, isError: expensesError } = useAllExpenses()
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const deleteExpense = useDeleteExpense()

  const branchDTOs  = useMemo(() => (branches ?? []) as BranchDTO[], [branches])
  const branchNames = useMemo(() => branchDTOs.map((b) => b.name ?? '').filter(Boolean), [branchDTOs])

  useEffect(() => {
    if (!activeBranch && branchNames.length > 0) setActiveBranch(branchNames[0])
  }, [branchNames, activeBranch])

  const addForm = useExpenseForm()
  useEffect(() => {
    if (activeBranch) addForm.setFormData((prev) => ({ ...prev, branch: activeBranch }))
  }, [activeBranch]) 

  const selectedExpense = useMemo(
    () => selectedId ? (expenses ?? []).find((e) => e.id === selectedId) ?? null : null,
    [selectedId, expenses],
  )
  const editForm = useExpenseEdit(selectedExpense ? toLegacyRow(selectedExpense) : null)

  const legacyRows = useMemo(() => (expenses ?? []).map(toLegacyRow), [expenses])

  const filteredRows = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return legacyRows.filter(
      (row) => row.branch === activeBranch &&
        (row.name.toLowerCase().includes(q) ||
         row.type.toLowerCase().includes(q) ||
         row.description.toLowerCase().includes(q)),
    )
  }, [legacyRows, activeBranch, searchQuery])

  const totalSpend = useMemo(
    () => (expenses ?? [])
      .filter((e) => e.branch === activeBranch)
      .reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0),
    [expenses, activeBranch],
  )

  const {
    handleAddSubmit, handleSaveExpense, handleDeleteExpense,
    handleRowClick, handleCancelEdit,
  } = useExpenseHandlers({
    actorId, branchDTOs, selectedExpense, activeBranch,
    addForm, editForm,
    createExpense, updateExpense, deleteExpense,
    setAddOpen, setDetailsOpen, setDeleteOpen, setSelectedId, setIsEditing,
  })

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-semibold">Expense Management</h1>
          {branchesLoading || expensesLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : branchesError ? (
            <p className="text-sm text-destructive">{(branchesError as Error)?.message ?? 'Failed to load branches.'}</p>
          ) : expensesError ? (
            <p className="text-sm text-destructive">Failed to load expenses.</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Total spend for {activeBranch}:{' '}
              <span className="font-medium text-foreground">{formatPeso(totalSpend)}</span>
            </p>
          )}
        </div>
        <Select value={activeBranch} onValueChange={setActiveBranch} disabled={branchesLoading || !!branchesError}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Select branch" /></SelectTrigger>
          <SelectContent>
            {branchNames.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Charts + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        <div className="flex flex-col gap-4 min-h-0">
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 pb-3"><CardTitle className="text-base">Monthly Spending</CardTitle></CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <MonthlySpendingChart expenses={filteredRows} branch={activeBranch} />
            </CardContent>
          </Card>
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 pb-3"><CardTitle className="text-base">Annual Spending</CardTitle></CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <AnnualSpendingChart expenses={filteredRows} branch={activeBranch} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <ExpenseTable
            expenses={filteredRows}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddClick={() => setAddOpen(true)}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {/* Dialogs */}
      <AddExpenseDialog
        open={addOpen} onOpenChange={setAddOpen}
        formData={addForm.formData} setFormData={addForm.setFormData}
        date={addForm.date} setDate={addForm.setDate}
        receipt={addForm.receipt} setReceipt={addForm.setReceipt}
        onSubmit={handleAddSubmit} onCancel={addForm.resetForm}
        branches={branchNames} isPending={createExpense.isPending}
      />

      <ExpenseDetailsDialog
        open={detailsOpen && !deleteOpen}
        onOpenChange={(open) => { setDetailsOpen(open); if (!open) { setSelectedId(null); setIsEditing(false) } }}
        isEditing={isEditing} setIsEditing={setIsEditing}
        type={editForm.type}             setType={editForm.setType}
        name={editForm.name}             setName={editForm.setName}
        date={editForm.date}             setDate={editForm.setDate}
        amount={editForm.amount}         setAmount={editForm.setAmount}
        branch={editForm.branch}         setBranch={editForm.setBranch}
        paymentMethod={editForm.paymentMethod} setPaymentMethod={editForm.setPaymentMethod}
        description={editForm.description}     setDescription={editForm.setDescription}
        receipt={editForm.receipt}       setReceipt={editForm.setReceipt}
        salaryType={editForm.salaryType} setSalaryType={editForm.setSalaryType}
        onSubmit={handleSaveExpense} onDelete={() => setDeleteOpen(true)} onCancel={handleCancelEdit}
        branches={branchNames}
      />

      <DeleteConfirmDialog
        open={deleteOpen} onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteExpense} onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}