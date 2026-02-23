import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ExpenseFormData } from '@/lib/expense-types'

interface AnnualSpendingChartProps {
  expenses: ExpenseFormData[]
  branch: string
}

const YEARS_TO_DISPLAY = 5

const formatPeso = (value: number) =>
  `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function AnnualSpendingChart({ expenses, branch }: AnnualSpendingChartProps) {
  const chartData = useMemo(() => {
    const branchExpenses = expenses.filter(e => e.branch === branch)

    const yearlyData: Record<string, number> = {}
    const currentYear = new Date().getFullYear()

    for (let i = YEARS_TO_DISPLAY - 1; i >= 0; i--) {
      const year = (currentYear - i).toString()
      yearlyData[year] = 0
    }

    branchExpenses.forEach(expense => {
      const expenseYear = new Date(expense.date).getFullYear().toString()
      if (expenseYear in yearlyData) {
        yearlyData[expenseYear] += parseFloat(expense.amount)
      }
    })

    return Object.entries(yearlyData).map(([year, amount]) => ({
      year,
      amount: Number(amount.toFixed(2)),
    }))
  }, [expenses, branch])

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="year"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              color: '#000000',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#000000', fontWeight: 'bold', marginBottom: '4px' }}
            itemStyle={{ color: '#005BB0' }}
            formatter={(value: number) => [formatPeso(value), 'Amount']}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar
            dataKey="amount"
            fill="#7c93d4"
            name="Annual Spending"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}