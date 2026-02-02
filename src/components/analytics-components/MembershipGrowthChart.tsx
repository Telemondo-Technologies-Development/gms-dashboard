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
  total: {
    label: 'Total Members',
    color: '#4a5c92',
  },
  new: {
    label: 'New Members',
    color: '#10b981',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#ea580c',
  },
}

type MetricCardProps = {
  icon: React.ReactNode
  label: string
  value: number | string
  subtitle: string | React.ReactNode
  className?: string
}

function MetricCard({ icon, label, value, subtitle, className }: MetricCardProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <div className={`text-xl font-bold ${className || ''}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </div>
  )
}

export function MembershipGrowthChart({ data, timeRange }: Props) {
  // Validate data
  if (!data.membershipGrowth?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No membership data available
      </div>
    )
  }

  const chartData = timeRange === 'monthly' 
    ? data.membershipGrowth 
    : data.membershipGrowth.filter((_, i) => i % 3 === 0)

  const latestMonth = chartData[chartData.length - 1]
  const previousMonth = chartData[chartData.length - 2]
  
  if (!latestMonth || !previousMonth) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Insufficient data to display trends
      </div>
    )
  }

  const netGrowth = latestMonth.total - previousMonth.total
  const growthPercentage = ((netGrowth / previousMonth.total) * 100).toFixed(1)
  const retentionRate = (((latestMonth.total - latestMonth.new) / previousMonth.total) * 100).toFixed(1)
  const isPositiveGrowth = parseFloat(growthPercentage) >= 0

  return (
    <div className="space-y-4">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          icon={<Users className="h-3.5 w-3.5" />}
          label="Total Members"
          value={latestMonth.total.toLocaleString()}
          subtitle={
            <span className={`flex items-center gap-1 ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveGrowth ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span className="sr-only">{isPositiveGrowth ? 'Increased' : 'Decreased'} by</span>
              {Math.abs(parseFloat(growthPercentage))}% from last month
            </span>
          }
        />
        <MetricCard
          icon={null}
          label="New Members"
          value={latestMonth.new.toLocaleString()}
          subtitle="This month"
          className="text-green-600"
        />
        <MetricCard
          icon={null}
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
            <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4a5c92" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4a5c92" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="gradientNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="gradientCancelled" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
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
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#4a5c92"
            fill="url(#gradientTotal)"
            strokeWidth={2.5}
          />
          <Area
            type="monotone"
            dataKey="new"
            stroke="#10b981"
            fill="url(#gradientNew)"
            strokeWidth={2.5}
          />
          <Area
            type="monotone"
            dataKey="cancelled"
            stroke="hsl(var(--destructive))"
            fill="url(#gradientCancelled)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ChartContainer>

      {/* Alert for high cancellation rate */}
      {latestMonth.cancelled > latestMonth.new * 0.3 && (
        <Alert className="border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-200">
          <AlertCircle className="h-4 w-4 !text-orange-600 dark:!text-orange-400" />
          <AlertDescription className="text-xs">
            <span className="font-semibold">High cancellation rate detected.</span> Consider reviewing member satisfaction and retention strategies.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}