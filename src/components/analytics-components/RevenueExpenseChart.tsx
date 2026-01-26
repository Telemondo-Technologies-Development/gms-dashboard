import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { AnalyticsData } from '@/lib/analytics-data'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

type Props = {
  data: AnalyticsData
  branch: string
  timeRange: 'monthly' | 'quarterly' | 'yearly'
}

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#4a5c92', 
  },
  expense: {
    label: 'Expenses',
    color: '#ea580c',
  },
}

export function RevenueExpenseChart({ data, timeRange }: Props) {
  const chartData = timeRange === 'monthly' 
    ? data.revenueExpense 
    : data.revenueExpense.filter((_, i) => i % 3 === 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value / 100)
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatCurrency}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#4a5c92"
          strokeWidth={2.5}
          dot={{ fill: '#4a5c92', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="hsl(var(--destructive))"
          strokeWidth={2.5}
          dot={{ fill: 'hsl(var(--destructive))', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )
}