import { useCallback } from 'react'
import { toast } from 'sonner'
import { toLegacyRow } from '@/lib/expense/expense-mappers'
import type { UseExpenseFormResult, UseExpenseEditResult } from '@/hooks/expense/useExpenseForm'
import type { ExpenseCreateForm, ExpenseUpdateForm, LegacyExpenseRow } from '@/lib/expense/expense-types'
import type { ExpenseFormData } from '@/types/expense/expenseSchemas'
import { ResponseError } from '@/api/generated/runtime'

interface BranchDTO { id?: string; name?: string }

interface UseExpenseHandlersOptions {
  actorId: string
  branchDTOs: BranchDTO[]
  selectedExpense: ExpenseFormData | null
  activeBranch: string
  addForm: UseExpenseFormResult
  editForm: UseExpenseEditResult
  createExpense: { mutateAsync: (f: ExpenseCreateForm) => Promise<unknown>; isPending: boolean }
  updateExpense: { mutateAsync: (f: ExpenseUpdateForm) => Promise<unknown> }
  deleteExpense: { mutateAsync: (args: { id: string; type: string }) => Promise<unknown> }
  setAddOpen:     (open: boolean) => void
  setDetailsOpen: (open: boolean) => void
  setDeleteOpen:  (open: boolean) => void
  setSelectedId:  (id: string | null) => void
  setIsEditing:   (editing: boolean) => void
}

