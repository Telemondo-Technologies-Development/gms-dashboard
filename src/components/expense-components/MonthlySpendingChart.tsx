import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ExpenseFormData {
  id: string
  type: string
  name: string
  date: Date
  amount: string
  branch: string
  paymentMethod: string
  category: string
  description: string
  receipt: File | null
  salaryType?: string
}

interface MonthlySpendingChartProps {
  expenses: ExpenseFormData[]
  branch: string
}

const MONTHS_TO_DISPLAY = 12

export function MonthlySpendingChart({ expenses, branch }: MonthlySpendingChartProps) {
  const chartData = useMemo(() => {
    // Filter expenses by branch
    const branchExpenses = expenses.filter(e => e.branch === branch)
    
    // Initialize last 12 months with zero values
    const monthlyData: Record<string, number> = {}
    const currentDate = new Date()
    
    for (let i = MONTHS_TO_DISPLAY - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
      monthlyData[monthKey] = 0
    }
    
    // Sum expenses by month
    branchExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date)
      const monthKey = expenseDate.toLocaleString('en-US', { month: 'short', year: 'numeric' })
      if (monthKey in monthlyData) {
        monthlyData[monthKey] += parseFloat(expense.amount)
      }
    })
    
    // Convert to array format for recharts
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
            formatter={(value: number) => [
              `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              'Amount'
            ]}
            labelStyle={{ color: '#000000', fontWeight: 'bold', marginBottom: '4px' }}
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