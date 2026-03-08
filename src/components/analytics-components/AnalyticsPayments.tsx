import { Pie, PieChart, Cell } from 'recharts'
import { Banknote, CreditCard, Smartphone, type LucideIcon } from 'lucide-react'
import type { AnalyticsData } from '@/lib/analytics/analytics-data'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type Props = {
  data: AnalyticsData
  branch: string
}

type PaymentMethod = 'Cash' | 'Card' | 'Online'

const chartConfig = {
  Cash: { label: 'Cash', color: '#7c93d4' },
  Card: { label: 'Card', color: '#435F8C' },
  Online: { label: 'Online', color: '#8b5cf6' },
} as const satisfies Record<PaymentMethod, { label: string; color: string }>

const METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  Cash: Banknote,
  Card: CreditCard,
  Online: Smartphone,
}

function getMethodConfig(method: string) {
  return chartConfig[method as PaymentMethod] ?? { label: method, color: '#94a3b8' }
}

export function PaymentMethodChart({ data }: Props) {
  if (!data.paymentMethods?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No payment data available
      </div>
    )
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value / 100)

  return (
    <div className="space-y-4">
      {/* Pie Chart */}
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <PieChart>
          <Pie
            data={data.paymentMethods}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="amount"
            nameKey="method"
          >
            {data.paymentMethods.map((entry) => (
              <Cell key={entry.method} fill={getMethodConfig(entry.method).color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        </PieChart>
      </ChartContainer>

      {/* Legend with details */}
      <div className="space-y-2">
        {data.paymentMethods.map((method) => {
          const config = getMethodConfig(method.method)
          const Icon = METHOD_ICONS[method.method as PaymentMethod]

          return (
            <div key={method.method} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                {Icon && <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
                <span className="text-sm font-medium">{method.method}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{method.percentage}%</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(method.amount)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}