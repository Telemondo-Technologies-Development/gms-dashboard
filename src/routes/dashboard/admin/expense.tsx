import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
  // 'all' means all branches; otherwise a specific branch name
  const [activeBranch, setActiveBranch] = useState('all')
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

  // Default to first branch on initial load only — don't override if user picks 'All Branches'
  const [branchInitialized, setBranchInitialized] = useState(false)
  useEffect(() => {
    if (!branchInitialized && branchNames.length > 0) {
      setActiveBranch(branchNames[0])
      setBranchInitialized(true)
    }
  }, [branchNames, branchInitialized])

  const addForm = useExpenseForm(activeBranch === 'all' ? (branchNames[0] ?? '') : activeBranch)

  const selectedExpense = useMemo(
    () => selectedId ? (expenses ?? []).find((e) => e.id === selectedId) ?? null : null,
    [selectedId, expenses],
  )
  const selectedLegacyRow = useMemo(
    () => selectedExpense ? toLegacyRow(selectedExpense) : null,
    [selectedExpense],
  )
  const editForm = useExpenseEdit(selectedLegacyRow)

  const legacyRows = useMemo(() => (expenses ?? []).map(toLegacyRow), [expenses])

  // Charts show the selected branch, or all rows combined when 'all'
  const chartRows = useMemo(
    () => activeBranch === 'all'
      ? legacyRows
      : legacyRows.filter((r) => r.branch === activeBranch),
    [legacyRows, activeBranch],
  )


  const totalSpend = useMemo(
    () => chartRows.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0),
    [chartRows],
  )

  const displayBranchLabel = activeBranch === 'all' ? 'All Branches' : activeBranch

  const {
    handleAddSubmit, handleSaveExpense, handleDeleteExpense,
    handleRowClick, handleCancelEdit,
  } = useExpenseHandlers({
    actorId, branchDTOs, selectedExpense,
    activeBranch: activeBranch === 'all' ? (branchNames[0] ?? '') : activeBranch,
    addForm, editForm,
    createExpense, updateExpense, deleteExpense,
    setAddOpen, setDetailsOpen, setDeleteOpen, setSelectedId, setIsEditing,
  })

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-4">

      {/* Header — no branch selector here anymore, it lives in the table */}
      <div className="flex-shrink-0 space-y-0.5">
        <h1 className="text-2xl font-semibold">Expense Management</h1>
        {branchesLoading || expensesLoading ? (
          <Skeleton className="h-4 w-48" />
        ) : branchesError ? (
          <p className="text-sm text-destructive">{(branchesError as Error)?.message ?? 'Failed to load branches.'}</p>
        ) : expensesError ? (
          <p className="text-sm text-destructive">Failed to load expenses.</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Total spend for {displayBranchLabel}:{' '}
            <span className="font-medium text-foreground">{formatPeso(totalSpend)}</span>
          </p>
        )}
      </div>

      {/* Charts + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        <div className="flex flex-col gap-4 min-h-0">
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 pb-3"><CardTitle className="text-base">Monthly Spending</CardTitle></CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <MonthlySpendingChart expenses={chartRows} branch={activeBranch} />
            </CardContent>
          </Card>
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 pb-3"><CardTitle className="text-base">Annual Spending</CardTitle></CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <AnnualSpendingChart expenses={chartRows} branch={activeBranch} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <ExpenseTable
            expenses={legacyRows}
            branches={branchNames}
            selectedBranch={activeBranch}
            onBranchChange={setActiveBranch}
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
        formData={editForm.formData} setFormData={editForm.setFormData}
        date={editForm.date}         setDate={editForm.setDate}
        receipt={editForm.receipt}   setReceipt={editForm.setReceipt}
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