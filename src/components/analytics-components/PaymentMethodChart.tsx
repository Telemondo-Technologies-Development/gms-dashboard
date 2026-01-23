import { Pie, PieChart, Cell } from 'recharts'
import { Banknote, CreditCard, Smartphone } from 'lucide-react'
import type { AnalyticsData } from '@/lib/analytics-data'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

type Props = {
  data: AnalyticsData
  branch: string
}

const chartConfig = {
  Cash: {
    label: 'Cash',
    color: '#4a5c92', 
  },
  Card: {
    label: 'Card',
    color: '#324478', 
  },
  Online: {
    label: 'Online',
    color: '#8b5cf6', 
  },
}

const ICONS = {
  Cash: Banknote,
  Card: CreditCard,
  Online: Smartphone,
}

export function PaymentMethodChart({ data }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value / 100)
  }

  return (
    <div className="space-y-4">
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
              <Cell 
                key={entry.method} 
                fill={chartConfig[entry.method as keyof typeof chartConfig].color}
              />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        </PieChart>
      </ChartContainer>

      <div className="space-y-2">
        {data.paymentMethods.map((method) => {
          const Icon = ICONS[method.method as keyof typeof ICONS]
          const color = chartConfig[method.method as keyof typeof chartConfig].color
          
          return (
            <div key={method.method} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{method.method}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{method.percentage}%</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(method.amount)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}