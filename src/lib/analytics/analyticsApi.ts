import type { AnalyticsData } from '@/lib/analytics/analytics-data'
import { paymentApi, getAuthenticatedApi } from '@/lib/api-client'
import {
  BranchApi,
  MemberSubscriptionApi,
  BranchSummaryApi,
  SalaryExpenseApi,
  UtilityExpenseApi,
  SuppliesExpenseApi,
  OtherExpenseApi,
  AssetExpenseApi,
  AssetMaintenanceExpenseApi,
} from '@/api/generated/apis'
import type {
  PaymentTableDTO,
  PaymentMethodTableDTO,
  BranchTableDTO,
  MemberSubscriptionTableDTO,
  BranchSummaryTableDTO,
  SalaryExpenseReadDTO,
  UtilityExpenseReadDTO,
  SuppliesExpenseReadDTO,
  OtherExpenseReadDTO,
  AssetExpenseReadDTO,
  AssetMaintenanceExpenseReadDTO,
} from '@/api/generated/models'

export type AnalyticsFilters = {
  branch?: string
  startDate?: string
  endDate?: string
  timeRange?: 'monthly' | 'quarterly' | 'yearly'
}

// ---------------------------------------------------------------------------
// Sample / fallback data
// ---------------------------------------------------------------------------

