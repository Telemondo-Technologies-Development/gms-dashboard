import { useMemo } from 'react'
import type { LegacyExpenseRow } from '@/lib/expense/expense-types'
import { SpendingChart } from '@/components/expense-components/ExpenseSpendingChart'

interface MonthlySpendingChartProps {
  expenses: LegacyExpenseRow[]
  branch: string
}

const MONTHS = 12

export function MonthlySpendingChart({ expenses, branch }: MonthlySpendingChartProps) {
  const data = useMemo(() => {
    const map: Record<string, number> = {}
    const now = new Date()

    for (let i = MONTHS - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      map[d.toLocaleString('en-US', { month: 'short', year: 'numeric' })] = 0
    }

    expenses
      .filter((e) => branch === 'all' || e.branch === branch)
      .forEach((e) => {
        const key = new Date(e.date).toLocaleString('en-US', { month: 'short', year: 'numeric' })
        if (key in map) map[key] += parseFloat(e.amount)
      })

    return Object.entries(map).map(([label, amount]) => ({
      label,
      amount: Number(amount.toFixed(2)),
    }))
  }, [expenses, branch])

  return <SpendingChart data={data} rotateLabels />
}