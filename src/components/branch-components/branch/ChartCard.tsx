import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  title: string;
  value: string | number;
  data: { name: string; value: number }[];
  dataKey: string;
  chartName: string;
  formatter: (value: number) => string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, value, data, dataKey, chartName, formatter }) => {
  const chartMargin = { top: 20, right: 20, left: 10, bottom: 30 };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
      <div className="w-full" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={formatter}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                color: '#000000',
                padding: '8px 12px',
              }}
              formatter={(value: number) => [formatter(value), chartName]}
              labelStyle={{ color: '#000000', fontWeight: 'bold', marginBottom: '4px' }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar dataKey={dataKey} fill="#7c93d4" name={chartName} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};