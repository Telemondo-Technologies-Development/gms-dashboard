import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  UserX,
  DollarSign,
  AlertCircle,
  Package,
  TrendingUp,
  UserPlus,
  FileText,
  Wrench,
  Calendar,
} from 'lucide-react'
import {
  getActiveMembersCount,
  getExpiredMembershipsCount,
  getExpiringSoonCount,
  getCurrentMonthRevenue,
  getOutstandingDues,
  getAssetStatusSummary,
  getCurrentMonthExpenses,
  getAllBranchMetrics,
  getMembersWithDues,
  formatCurrency,
  type Member,
  type Asset,
  type Expense,
} from '@/lib/dashboard-utils'
import { MetricCard } from '@/components/dashboard-components/MetricCard'
import { QuickActionCard } from '@/components/dashboard-components/QuickActionCard'
import { BranchPerformanceCard } from '@/components/dashboard-components/BranchPerformanceCard'

export const Route = createFileRoute('/dashboard/admin/overview')({
  component: DashboardOverview,
})

function DashboardOverview() {
  const navigate = useNavigate()

  // Mock data - In production, this would come from API/state management
  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'John Doe',
      membershipType: 'Premium',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2025-01-15'),
      status: 'Active',
      branch: 'Matina Gym Fitness',
      monthlyFee: 1500,
      amountPaid: 1500,
    },
    {
      id: '2',
      name: 'Jane Smith',
      membershipType: 'Basic',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-31'),
      status: 'Active',
      branch: 'Panacan Gym Fitness',
      monthlyFee: 1000,
      amountPaid: 800,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      membershipType: 'Premium',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-11-30'),
      status: 'Active',
      branch: 'Matina Gym Fitness',
      monthlyFee: 1500,
      amountPaid: 1500,
    },
  ])

  const [assets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Treadmill Pro X500',
      status: 'Operational',
      condition: 'Good',
      branch: 'Matina Gym Fitness',
      price: 85000,
    },
    {
      id: '2',
      name: 'Elliptical Trainer',
      status: 'Needs Repair',
      condition: 'Fair',
      branch: 'Panacan Gym Fitness',
      price: 65000,
    },
    {
      id: '3',
      name: 'Weight Set',
      status: 'Operational',
      condition: 'Excellent',
      branch: 'Matina Gym Fitness',
      price: 45000,
    },
  ])

  const [expenses] = useState<Expense[]>([
    {
      id: '1',
      type: 'Salary',
      amount: 25000,
      date: new Date('2024-12-01'),
      branch: 'Matina Gym Fitness',
    },
    {
      id: '2',
      type: 'Utility',
      amount: 8000,
      date: new Date('2024-12-05'),
      branch: 'Matina Gym Fitness',
    },
    {
      id: '3',
      type: 'Maintenance',
      amount: 5000,
      date: new Date('2024-12-10'),
      branch: 'Panacan Gym Fitness',
    },
  ])

  const branches = ['Matina Gym Fitness', 'Panacan Gym Fitness']

  // Calculate metrics
  const activeMembers = getActiveMembersCount(members)
  const expiredMemberships = getExpiredMembershipsCount(members)
  const expiringSoon = getExpiringSoonCount(members)
  const currentRevenue = getCurrentMonthRevenue(members)
  const outstandingDues = getOutstandingDues(members)
  const assetSummary = getAssetStatusSummary(assets)
  const currentExpenses = getCurrentMonthExpenses(expenses)
  const branchMetrics = getAllBranchMetrics(branches, members, assets, expenses)
  const membersWithDues = getMembersWithDues(members)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Real-time operational insights and key metrics
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Members"
          value={activeMembers}
          icon={Users}
          description="Currently enrolled"
          variant="success"
          onClick={() => navigate({ to: '/dashboard/marketing/membership' })}
        />
        <MetricCard
          title="Expired Memberships"
          value={expiredMemberships}
          icon={UserX}
          description={`${expiringSoon} expiring soon`}
          variant="warning"
          onClick={() => navigate({ to: '/dashboard/marketing/membership' })}
        />
        <MetricCard
          title="Monthly Revenue"
          value={formatCurrency(currentRevenue)}
          icon={DollarSign}
          description="Current period"
          variant="success"
        />
        <MetricCard
          title="Outstanding Dues"
          value={formatCurrency(outstandingDues)}
          icon={AlertCircle}
          description={`${membersWithDues.length} members`}
          variant="danger"
          onClick={() => navigate({ to: '/dashboard/marketing/membership' })}
        />
      </div>

      {/* Asset Status & Expense Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Asset Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Asset Status Summary
            </CardTitle>
            <CardDescription>Equipment and supplies overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Operational</span>
                </div>
                <span className="font-semibold">{assetSummary.operational}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Needs Repair</span>
                </div>
                <span className="font-semibold">{assetSummary.needsRepair}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Under Maintenance</span>
                </div>
                <span className="font-semibold">{assetSummary.underMaintenance}</span>
              </div>
              <div className="pt-4 border-t flex items-center justify-between">
                <span className="font-semibold">Total Assets</span>
                <span className="text-lg font-bold">{assetSummary.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Expense Overview
            </CardTitle>
            <CardDescription>Current month spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Expenses</span>
                <span className="text-2xl font-bold">{formatCurrency(currentExpenses)}</span>
              </div>
              <div className="space-y-2">
                {expenses.slice(0, 3).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{expense.type}</Badge>
                      <span className="text-muted-foreground">{expense.branch}</span>
                    </div>
                    <span className="font-medium">₱{expense.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Net Profit</span>
                  <span
                    className={`text-lg font-bold ${
                      currentRevenue - currentExpenses >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(currentRevenue - currentExpenses)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch Performance */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Branch Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branchMetrics.map((metrics) => (
            <BranchPerformanceCard
              key={metrics.name}
              metrics={metrics}
              onClick={() => navigate({ to: '/dashboard/marketing/branch' })}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Add Member"
            description="Register a new gym member"
            icon={UserPlus}
            onClick={() => navigate({ to: '/dashboard/marketing/membership' })}
          />
          <QuickActionCard
            title="Record Expense"
            description="Log a new expense transaction"
            icon={FileText}
            onClick={() => navigate({ to: '/dashboard/admin/expense' })}
          />
          <QuickActionCard
            title="Add Asset"
            description="Register new equipment or supplies"
            icon={Package}
            onClick={() => navigate({ to: '/dashboard/marketing/asset' })}
          />
          <QuickActionCard
            title="Schedule Maintenance"
            description="Plan asset maintenance tasks"
            icon={Wrench}
            onClick={() => navigate({ to: '/dashboard/marketing/asset' })}
          />
        </div>
      </div>

      {/* Recent Alerts */}
      {(expiringSoon > 0 || assetSummary.needsRepair > 0 || membersWithDues.length > 0) && (
        <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
              <AlertCircle className="h-5 w-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {expiringSoon > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {expiringSoon} membership{expiringSoon > 1 ? 's' : ''} expiring within 7 days
                  </span>
                </div>
              )}
              {assetSummary.needsRepair > 0 && (
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  <span>
                    {assetSummary.needsRepair} asset{assetSummary.needsRepair > 1 ? 's' : ''} need
                    repair
                  </span>
                </div>
              )}
              {membersWithDues.length > 0 && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    {membersWithDues.length} member{membersWithDues.length > 1 ? 's have' : ' has'}{' '}
                    outstanding dues
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
