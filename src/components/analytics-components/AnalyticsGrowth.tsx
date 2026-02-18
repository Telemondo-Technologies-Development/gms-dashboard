import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ArrowDown, ArrowUp, Users, AlertCircle } from 'lucide-react'
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
  total: { label: 'Total Members', color: '#7c93d4' },
  new: { label: 'New Members', color: '#10b981' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
}

type MetricCardProps = {
  icon?: React.ReactNode
  label: string
  value: number | string
  subtitle: string | React.ReactNode
  className?: string
}

function MetricCard({ icon, label, value, subtitle, className }: MetricCardProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className={`text-xl font-bold ${className ?? ''}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </div>
  )
}

export function MembershipGrowthChart({ data, timeRange }: Props) {
  if (!data.membershipGrowth?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">No membership data available</div>
    )
  }

  const chartData =
    timeRange === 'monthly'
      ? data.membershipGrowth
      : data.membershipGrowth.filter((_, i) => i % 3 === 0)

  const latestMonth = chartData[chartData.length - 1]
  const previousMonth = chartData[chartData.length - 2]

  if (!latestMonth || !previousMonth) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Insufficient data to display trends
      </div>
    )
  }

  const netGrowth = latestMonth.total - previousMonth.total
  const growthPct = previousMonth.total > 0
    ? parseFloat(((netGrowth / previousMonth.total) * 100).toFixed(1))
    : 0
  const retentionRate =
    previousMonth.total > 0
      ? (((latestMonth.total - latestMonth.new) / previousMonth.total) * 100).toFixed(1)
      : '0.0'
  const isPositiveGrowth = growthPct >= 0

  const highCancellationRate = latestMonth.new > 0 && latestMonth.cancelled > latestMonth.new * 0.3

  return (
    <div className="space-y-4">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          icon={<Users className="h-3.5 w-3.5" />}
          label="Total Members"
          value={latestMonth.total.toLocaleString()}
          subtitle={
            <span
              className={`flex items-center gap-1 ${
                isPositiveGrowth ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositiveGrowth ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              <span className="sr-only">{isPositiveGrowth ? 'Increased' : 'Decreased'} by</span>
              {Math.abs(growthPct)}% from last month
            </span>
          }
        />
        <MetricCard
          label="New Members"
          value={latestMonth.new.toLocaleString()}
          subtitle="This month"
          className="text-green-600"
        />
        <MetricCard
          label="Cancelled"
          value={latestMonth.cancelled.toLocaleString()}
          subtitle={`Retention: ${retentionRate}%`}
          className="text-red-600"
        />
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={chartData}>
          <defs>
            {(['total', 'new', 'cancelled'] as const).map((key) => (
              <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig[key].color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartConfig[key].color} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
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
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {(['total', 'new', 'cancelled'] as const).map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={chartConfig[key].color}
              fill={`url(#gradient-${key})`}
              strokeWidth={2.5}
            />
          ))}
        </AreaChart>
      </ChartContainer>

      {/* High-cancellation alert */}
      {highCancellationRate && (
        <Alert className="border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-200">
          <AlertCircle className="h-4 w-4 !text-orange-600 dark:!text-orange-400" />
          <AlertDescription className="text-xs">
            <span className="font-semibold">High cancellation rate detected.</span> Consider
            reviewing member satisfaction and retention strategies.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}