import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Download, FileSpreadsheet, FileText, TrendingUp, AlertCircle } from 'lucide-react'

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

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

  const branchData = MOCK_ANALYTICS_DATA.branches.find(b => b.name === branch)
  
  if (!branchData) {
    return MOCK_ANALYTICS_DATA
  }

  // Calculate branch ratio for proportional data distribution
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
      percentage: item.percentage,
    })),
    branches: [branchData],
  }
}

// Key Insights Component
function KeyInsights({ data, branch }: { data: AnalyticsData; branch: string }) {
  const topBranch = [...data.branches].sort((a, b) => b.profit - a.profit)[0]
  const decliningBranches = data.branches.filter(b => b.growth < 0)
  
  const revenueVsExpense = data.revenueExpense[data.revenueExpense.length - 1]
  const profitMargin = ((revenueVsExpense.revenue - revenueVsExpense.expense) / revenueVsExpense.revenue * 100).toFixed(1)

  if (branch !== 'all') {
    const currentBranch = data.branches[0]
    const isGrowing = currentBranch.growth >= 0
    
    return (
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Branch Performance</AlertTitle>
        <AlertDescription>
          {isGrowing ? (
            <>
              <span className="font-semibold text-green-600">On track</span> - {currentBranch.name} is growing at {currentBranch.growth}% with {currentBranch.members.toLocaleString()} active members.
            </>
          ) : (
            <>
              <span className="font-semibold text-orange-600">Needs attention</span> - {currentBranch.name} is declining at {Math.abs(currentBranch.growth)}%. Review operations and member retention strategies.
            </>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert>
      <TrendingUp className="h-4 w-4" />
      <AlertTitle>Key Insights</AlertTitle>
      <AlertDescription>
        <span className="font-semibold">{topBranch.name}</span> is your top performer with {topBranch.growth}% growth and {topBranch.members.toLocaleString()} members. 
        Current profit margin: <span className="font-semibold">{profitMargin}%</span>.
        {decliningBranches.length > 0 && (
          <> {decliningBranches.map(b => b.name).join(', ')} {decliningBranches.length === 1 ? 'needs' : 'need'} attention.</>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

function AnalyticsRoute() {
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly')
  const [isExporting, setIsExporting] = useState(false)

  const branches = ['all', ...MOCK_ANALYTICS_DATA.branches.map(b => b.name)]
  
  // Get filtered data based on selected branch
  const analyticsData = useMemo(
    () => getFilteredData(selectedBranch),
    [selectedBranch]
  )

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true)
    try {
      const data = {
        branch: selectedBranch,
        timeRange,
        analytics: analyticsData,
      }

      if (format === 'pdf') {
        exportToPDF(data)
        toast.success('Export Successful', {
          description: 'PDF report has been generated.',
        })
      } else {
        exportToExcel(data)
        toast.success('Export Successful', {
          description: 'Excel report has been downloaded.',
        })
      }
    } catch (error) {
      toast.error('Export Failed', {
        description: 'Unable to generate report. Please try again.',
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Check for empty data
  if (!analyticsData.branches?.length) {
    return <EmptyState message="No data available for the selected branch" />
  }

  const displayBranchName = selectedBranch === 'all' ? 'All Branches' : selectedBranch

  return (
    <div className="space-y-6 max-w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Financial Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Currently viewing: {displayBranchName}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Branch Selector */}
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-full sm:w-48">
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
            <SelectTrigger className="w-full sm:w-36">
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
              <Button variant="outline" disabled={isExporting} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={isExporting}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')} disabled={isExporting}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Key Insights */}
        <KeyInsights data={analyticsData} branch={selectedBranch} />

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
        {selectedBranch === 'all' && (
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
        )}
      </div>
    </div>
  )
}