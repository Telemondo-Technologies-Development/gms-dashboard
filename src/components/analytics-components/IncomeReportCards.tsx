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
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">
            {formatCurrency(current)}
          </div>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isPositive ? 'Increased' : 'Decreased'} by
              </span>
              {Math.abs(percentChange)}% from last period
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-1">
            Previous: {formatCurrency(previous)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function IncomeReportCards({ data }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value / 100)
  }

  // Validate data
  if (!data.monthlyIncome || !data.annualIncome) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <IncomeCard
        title="Monthly Income Report - January 2026"
        current={data.monthlyIncome.current}
        previous={data.monthlyIncome.previous}
        percentChange={data.monthlyIncome.percentChange}
        formatCurrency={formatCurrency}
      />
      <IncomeCard
        title="Annual Income Report - 2025"
        current={data.annualIncome.current}
        previous={data.annualIncome.previous}
        percentChange={data.annualIncome.percentChange}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}