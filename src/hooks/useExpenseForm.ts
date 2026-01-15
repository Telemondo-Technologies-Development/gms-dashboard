import { useState, useEffect } from 'react'
import type { ExpenseFormData } from '@/lib/expense-types'
import { BRANCHES } from '@/lib/expense-constants'

export function useExpenseForm() {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    amount: '',
    branch: BRANCHES[0] || '',
    paymentMethod: '',
    category: 'operational',
    description: '',
    salaryType: '',
  })
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [receipt, setReceipt] = useState<File | null>(null)

  const resetForm = () => {
    setFormData({
      type: '',
      name: '',
      amount: '',
      branch: BRANCHES[0] || '',
      paymentMethod: '',
      category: 'operational',
      description: '',
      salaryType: '',
    })
    setDate(new Date())
    setReceipt(null)
  }

  return {
    formData,
    setFormData,
    date,
    setDate,
    receipt,
    setReceipt,
    resetForm,
  }
}

export function useExpenseEdit(expense: ExpenseFormData | null) {
  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [amount, setAmount] = useState('')
  const [branch, setBranch] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [description, setDescription] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [salaryType, setSalaryType] = useState('')

  // Auto-load expense when it changes
  useEffect(() => {
    if (expense) {
      setType(expense.type)
      setName(expense.name)
      setDate(expense.date)
      setAmount(expense.amount)
      setBranch(expense.branch)
      setPaymentMethod(expense.paymentMethod)
      setDescription(expense.description)
      setReceipt(expense.receipt)
      setSalaryType(expense.salaryType || '')
    }
  }, [expense])

  const loadExpense = (expense: ExpenseFormData) => {
    setType(expense.type)
    setName(expense.name)
    setDate(expense.date)
    setAmount(expense.amount)
    setBranch(expense.branch)
    setPaymentMethod(expense.paymentMethod)
    setDescription(expense.description)
    setReceipt(expense.receipt)
    setSalaryType(expense.salaryType || '')
  }

  return {
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
    loadExpense,
  }
}