import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { RevenueExpenseChart } from '@/components/analytics-components/RevenueExpenseChart'
import { MembershipGrowthChart } from '@/components/analytics-components/MembershipGrowthChart'
import { PaymentMethodChart } from '@/components/analytics-components/PaymentMethodChart'
import { BranchPerformanceTable } from '@/components/analytics-components/BranchPerformanceTable'
import { IncomeReportCards } from '@/components/analytics-components/IncomeReportCards'
import { MOCK_ANALYTICS_DATA, type AnalyticsData } from '@/lib/analytics-data'
import { exportToPDF, exportToExcel } from '@/lib/analytics-export'

export const Route = createFileRoute('/dashboard/admin/analytics')({
  component: AnalyticsRoute,
})

type TimeRange = 'monthly' | 'quarterly' | 'yearly'

// Helper function to filter mock data by branch
function getFilteredData(branch: string): AnalyticsData {
  if (branch === 'all') {
    return MOCK_ANALYTICS_DATA
  }

  // Filter data for specific branch
  const branchData = MOCK_ANALYTICS_DATA.branches.find(b => b.name === branch)
  
  if (!branchData) {
    return MOCK_ANALYTICS_DATA
  }

  // MOCK DATA
  const branchRatio = branchData.revenue / MOCK_ANALYTICS_DATA.branches.reduce((sum, b) => sum + b.revenue, 0)

  return {
    monthlyIncome: {
      current: Math.round(MOCK_ANALYTICS_DATA.monthlyIncome.current * branchRatio),
      previous: Math.round(MOCK_ANALYTICS_DATA.monthlyIncome.previous * branchRatio),
      percentChange: MOCK_ANALYTICS_DATA.monthlyIncome.percentChange,
    },
    annualIncome: {
      current: Math.round(MOCK_ANALYTICS_DATA.annualIncome.current * branchRatio),
      previous: Math.round(MOCK_ANALYTICS_DATA.annualIncome.previous * branchRatio),
      percentChange: MOCK_ANALYTICS_DATA.annualIncome.percentChange,
    },
    revenueExpense: MOCK_ANALYTICS_DATA.revenueExpense.map(item => ({
      month: item.month,
      revenue: Math.round(item.revenue * branchRatio),
      expense: Math.round(item.expense * branchRatio),
    })),
    membershipGrowth: MOCK_ANALYTICS_DATA.membershipGrowth.map(item => ({
      month: item.month,
      total: Math.round(item.total * branchRatio),
      new: Math.round(item.new * branchRatio),
      cancelled: Math.round(item.cancelled * branchRatio),
    })),
    paymentMethods: MOCK_ANALYTICS_DATA.paymentMethods.map(item => ({
      method: item.method,
      amount: Math.round(item.amount * branchRatio),
      percentage: item.percentage, // Percentages remain the same
    })),
    branches: [branchData], // Only show the selected branch
  }
}

function AnalyticsRoute() {
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly')

  const branches = ['all', ...MOCK_ANALYTICS_DATA.branches.map(b => b.name)]
  
  // Get filtered data based on selected branch
  const analyticsData = getFilteredData(selectedBranch)

  const handleExport = (format: 'pdf' | 'excel') => {
    const data = {
      branch: selectedBranch,
      timeRange,
      analytics: analyticsData,
    }

    if (format === 'pdf') {
      exportToPDF(data)
    } else {
      exportToExcel(data)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section - Consistent with membership page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Financial Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Currently viewing: {selectedBranch === 'all' ? 'All Branches' : selectedBranch}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Branch Selector */}
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch === 'all' ? 'All Branches' : branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time Range Selector */}
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content - Updated spacing to match membership page */}
      <div className="space-y-6">
        {/* Income Report Cards */}
        <IncomeReportCards data={analyticsData} branch={selectedBranch} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue vs Expense Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue vs. Expenses Overview</CardTitle>
              <CardDescription>
                Track income and spending trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueExpenseChart
                data={analyticsData}
                branch={selectedBranch}
                timeRange={timeRange}
              />
            </CardContent>
          </Card>

          {/* Payment Method Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Distribution</CardTitle>
              <CardDescription>
                Breakdown by payment type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodChart
                data={analyticsData}
                branch={selectedBranch}
              />
            </CardContent>
          </Card>
        </div>

        {/* Membership Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Growth Metrics</CardTitle>
            <CardDescription>
              Track member acquisition and retention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MembershipGrowthChart
              data={analyticsData}
              branch={selectedBranch}
              timeRange={timeRange}
            />
          </CardContent>
        </Card>

        {/* Branch Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Performance Comparison</CardTitle>
            <CardDescription>
              Compare key metrics across all locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BranchPerformanceTable data={analyticsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}