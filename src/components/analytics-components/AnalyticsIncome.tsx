import { ArrowDown, ArrowUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalyticsData } from '@/lib/analytics-data'

type Props = {
  data: AnalyticsData
  branch: string
}

type IncomeCardProps = {
  title: string
  current: number
  previous: number
  percentChange: number
  formatCurrency: (value: number) => string
}

function IncomeCard({ title, current, previous, percentChange, formatCurrency }: IncomeCardProps) {
  const isPositive = percentChange >= 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">{formatCurrency(current)}</div>
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span className="sr-only">{isPositive ? 'Increased' : 'Decreased'} by</span>
            {Math.abs(percentChange)}% from last period
          </div>
          <div className="pt-1 text-xs text-muted-foreground">
            Previous: {formatCurrency(previous)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function IncomeReportCards({ data }: Props) {
  if (!data.monthlyIncome || !data.annualIncome) return null

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value / 100)

  const now = new Date()
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`
  const prevYear = now.getFullYear() - 1

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <IncomeCard
        title={`Monthly Income Report — ${monthLabel}`}
        current={data.monthlyIncome.current}
        previous={data.monthlyIncome.previous}
        percentChange={data.monthlyIncome.percentChange}
        formatCurrency={formatCurrency}
      />
      <IncomeCard
        title={`Annual Income Report — ${prevYear}`}
        current={data.annualIncome.current}
        previous={data.annualIncome.previous}
        percentChange={data.annualIncome.percentChange}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}