export function useExpenseHandlers({
  actorId, branchDTOs, selectedExpense, activeBranch,
  addForm, editForm,
  createExpense, updateExpense, deleteExpense,
  setAddOpen, setDetailsOpen, setDeleteOpen, setSelectedId, setIsEditing,
}: UseExpenseHandlersOptions) {

  const buildCreateForm = useCallback((): ExpenseCreateForm | null => {
    const { type, amount, branch, salaryType, assetId, assetMaintenanceId,
            utilityTypeId, meter, suppliesLogId, otherExpenseTypeId } = addForm.formData
    const { date } = addForm

    if (!date)   { toast.error('Please select a date.');          return null }
    if (!type)   { toast.error('Please select an expense type.'); return null }
    if (!amount) { toast.error('Please enter an amount.');        return null }
    if (!branch) { toast.error('Please select a branch.');        return null }

    const branchDTO = branchDTOs.find((b) => b.name === branch)
    if (!branchDTO?.id) {
      toast.error('Branch data is still loading. Please try again.')
      return null
    }

    const branchId = branchDTO.id
    const paidAt   = date

    switch (type) {
      case 'asset': {
        if (!assetId) { toast.error('Please select an asset.'); return null }
        return { type, actorId, branchId, branch, amount, paidAt, assetId }
      }
      case 'asset-maintenance': {
        if (!assetMaintenanceId) { toast.error('Please select a maintenance record.'); return null }
        return { type, actorId, branchId, branch, amount, paidAt, assetMaintenanceId }
      }
      case 'salary': {
        const validTypes = ['FULL', 'PARTIAL', 'ADVANCED']
        const resolvedSalaryType = validTypes.includes((salaryType ?? '').toUpperCase())
          ? (salaryType!.toUpperCase() as 'FULL' | 'PARTIAL' | 'ADVANCED')
          : 'FULL'
        return { type, actorId, branchId, branch, amount, paidAt, salaryType: resolvedSalaryType, period: paidAt }
      }
      case 'utility': {
        if (!utilityTypeId) { toast.error('Please enter a utility type ID.'); return null }
        if (!meter)         { toast.error('Please enter a meter number.');     return null }
        return { type, actorId, branchId, branch, amount, paidAt, utilityTypeId, meter, period: paidAt }
      }
      case 'supplies': {
        if (!suppliesLogId) { toast.error('Please select a supplies log.'); return null }
        return { type, actorId, branchId, branch, amount, paidAt, suppliesLogId }
      }
      default: {
        if (!otherExpenseTypeId) { toast.error('Please enter an expense category ID.'); return null }
        return { type: 'other', actorId, branchId, branch, amount, paidAt, otherExpenseTypeId }
      }
    }
  }, [addForm, actorId, branchDTOs])

  const buildUpdateForm = useCallback((): ExpenseUpdateForm | null => {
    if (!selectedExpense || !editForm.date) return null

    const branchDTO = branchDTOs.find((b) => b.name === editForm.branch)
    const branchId  = branchDTO?.id ?? ''
    const base = {
      id:      selectedExpense.id,
      actorId: selectedExpense.actorId,
      branchId,
      branch:  editForm.branch,
      amount:  editForm.amount,
      paidAt:  editForm.date,
    }

    switch (selectedExpense.type) {
      case 'asset':
        return { ...base, type: 'asset', assetId: selectedExpense.assetId }
      case 'asset-maintenance':
        return { ...base, type: 'asset-maintenance', assetMaintenanceId: selectedExpense.assetMaintenanceId }
      case 'salary': {
        const validTypes = ['FULL', 'PARTIAL', 'ADVANCED']
        const resolvedSalaryType = validTypes.includes((editForm.salaryType ?? '').toUpperCase())
          ? (editForm.salaryType!.toUpperCase() as 'FULL' | 'PARTIAL' | 'ADVANCED')
          : selectedExpense.salaryType
        return { ...base, type: 'salary', salaryType: resolvedSalaryType, period: selectedExpense.period }
      }
      case 'utility':
        return { ...base, type: 'utility', utilityTypeId: selectedExpense.utilityTypeId, meter: selectedExpense.meter, period: selectedExpense.period }
      case 'supplies':
        return { ...base, type: 'supplies', suppliesLogId: selectedExpense.suppliesLogId }
      default:
        return { ...base, type: 'other', otherExpenseTypeId: (selectedExpense as { otherExpenseTypeId?: string }).otherExpenseTypeId ?? '' }
    }
  }, [selectedExpense, editForm, branchDTOs])

  const handleAddSubmit = useCallback(async () => {
    const form = buildCreateForm()
    if (!form) return
    try {
      await createExpense.mutateAsync(form)
      toast.success('Expense added successfully.')
      addForm.resetForm()
      if (activeBranch) addForm.setFormData((prev) => ({ ...prev, branch: activeBranch }))
      setAddOpen(false)
    } catch (err: unknown) {
      console.error('[createExpense] failed:', err)
      let msg = 'Failed to add expense. Please try again.'
      if (err instanceof ResponseError) {
        msg = err.message || msg
      } else if (err instanceof Error) {
        msg = err.message
      }
      toast.error(msg)
    }
  }, [buildCreateForm, createExpense, addForm, activeBranch, setAddOpen])

  const handleSaveExpense = useCallback(async () => {
    const form = buildUpdateForm()
    if (!form) return
    try {
      await updateExpense.mutateAsync(form)
      toast.success('Expense updated successfully.')
      setIsEditing(false)
      setDetailsOpen(false)
    } catch (err: unknown) {
      console.error('[updateExpense] failed:', err)
      let msg = 'Failed to update expense. Please try again.'
      if (err instanceof ResponseError) {
        msg = err.message || msg
      } else if (err instanceof Error) {
        msg = err.message
      }
      toast.error(msg)
    }
  }, [buildUpdateForm, updateExpense, setIsEditing, setDetailsOpen])

  const handleDeleteExpense = useCallback(async () => {
    if (!selectedExpense) return
    try {
      await deleteExpense.mutateAsync({ id: selectedExpense.id, type: selectedExpense.type })
      toast.success('Expense deleted.')
      setDeleteOpen(false)
      setDetailsOpen(false)
      setSelectedId(null)
    } catch (err: unknown) {
      console.error('[deleteExpense] failed:', err)
      let msg = 'Failed to delete expense. Please try again.'
      if (err instanceof ResponseError) {
        msg = err.message || msg
      } else if (err instanceof Error) {
        msg = err.message
      }
      toast.error(msg)
    }
  }, [selectedExpense, deleteExpense, setDeleteOpen, setDetailsOpen, setSelectedId])

  const handleRowClick = useCallback((row: LegacyExpenseRow) => {
    setSelectedId(row.id)
    setIsEditing(false)
    setDetailsOpen(true)
  }, [setSelectedId, setIsEditing, setDetailsOpen])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    if (selectedExpense) editForm.loadExpense(toLegacyRow(selectedExpense))
  }, [selectedExpense, editForm, setIsEditing])

  return {
    handleAddSubmit,
    handleSaveExpense,
    handleDeleteExpense,
    handleRowClick,
    handleCancelEdit,
  }
}