import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, FileSpreadsheet, FileText, AlertCircle, Loader2 } from 'lucide-react'

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
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

import { RevenueExpenseChart } from '@/components/analytics-components/AnalyticsRevenue'
import { MembershipGrowthChart } from '@/components/analytics-components/AnalyticsGrowth'
import { PaymentMethodChart } from '@/components/analytics-components/AnalyticsPayments'
import { BranchPerformanceTable } from '@/components/analytics-components/AnalyticsBranches'
import { IncomeReportCards } from '@/components/analytics-components/AnalyticsIncome'
import { analyticsApi, type AnalyticsFilters } from '@/lib/analyticsApi'
import type { AnalyticsData } from '@/lib/analytics-data'
import { exportToPDF, exportToExcel } from '@/lib/analytics-export'
import { useBranches } from '@/hooks/branch/useBranches'

export const Route = createFileRoute('/dashboard/admin/analytics')({
  component: AnalyticsRoute,
})

type TimeRange = 'monthly' | 'quarterly' | 'yearly'

function filterByBranch(branch: string, data: AnalyticsData): AnalyticsData {
  if (branch === 'all') return data
  const branchData = data.branches.find((b) => b.name === branch)
  // If the branch doesn't exist just return data as-is so charts don't break.
  return branchData ? { ...data, branches: [branchData] } : data
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
      <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">No Data Available</h3>
      <p className="max-w-md text-center text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

function AnalyticsRoute() {
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly')
  const [isExporting, setIsExporting] = useState(false)

  // Fetch branches independently, same as expense page
  const { branches, isLoading: branchesLoading, error: branchesError } = useBranches()
  const branchNames = branches.map((b: { name?: string }) => b.name ?? '').filter(Boolean)

  const filters: AnalyticsFilters = useMemo(
    () => ({ branch: selectedBranch, timeRange }),
    [selectedBranch, timeRange],
  )

  const {
    data: rawData,
    isLoading: analyticsLoading,
    isError,
  } = useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => analyticsApi.getAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  })

  const analyticsData = useMemo(
    () => (rawData ? filterByBranch(selectedBranch, rawData) : null),
    [selectedBranch, rawData],
  )

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!analyticsData) return
    setIsExporting(true)
    try {
      const payload = { branch: selectedBranch, timeRange, analytics: analyticsData }
      if (format === 'pdf') {
        await exportToPDF(payload)
        toast.success('Export Successful', { description: 'PDF report has been downloaded.' })
      } else {
        await exportToExcel(payload)
        toast.success('Export Successful', { description: 'Excel report has been downloaded.' })
      }
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export Failed', { description: 'Unable to generate report. Please try again.' })
    } finally {
      setIsExporting(false)
    }
  }

  if (analyticsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">Loading analytics…</span>
      </div>
    )
  }

  if (isError || !analyticsData) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <EmptyState message="Failed to load analytics data. Please check your connection or try again later." />
      </div>
    )
  }

  if (!analyticsData.branches?.length) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <EmptyState message="No data available for the selected branch. Please select a different branch or contact support." />
      </div>
    )
  }

  const displayBranchName = selectedBranch === 'all' ? 'All Branches' : selectedBranch

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Financial Analytics</h1>
          {branchesLoading ? (
            <Skeleton className="mt-1 h-4 w-48" />
          ) : branchesError ? (
            <p className="mt-1 text-sm text-destructive">
              {branchesError?.message ?? 'Failed to load branches.'}
            </p>
          ) : (
            <p className="mt-1 text-muted-foreground">Viewing analytics for {displayBranchName}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedBranch} onValueChange={setSelectedBranch} disabled={branchesLoading}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branchNames.map((name: string) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting…' : 'Export'}
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

      {/* Content */}
      <div className="space-y-6">
        <IncomeReportCards data={analyticsData} branch={selectedBranch} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Revenue vs. Expenses Overview</CardTitle>
              <CardDescription>Track income and spending trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueExpenseChart
                data={analyticsData}
                branch={selectedBranch}
                timeRange={timeRange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Method Distribution</CardTitle>
              <CardDescription>Breakdown by payment type</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodChart data={analyticsData} branch={selectedBranch} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Membership Growth Metrics</CardTitle>
            <CardDescription>Track member acquisition and retention</CardDescription>
          </CardHeader>
          <CardContent>
            <MembershipGrowthChart
              data={analyticsData}
              branch={selectedBranch}
              timeRange={timeRange}
            />
          </CardContent>
        </Card>

        {selectedBranch === 'all' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Branch Performance Comparison</CardTitle>
              <CardDescription>Compare key metrics across all locations</CardDescription>
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