import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ArrowDown, ArrowUp, Users } from 'lucide-react'
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

export function MembershipGrowthChart({ data, timeRange }: Props) {
  const chartData = timeRange === 'monthly' 
    ? data.membershipGrowth 
    : data.membershipGrowth.filter((_, i) => i % 3 === 0)

  const latestMonth = chartData[chartData.length - 1]
  const previousMonth = chartData[chartData.length - 2]
  const netGrowth = latestMonth.total - previousMonth.total
  const growthPercentage = ((netGrowth / previousMonth.total) * 100).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Users className="h-3.5 w-3.5" />
            Total Members
          </div>
          <div className="text-xl font-bold">{latestMonth.total}</div>
          <div className={`flex items-center gap-1 text-xs ${parseFloat(growthPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(growthPercentage) >= 0 ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {Math.abs(parseFloat(growthPercentage))}% from last month
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground mb-1">New Members</div>
          <div className="text-xl font-bold text-green-600">{latestMonth.new}</div>
          <div className="text-xs text-muted-foreground">This month</div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground mb-1">Cancelled</div>
          <div className="text-xl font-bold text-red-600">{latestMonth.cancelled}</div>
          <div className="text-xs text-muted-foreground">This month</div>
        </div>
      </div>

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
    </div>
  )
}