const SAMPLE_DATA: AnalyticsData = {
  monthlyIncome: {
    current: 18500000,
    previous: 15200000,
    percentChange: 21.7,
  },
  annualIncome: {
    current: 142000000,
    previous: 118000000,
    percentChange: 20.3,
  },
  revenueExpense: [
    { month: 'Jan', revenue: 9800000, expense: 4200000 },
    { month: 'Feb', revenue: 11200000, expense: 4800000 },
    { month: 'Mar', revenue: 10500000, expense: 5100000 },
    { month: 'Apr', revenue: 13400000, expense: 5500000 },
    { month: 'May', revenue: 12800000, expense: 4900000 },
    { month: 'Jun', revenue: 15100000, expense: 6200000 },
    { month: 'Jul', revenue: 14300000, expense: 5800000 },
    { month: 'Aug', revenue: 16200000, expense: 6500000 },
    { month: 'Sep', revenue: 15800000, expense: 6100000 },
    { month: 'Oct', revenue: 17400000, expense: 7200000 },
    { month: 'Nov', revenue: 16900000, expense: 6800000 },
    { month: 'Dec', revenue: 18500000, expense: 7500000 },
  ],
  membershipGrowth: [
    { month: 'Jan', total: 120, new: 18, cancelled: 3 },
    { month: 'Feb', total: 135, new: 20, cancelled: 5 },
    { month: 'Mar', total: 148, new: 22, cancelled: 9 },
    { month: 'Apr', total: 162, new: 25, cancelled: 11 },
    { month: 'May', total: 175, new: 28, cancelled: 15 },
    { month: 'Jun', total: 190, new: 30, cancelled: 15 },
    { month: 'Jul', total: 208, new: 35, cancelled: 17 },
    { month: 'Aug', total: 224, new: 32, cancelled: 16 },
    { month: 'Sep', total: 241, new: 38, cancelled: 21 },
    { month: 'Oct', total: 258, new: 40, cancelled: 23 },
    { month: 'Nov', total: 272, new: 36, cancelled: 22 },
    { month: 'Dec', total: 289, new: 42, cancelled: 25 },
  ],
  paymentMethods: [
    { method: 'Cash', amount: 8500000, percentage: 46 },
    { method: 'Card', amount: 6200000, percentage: 33 },
    { method: 'Online', amount: 3800000, percentage: 21 },
  ],
  branches: [
    { name: 'Matina', revenue: 7200000, expenses: 3100000, profit: 4100000, members: 98, growth: 12.4 },
    { name: 'Buhangin', revenue: 6100000, expenses: 2800000, profit: 3300000, members: 87, growth: 8.7 },
    { name: 'Toril', revenue: 5200000, expenses: 2400000, profit: 2800000, members: 72, growth: 6.2 },
  ],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getMonthLabel(date: Date): string {
  return date.toLocaleString('default', { month: 'short' })
}

function sumAmount(arr: PaymentTableDTO[]): number {
  return arr.reduce((s, p) => s + (p.amount ?? 0), 0)
}

function pctChange(curr: number, prev: number): number {
  return prev > 0 ? parseFloat(((curr - prev) / prev * 100).toFixed(1)) : 0
}

// Generic expense item shape — all expense DTOs share amount + paidAt + branchId
type AnyExpense = {
  amount: number
  paidAt: Date
  branchId?: string
}

/**
 * Sum all expense records by calendar month label (e.g. "Jan", "Feb").
 * Optionally filter to a specific branchId.
 */
function buildExpenseByMonth(
  expenses: AnyExpense[],
  branchId?: string,
): Record<string, number> {
  const result: Record<string, number> = {}
  for (const e of expenses) {
    if (branchId && e.branchId !== branchId) continue
    const label = getMonthLabel(new Date(e.paidAt))
    result[label] = (result[label] ?? 0) + e.amount
  }
  return result
}

// ---------------------------------------------------------------------------
// Main transform
// ---------------------------------------------------------------------------

function transform(
  branches: BranchTableDTO[],
  payments: PaymentTableDTO[],
  paymentMethods: PaymentMethodTableDTO[],
  subscriptions: MemberSubscriptionTableDTO[],
  branchSummaries: BranchSummaryTableDTO[],
  allExpenses: AnyExpense[],
  filters: AnalyticsFilters,
): AnalyticsData {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // ------------------------------------------------------------------
  // Payment method name map
  // ------------------------------------------------------------------
  const methodNameMap: Record<string, string> = {}
  for (const m of paymentMethods) {
    if (m.id && m.name) methodNameMap[m.id] = m.name
  }

  // ------------------------------------------------------------------
  // Filter payments
  // ------------------------------------------------------------------
  let successfulPayments = payments.filter(
    (p) => p.status === 'FULL' || p.status === 'PARTIAL',
  )
  if (filters.startDate) {
    const start = new Date(filters.startDate)
    successfulPayments = successfulPayments.filter(
      (p) => p.paidAt && new Date(p.paidAt) >= start,
    )
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate)
    successfulPayments = successfulPayments.filter(
      (p) => p.paidAt && new Date(p.paidAt) <= end,
    )
  }

  // ------------------------------------------------------------------
  // Revenue by month (from payments)
  // ------------------------------------------------------------------
  const revenueByMonth: Record<string, number> = {}
  for (const payment of successfulPayments) {
    if (!payment.paidAt) continue
    const label = getMonthLabel(new Date(payment.paidAt))
    revenueByMonth[label] = (revenueByMonth[label] ?? 0) + (payment.amount ?? 0)
  }

  // ------------------------------------------------------------------
  // Expense by month — aggregate ALL expense categories
  // Optionally scoped to the selected branch
  // ------------------------------------------------------------------
  const selectedBranchObj = filters.branch && filters.branch !== 'all'
    ? branches.find((b) => b.name === filters.branch)
    : undefined
  const selectedBranchId = selectedBranchObj?.id

  const expenseByMonth = buildExpenseByMonth(allExpenses, selectedBranchId)

  // ------------------------------------------------------------------
  // Merge revenue + expense into revenueExpense[]
  // Union of months that appear in either dataset
  // ------------------------------------------------------------------
  const allMonths = Array.from(
    new Set([...Object.keys(revenueByMonth), ...Object.keys(expenseByMonth)]),
  )
  const MONTH_ORDER = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  allMonths.sort((a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b))

  const revenueExpense = allMonths.map((month) => ({
    month,
    revenue: revenueByMonth[month] ?? 0,
    expense: expenseByMonth[month] ?? 0,
  }))

  // ------------------------------------------------------------------
  // Payment method distribution
  // ------------------------------------------------------------------
  const amountByMethodId: Record<string, number> = {}
  for (const payment of successfulPayments) {
    if (!payment.paymentMethodId) continue
    amountByMethodId[payment.paymentMethodId] =
      (amountByMethodId[payment.paymentMethodId] ?? 0) + (payment.amount ?? 0)
  }
  const totalAmount = Object.values(amountByMethodId).reduce((s, v) => s + v, 0)
  const paymentMethodsData = Object.entries(amountByMethodId).map(([id, amount]) => ({
    method: methodNameMap[id] ?? id,
    amount,
    percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
  }))

  // ------------------------------------------------------------------
  // Monthly / annual income KPIs
  // ------------------------------------------------------------------
  const monthlyPayments = successfulPayments.filter((p) => {
    if (!p.paidAt) return false
    const d = new Date(p.paidAt)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  const prevMonthPayments = successfulPayments.filter((p) => {
    if (!p.paidAt) return false
    const d = new Date(p.paidAt)
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    return d.getMonth() === prevMonth && d.getFullYear() === prevYear
  })
  const annualPayments = successfulPayments.filter(
    (p) => p.paidAt && new Date(p.paidAt).getFullYear() === currentYear,
  )
  const prevYearPayments = successfulPayments.filter(
    (p) => p.paidAt && new Date(p.paidAt).getFullYear() === currentYear - 1,
  )

  const monthlyCurrent = sumAmount(monthlyPayments)
  const monthlyPrevious = sumAmount(prevMonthPayments)
  const annualCurrent = sumAmount(annualPayments)
  const annualPrevious = sumAmount(prevYearPayments)

  // ------------------------------------------------------------------
  // Membership growth
  // ------------------------------------------------------------------
  const filteredSubscriptions =
    filters.branch && filters.branch !== 'all'
      ? subscriptions.filter((sub) =>
          selectedBranchObj ? sub.branchId === selectedBranchObj.id : true,
        )
      : subscriptions

  const growthByMonth: Record<string, { new: number; cancelled: number }> = {}
  for (const sub of filteredSubscriptions) {
    if (!sub.startDate) continue
    const label = getMonthLabel(new Date(sub.startDate))
    if (!growthByMonth[label]) growthByMonth[label] = { new: 0, cancelled: 0 }
    if (sub.status === 'CANCELED') {
      growthByMonth[label].cancelled += 1
    } else {
      growthByMonth[label].new += 1
    }
  }
  let runningTotal = filteredSubscriptions.length
  const membershipGrowth = Object.entries(growthByMonth)
    .map(([month, vals]) => {
      runningTotal -= vals.cancelled
      return { month, total: runningTotal, new: vals.new, cancelled: vals.cancelled }
    })
    .reverse()

  // ------------------------------------------------------------------
  // Branch performance — powered by BranchSummaryApi
  //
  // BranchSummaryTableDTO has: branchId, branchName, totalRevenue,
  // totalExpenses, netProfit, reportYear, reportMonth, reportQuarter.
  //
  // Strategy: aggregate all summary rows per branch (sum across months
  // for the relevant year), then compute member counts from subscriptions.
  // Growth = percent change in revenue vs prior period summary rows.
  // ------------------------------------------------------------------
  const summaryByBranch: Record<
    string,
    { name: string; revenue: number; expenses: number; profit: number; prevRevenue: number }
  > = {}

  for (const summary of branchSummaries) {
    const bid = summary.branchId
    const name = summary.branchName ?? bid
    if (!summaryByBranch[bid]) {
      summaryByBranch[bid] = { name, revenue: 0, expenses: 0, profit: 0, prevRevenue: 0 }
    }
    if (summary.reportYear === currentYear) {
      summaryByBranch[bid].revenue += summary.totalRevenue
      summaryByBranch[bid].expenses += summary.totalExpenses
      summaryByBranch[bid].profit += summary.netProfit
    } else if (summary.reportYear === currentYear - 1) {
      // Keep prior year revenue for growth calculation
      summaryByBranch[bid].prevRevenue += summary.totalRevenue
    }
  }

  // Member count per branch from subscriptions (active only)
  const membersByBranch: Record<string, number> = {}
  for (const sub of subscriptions) {
    if (!sub.branchId || sub.status === 'CANCELED') continue
    membersByBranch[sub.branchId] = (membersByBranch[sub.branchId] ?? 0) + 1
  }

  const branchData = branches.map((b) => {
    const summary = b.id ? summaryByBranch[b.id] : undefined
    const members = b.id ? (membersByBranch[b.id] ?? 0) : 0
    const revenue = summary?.revenue ?? 0
    const expenses = summary?.expenses ?? 0
    const profit = summary?.profit ?? 0
    const prevRevenue = summary?.prevRevenue ?? 0
    const growth = pctChange(revenue, prevRevenue)

    return {
      name: b.name ?? 'Unknown',
      revenue,
      expenses,
      profit,
      members,
      growth,
    }
  })

  return {
    monthlyIncome: {
      current: monthlyCurrent,
      previous: monthlyPrevious,
      percentChange: pctChange(monthlyCurrent, monthlyPrevious),
    },
    annualIncome: {
      current: annualCurrent,
      previous: annualPrevious,
      percentChange: pctChange(annualCurrent, annualPrevious),
    },
    revenueExpense,
    membershipGrowth,
    paymentMethods: paymentMethodsData,
    branches: branchData,
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const analyticsApi = {
  getAnalytics: async (filters: AnalyticsFilters): Promise<AnalyticsData> => {
    const branchApi = getAuthenticatedApi(BranchApi)
    const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
    const branchSummaryApi = getAuthenticatedApi(BranchSummaryApi)
    const salaryExpenseApi = getAuthenticatedApi(SalaryExpenseApi)
    const utilityExpenseApi = getAuthenticatedApi(UtilityExpenseApi)
    const suppliesExpenseApi = getAuthenticatedApi(SuppliesExpenseApi)
    const otherExpenseApi = getAuthenticatedApi(OtherExpenseApi)
    const assetExpenseApi = getAuthenticatedApi(AssetExpenseApi)
    const assetMaintenanceExpenseApi = getAuthenticatedApi(AssetMaintenanceExpenseApi)

    const PAGEABLE = { page: 0, size: 9999 }
    const now = new Date()

    // Determine year/month params for BranchSummaryApi based on timeRange
    const branchSummaryParams: { pageable: typeof PAGEABLE; year?: number; month?: number } = {
      pageable: PAGEABLE,
    }
    if (filters.timeRange === 'monthly') {
      branchSummaryParams.year = now.getFullYear()
      branchSummaryParams.month = now.getMonth() + 1 // API expects 1-indexed month
    } else if (filters.timeRange === 'quarterly' || filters.timeRange === 'yearly') {
      branchSummaryParams.year = now.getFullYear()
      // No month filter — fetch entire year
    }

    const [
      branchesRes,
      paymentsRes,
      paymentMethodsRes,
      subscriptionsRes,
      branchSummaryRes,
      salaryRes,
      utilityRes,
      suppliesRes,
      otherRes,
      assetRes,
      assetMaintenanceRes,
    ] = await Promise.all([
      branchApi.getAllBranches({ pageable: PAGEABLE }),
      paymentApi.getAllPayments({ pageable: PAGEABLE }),
      paymentApi.getAllPaymentMethods({ pageable: PAGEABLE }),
      memberSubscriptionApi.getAllMemberSubscriptions({ pageable: PAGEABLE }),
      branchSummaryApi.getAllBranchSummary(branchSummaryParams).catch(() => ({ data: [] })),
      salaryExpenseApi.getAllSalaryExpense({ pageable: PAGEABLE }).catch(() => ({ data: [] })),
      utilityExpenseApi.getAllUtilityExpense({ pageable: PAGEABLE }).catch(() => ({ data: [] })),
      suppliesExpenseApi.getAllSuppliesExpense({ pageable: PAGEABLE }).catch(() => ({ data: [] })),
      otherExpenseApi.getAllOtherExpense({ pageable: PAGEABLE }).catch(() => ({ data: [] })),
      assetExpenseApi.getAllAssetExpense({ pageable: PAGEABLE }).catch(() => ({ data: [] })),
      assetMaintenanceExpenseApi.getAllAssetMaintenanceExpense({ pageable: PAGEABLE }).catch(() => ({ data: [] })),
    ])

    // Merge all expense categories into a unified AnyExpense[] list.
    // Each DTO has: amount, paidAt, branchId (optional).
    // SalaryExpenseReadDTO uses `period` instead of `paidAt` — normalise here.
    const salaryExpenses: AnyExpense[] = (salaryRes.data ?? []).map(
      (e: SalaryExpenseReadDTO) => ({
        amount: e.amount,
        paidAt: e.paidAt ?? e.period, // salary uses paidAt; period is the pay cycle date
        branchId: e.branchId,
      }),
    )

    const normaliseExpenses = <T extends { amount: number; paidAt: Date; branchId?: string }>(
      arr: T[],
    ): AnyExpense[] => arr.map((e) => ({ amount: e.amount, paidAt: e.paidAt, branchId: e.branchId }))

    const allExpenses: AnyExpense[] = [
      ...salaryExpenses,
      ...normaliseExpenses(utilityRes.data ?? [] as UtilityExpenseReadDTO[]),
      ...normaliseExpenses(suppliesRes.data ?? [] as SuppliesExpenseReadDTO[]),
      ...normaliseExpenses(otherRes.data ?? [] as OtherExpenseReadDTO[]),
      ...normaliseExpenses(assetRes.data ?? [] as AssetExpenseReadDTO[]),
      ...normaliseExpenses(assetMaintenanceRes.data ?? [] as AssetMaintenanceExpenseReadDTO[]),
    ]

    const transformed = transform(
      branchesRes.data ?? [],
      paymentsRes.data ?? [],
      paymentMethodsRes.data ?? [],
      subscriptionsRes.data ?? [],
      branchSummaryRes.data ?? [],
      allExpenses,
      filters,
    )

    // FALLBACK: use sample data when the database has no payments yet.
    // Remove this block once real payments exist.
    const hasRealPayments = (paymentsRes.data ?? []).length > 0
    if (!hasRealPayments) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.debug('[AnalyticsApi] No payments in database - returning SAMPLE_DATA')
      }
      return {
        ...SAMPLE_DATA,
        // Always use real branches for the branch selector
        branches: branchesRes.data?.length
          ? branchesRes.data.map((b) => ({
              name: b.name ?? 'Unknown',
              revenue: 0,
              expenses: 0,
              profit: 0,
              members: 0,
              growth: 0,
            }))
          : SAMPLE_DATA.branches,
        // Use real membership growth if available
        membershipGrowth: transformed.membershipGrowth.length
          ? transformed.membershipGrowth
          : SAMPLE_DATA.membershipGrowth,
      }
    }

    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug('[AnalyticsApi] Returning real API data with', paymentsRes.data?.length, 'payments')
    }
    return transformed
  },
}