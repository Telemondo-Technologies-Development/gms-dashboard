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

const YEARS_TO_DISPLAY = 5

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '8px 12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ color: '#000000', fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
          {label}
        </p>
        <p style={{ color: '#005BB0', margin: 0, fontSize: '14px' }}>
          Amount: ₱{payload[0].value.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    )
  }
  return null
}

export function AnnualSpendingChart({ expenses, branch }: AnnualSpendingChartProps) {
  const chartData = useMemo(() => {
    // Filter expenses by branch
    const branchExpenses = expenses.filter(e => e.branch === branch)
    
    // Initialize last 5 years with zero values
    const yearlyData: Record<string, number> = {}
    const currentYear = new Date().getFullYear()
    
    for (let i = YEARS_TO_DISPLAY - 1; i >= 0; i--) {
      const year = (currentYear - i).toString()
      yearlyData[year] = 0
    }
    
    // Sum expenses by year
    branchExpenses.forEach(expense => {
      const expenseYear = new Date(expense.date).getFullYear().toString()
      if (expenseYear in yearlyData) {
        yearlyData[expenseYear] += parseFloat(expense.amount)
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
            content={<CustomTooltip />}
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