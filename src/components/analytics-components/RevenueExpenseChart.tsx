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
    color: 'hsl(var(--primary))',
  },
  expense: {
    label: 'Expenses',
    color: 'hsl(var(--destructive))',
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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatCurrency}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="var(--color-expense)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}