import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { AlertCircle } from 'lucide-react'
import type { AnalyticsData } from '@/lib/analytics-data'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  revenue: { label: 'Revenue', color: '#7c93d4' },
  expense: { label: 'Expenses', color: '#ef4444' },
}

export function RevenueExpenseChart({ data, timeRange }: Props) {
  if (!data.revenueExpense?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">No revenue data available</div>
    )
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value / 100)

  const chartData =
    timeRange === 'monthly'
      ? data.revenueExpense
      : data.revenueExpense.filter((_, i) => i % 3 === 0)

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)
  const totalExpense = chartData.reduce((sum, item) => sum + item.expense, 0)
  const totalProfit = totalRevenue - totalExpense
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0'

  const latestData = chartData[chartData.length - 1]
  const highExpenseRatio =
    latestData && latestData.revenue > 0 && latestData.expense / latestData.revenue > 0.8

  return (
    <div className="space-y-4">
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Profit</p>
          <p className="text-lg font-bold text-green-600">{formatCurrency(totalProfit)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Profit Margin</p>
          <p className="text-lg font-bold">{profitMargin}%</p>
        </div>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
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
            stroke="#7c93d4"
            strokeWidth={2.5}
            dot={{ fill: '#7c93d4', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>

      {/* High-expense alert */}
      {highExpenseRatio && (
        <Alert className="border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-200">
          <AlertCircle className="h-4 w-4 !text-orange-600 dark:!text-orange-400" />
          <AlertDescription className="text-xs">
            <span className="font-semibold">High expense ratio detected.</span> Current expenses are{' '}
            {((latestData.expense / latestData.revenue) * 100).toFixed(1)}% of revenue. Consider
            reviewing cost optimization strategies.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}