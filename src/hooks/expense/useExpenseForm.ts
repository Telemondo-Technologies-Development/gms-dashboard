import { useState, useEffect, useCallback } from 'react'
import type { LegacyExpenseRow } from '@/lib/expense/expense-types'
import {
  type AddExpenseFormData,
  DEFAULT_ADD_FORM,
} from '@/lib/expense/expense-types'
import { BRANCHES } from '@/lib/expense/expense-constants'

export type { AddExpenseFormData }

// ── useExpenseForm (Add dialog) ───────────────────────────────────────────────

export interface UseExpenseFormResult {
  formData: AddExpenseFormData
  setFormData: React.Dispatch<React.SetStateAction<AddExpenseFormData>>
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  receipt: File | null
  setReceipt: (file: File | null) => void
  resetForm: () => void
}

export function useExpenseForm(activeBranch = ''): UseExpenseFormResult {
  const initialBranch = activeBranch || BRANCHES[0] || ''
  const [formData, setFormData] = useState<AddExpenseFormData>({
    ...DEFAULT_ADD_FORM,
    branch: initialBranch,
  })
  const [date,    setDate]    = useState<Date | undefined>(new Date())
  const [receipt, setReceipt] = useState<File | null>(null)

  // Keep branch in sync when activeBranch changes (e.g. branch selector)
  // Only update if the branch actually changed to avoid re-render loops
  useEffect(() => {
    if (activeBranch) {
      setFormData((prev) =>
        prev.branch === activeBranch ? prev : { ...prev, branch: activeBranch },
      )
    }
  }, [activeBranch])

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_ADD_FORM, branch: activeBranch || BRANCHES[0] || '' })
    setDate(new Date())
    setReceipt(null)
  }, [activeBranch])

  return { formData, setFormData, date, setDate, receipt, setReceipt, resetForm }
}

// ── useExpenseEdit (Details/Edit dialog) ──────────────────────────────────────
// Same shape as useExpenseForm so both dialogs accept identical props.

export interface UseExpenseEditResult {
  formData: AddExpenseFormData
  setFormData: React.Dispatch<React.SetStateAction<AddExpenseFormData>>
  date: Date | undefined
  setDate: (v: Date | undefined) => void
  receipt: File | null
  setReceipt: (v: File | null) => void
  loadExpense: (row: LegacyExpenseRow) => void
}

export function useExpenseEdit(expense: LegacyExpenseRow | null): UseExpenseEditResult {
  const [formData, setFormData] = useState<AddExpenseFormData>({
    ...DEFAULT_ADD_FORM,
    branch: BRANCHES[0] ?? '',
  })
  const [date,    setDate]    = useState<Date | undefined>(undefined)
  const [receipt, setReceipt] = useState<File | null>(null)

  const loadExpense = useCallback((row: LegacyExpenseRow) => {
    setFormData((prev) => ({
      ...prev,
      type:          row.type,
      branch:        row.branch,
      amount:        row.amount,
      paymentMethod: row.paymentMethod ?? '',
      salaryType:    row.salaryType    ?? '',
      remarks:       row.description   ?? '',
      // clear type-specific fields so stale values don't carry over
      assetId:            undefined,
      assetMaintenanceId: undefined,
      utilityTypeId:      undefined,
      meter:              undefined,
      suppliesLogId:      undefined,
      otherExpenseTypeId: undefined,
    }))
    setDate(row.date)
    setReceipt(row.receipt)
  }, [])

  // Use expense.id as the dep — toLegacyRow creates a new object every render
  // so depending on `expense` directly would fire the effect on every render
  const expenseId = expense?.id ?? null
  useEffect(() => {
    if (expense) loadExpense(expense)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseId, loadExpense])

  return { formData, setFormData, date, setDate, receipt, setReceipt, loadExpense }
}