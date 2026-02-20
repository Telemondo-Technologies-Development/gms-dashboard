import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ExpenseFormData } from '@/lib/expense-types'

interface MonthlySpendingChartProps {
  expenses: ExpenseFormData[]
  branch: string
}

const MONTHS_TO_DISPLAY = 12

const formatPeso = (value: number) =>
  `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function MonthlySpendingChart({ expenses, branch }: MonthlySpendingChartProps) {
  const chartData = useMemo(() => {
    const branchExpenses = expenses.filter(e => e.branch === branch)

    const monthlyData: Record<string, number> = {}
    const currentDate = new Date()

    for (let i = MONTHS_TO_DISPLAY - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
      monthlyData[monthKey] = 0
    }

    branchExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date)
      const monthKey = expenseDate.toLocaleString('en-US', { month: 'short', year: 'numeric' })
      if (monthKey in monthlyData) {
        monthlyData[monthKey] += parseFloat(expense.amount)
      }
    })

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount: Number(amount.toFixed(2)),
    }))
  }, [expenses, branch])

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="month"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            angle={-45}
            textAnchor="end"
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
            name="Monthly Spending"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}