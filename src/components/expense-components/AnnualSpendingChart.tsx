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

interface AnnualSpendingChartProps {
  expenses: ExpenseFormData[]
  branch: string
}

export function AnnualSpendingChart({ expenses, branch }: AnnualSpendingChartProps) {
  const chartData = useMemo(() => {
    // Filter expenses by branch
    const branchExpenses = expenses.filter(e => e.branch === branch)
    
    // Group by year (last 5 years)
    const yearlyData: { [key: string]: number } = {}
    const currentYear = new Date().getFullYear()
    
    // Initialize last 5 years
    for (let i = 4; i >= 0; i--) {
      const year = (currentYear - i).toString()
      yearlyData[year] = 0
    }
    
    // Sum expenses by year
    branchExpenses.forEach(expense => {
      const expenseYear = new Date(expense.date).getFullYear().toString()
      if (expenseYear in yearlyData) {
        yearlyData[expenseYear] += Number.parseFloat(expense.amount)
      }
    })
    
    // Convert to array format for recharts
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
            name="Annual Spending"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
