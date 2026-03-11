import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPeso, formatPesoCompact } from '@/lib/expense/expense-utils'

export interface ChartDataPoint {
  label: string
  amount: number
}

interface SpendingChartProps {
  data: ChartDataPoint[]
  rotateLabels?: boolean
}

export function SpendingChart({ data, rotateLabels = false }: SpendingChartProps) {
  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: rotateLabels ? 60 : 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="label"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            {...(rotateLabels ? { angle: -45, textAnchor: 'end' } : {})}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={formatPesoCompact}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              color: '#000000',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#000000', fontWeight: 'bold', marginBottom: '4px' }}
            itemStyle={{ color: '#005BB0' }}
            formatter={(value: number) => [formatPeso(value), 'Amount']}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar dataKey="amount" fill="#7c93d4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}