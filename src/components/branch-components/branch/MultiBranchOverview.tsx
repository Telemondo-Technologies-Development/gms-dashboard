import React from 'react';
import * as RechartsPrimitive from 'recharts';
import { Card } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

interface MultiBranchOverviewProps {
  branches: {
    name: string;
    revenue: number;
    expenses: number;
    memberships: number;
  }[];
}

export const MultiBranchOverview: React.FC<MultiBranchOverviewProps> = ({ branches }) => {
  // Prepare data for charts
  const revenueData = branches.map((branch) => ({
    name: branch.name,
    value: branch.revenue,
  }));

  const expensesData = branches.map((branch) => ({
    name: branch.name,
    value: branch.expenses,
  }));

  const membershipsData = branches.map((branch) => ({
    name: branch.name,
    value: branch.memberships,
  }));

  return (
    <Card className="p-8 border py-26 border-zinc-100">
      <h2 className="text-xl font-bold mb-4">Multi-Branch Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-xl font-bold">
            $
            {branches
              .reduce((sum, branch) => sum + (branch.revenue || 0), 0)
              .toFixed(2)}
          </p>
          <ChartContainer
            config={{ revenue: { color: '#4caf50' } }}
          >
            <RechartsPrimitive.BarChart data={revenueData}>
              <RechartsPrimitive.XAxis dataKey="name" />
              <RechartsPrimitive.YAxis />
              <RechartsPrimitive.Bar dataKey="value" fill="var(--color-revenue)" />
            </RechartsPrimitive.BarChart>
          </ChartContainer>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-xl font-bold">
            $
            {branches
              .reduce((sum, branch) => sum + (branch.expenses || 0), 0)
              .toFixed(2)}
          </p>
          <ChartContainer
            config={{ expenses: { color: '#f44336' } }}
          >
            <RechartsPrimitive.BarChart data={expensesData}>
              <RechartsPrimitive.XAxis dataKey="name" />
              <RechartsPrimitive.YAxis />
              <RechartsPrimitive.Bar dataKey="value" fill="var(--color-expenses)" />
            </RechartsPrimitive.BarChart>
          </ChartContainer>
        </div>

        {/* Memberships Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold">Total Memberships</h3>
          <p className="text-xl font-bold">
            {branches.reduce((sum, branch) => sum + (branch.memberships || 0), 0)}
          </p>
          <ChartContainer
            config={{ memberships: { color: '#2196f3' } }}
          >
            <RechartsPrimitive.BarChart data={membershipsData}>
              <RechartsPrimitive.XAxis dataKey="name" />
              <RechartsPrimitive.YAxis />
              <RechartsPrimitive.Bar dataKey="value" fill="var(--color-memberships)" />
            </RechartsPrimitive.BarChart>
          </ChartContainer>
        </div>
      </div>
    </Card>
  );
};