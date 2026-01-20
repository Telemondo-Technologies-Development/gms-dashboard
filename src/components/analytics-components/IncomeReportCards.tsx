import { ArrowDown, ArrowUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalyticsData } from '@/lib/analytics-data'

type Props = {
  data: AnalyticsData
  branch: string
}

export function IncomeReportCards({ data }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value / 100)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Income Report - January 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {formatCurrency(data.monthlyIncome.current)}
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              data.monthlyIncome.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.monthlyIncome.percentChange >= 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {Math.abs(data.monthlyIncome.percentChange)}% from last month
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Annual Income Report - 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {formatCurrency(data.annualIncome.current)}
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              data.annualIncome.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.annualIncome.percentChange >= 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {Math.abs(data.annualIncome.percentChange)}% compared to 2024
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}