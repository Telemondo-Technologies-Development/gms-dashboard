
import { useMemo } from 'react'
import type { LegacyExpenseRow } from '@/lib/expense/expense-types'
import { SpendingChart } from '@/components/expense-components/ExpenseSpendingChart'

interface AnnualSpendingChartProps {
  expenses: LegacyExpenseRow[]
  branch: string
}

const YEARS = 5

export function AnnualSpendingChart({ expenses, branch }: AnnualSpendingChartProps) {
  const data = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const map: Record<string, number> = {}

    for (let i = YEARS - 1; i >= 0; i--) {
      map[String(currentYear - i)] = 0
    }

    expenses
      .filter((e) => e.branch === branch)
      .forEach((e) => {
        const year = String(new Date(e.date).getFullYear())
        if (year in map) map[year] += parseFloat(e.amount)
      })

    return Object.entries(map).map(([label, amount]) => ({
      label,
      amount: Number(amount.toFixed(2)),
    }))
  }, [expenses, branch])

  return <SpendingChart data={data} />
}