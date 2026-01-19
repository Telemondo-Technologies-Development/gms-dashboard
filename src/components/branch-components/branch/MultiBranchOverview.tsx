import React from 'react';
import { Card } from '@/components/ui/card';
import { ChartCard } from './ChartCard';

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

  // Calculate totals
  const totalRevenue = branches.reduce((sum, branch) => sum + (branch.revenue || 0), 0).toFixed(2);
  const totalExpenses = branches.reduce((sum, branch) => sum + (branch.expenses || 0), 0).toFixed(2);
  const totalMemberships = branches.reduce((sum, branch) => sum + (branch.memberships || 0), 0);

  return (
    <Card className="p-8 border py-26 border-zinc-100">
      <h2 className="text-xl font-bold mb-4">Multi-Branch Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard
          title="Total Revenue"
          value={`₱${totalRevenue}`}
          data={revenueData}
          dataKey="value"
          chartName="Revenue"
          formatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
        />
        <ChartCard
          title="Total Expenses"
          value={`₱${totalExpenses}`}
          data={expensesData}
          dataKey="value"
          chartName="Expenses"
          formatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
        />
        <ChartCard
          title="Total Memberships"
          value={totalMemberships}
          data={membershipsData}
          dataKey="value"
          chartName="Memberships"
          formatter={(value) => `${value}`}
        />
      </div>
    </Card>
  );
};