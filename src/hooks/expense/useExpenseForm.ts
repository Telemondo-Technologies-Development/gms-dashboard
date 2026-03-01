import { useState, useEffect, useCallback } from 'react'
import type { LegacyExpenseRow } from '@/lib/expense/expense-types'
import {
  type AddExpenseFormData,
  DEFAULT_ADD_FORM,
} from '@/lib/expense/expense-types'
import { BRANCHES } from '@/lib/expense/expense-constants'

export type { AddExpenseFormData }

// Explicit return-type interfaces

export interface UseExpenseFormResult {
  formData: AddExpenseFormData
  setFormData: React.Dispatch<React.SetStateAction<AddExpenseFormData>>
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  receipt: File | null
  setReceipt: (file: File | null) => void
  resetForm: () => void
}

export interface UseExpenseEditResult {
  // Individual fields
  type: string;          setType: (v: string) => void
  name: string;          setName: (v: string) => void
  amount: string;        setAmount: (v: string) => void
  branch: string;        setBranch: (v: string) => void
  paymentMethod: string; setPaymentMethod: (v: string) => void
  description: string;   setDescription: (v: string) => void
  salaryType: string;    setSalaryType: (v: string) => void
  date: Date | undefined; setDate: (v: Date | undefined) => void
  receipt: File | null;   setReceipt: (v: File | null) => void
  loadExpense: (row: LegacyExpenseRow) => void
}

// useExpenseForm - state for the Add Expense dialog
export function useExpenseForm(): UseExpenseFormResult {
  const [formData, setFormData] = useState<AddExpenseFormData>({
    ...DEFAULT_ADD_FORM,
    branch: BRANCHES[0] ?? '',
  })
  const [date, setDate]       = useState<Date | undefined>(new Date())
  const [receipt, setReceipt] = useState<File | null>(null)

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_ADD_FORM, branch: BRANCHES[0] ?? '' })
    setDate(new Date())
    setReceipt(null)
  }, [])

  return { formData, setFormData, date, setDate, receipt, setReceipt, resetForm }
}


export function useExpenseEdit(expense: LegacyExpenseRow | null): UseExpenseEditResult {
  const [type,          setType]          = useState('')
  const [name,          setName]          = useState('')
  const [amount,        setAmount]        = useState('')
  const [branch,        setBranch]        = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [description,   setDescription]  = useState('')
  const [salaryType,    setSalaryType]    = useState('')
  const [date,          setDate]          = useState<Date | undefined>(undefined)
  const [receipt,       setReceipt]       = useState<File | null>(null)

  const loadExpense = useCallback((row: LegacyExpenseRow) => {
    setType(row.type)
    setName(row.name)
    setAmount(row.amount)
    setBranch(row.branch)
    setPaymentMethod(row.paymentMethod)
    setDescription(row.description)
    setSalaryType(row.salaryType ?? '')
    setDate(row.date)
    setReceipt(row.receipt)
  }, [])


  useEffect(() => {
    if (expense) loadExpense(expense)
  }, [expense, loadExpense])

  return {
    type, setType,
    name, setName,
    amount, setAmount,
    branch, setBranch,
    paymentMethod, setPaymentMethod,
    description, setDescription,
    salaryType, setSalaryType,
    date, setDate,
    receipt, setReceipt,
    loadExpense,
  }
}