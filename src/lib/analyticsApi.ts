import type { AnalyticsData } from '@/lib/analytics-data'
import { paymentApi, getAuthenticatedApi } from '@/lib/api-client'
import { BranchApi, MemberSubscriptionApi } from '@/api/generated/apis'
import type {
  PaymentTableDTO,
  PaymentMethodTableDTO,
  BranchTableDTO,
  MemberSubscriptionTableDTO,
} from '@/api/generated/models'

export type AnalyticsFilters = {
  branch?: string
  startDate?: string
  endDate?: string
  timeRange?: 'monthly' | 'quarterly' | 'yearly'
}

// Sample data — used as fallback when API returns no records yet
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

// Transform helpers

function getMonthLabel(date: Date): string {
  return date.toLocaleString('default', { month: 'short' })
}

function sumAmount(arr: PaymentTableDTO[]): number {
  return arr.reduce((s, p) => s + (p.amount ?? 0), 0)
}

function pctChange(curr: number, prev: number): number {
  return prev > 0 ? parseFloat(((curr - prev) / prev * 100).toFixed(1)) : 0
}

function transform(
  branches: BranchTableDTO[],
  payments: PaymentTableDTO[],
  paymentMethods: PaymentMethodTableDTO[],
  subscriptions: MemberSubscriptionTableDTO[],
  filters: AnalyticsFilters,
): AnalyticsData {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const methodNameMap: Record<string, string> = {}
  for (const m of paymentMethods) {
    if (m.id && m.name) methodNameMap[m.id] = m.name
  }

  let successfulPayments = payments.filter(
    (p) => p.status === 'FULL' || p.status === 'PARTIAL',
  )

  if (filters.startDate) {
    const start = new Date(filters.startDate)
    successfulPayments = successfulPayments.filter(
      p => p.paidAt && new Date(p.paidAt) >= start
    )
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate)
    successfulPayments = successfulPayments.filter(
      p => p.paidAt && new Date(p.paidAt) <= end
    )
  }

  const revenueByMonth: Record<string, number> = {}
  for (const payment of successfulPayments) {
    if (!payment.paidAt) continue
    const label = getMonthLabel(new Date(payment.paidAt))
    revenueByMonth[label] = (revenueByMonth[label] ?? 0) + (payment.amount ?? 0)
  }
  const revenueExpense = Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue,
    expense: 0,
  }))

  const amountByMethodId: Record<string, number> = {}
  for (const payment of successfulPayments) {
    if (!payment.paymentMethodId) continue
    amountByMethodId[payment.paymentMethodId] =
      (amountByMethodId[payment.paymentMethodId] ?? 0) + (payment.amount ?? 0)
  }
  const totalAmount = Object.values(amountByMethodId).reduce((s, v) => s + v, 0)
  const paymentMethods_ = Object.entries(amountByMethodId).map(([id, amount]) => ({
    method: methodNameMap[id] ?? id,
    amount,
    percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
  }))

  const monthlyPayments = successfulPayments.filter(p => {
    if (!p.paidAt) return false
    const d = new Date(p.paidAt)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  const prevMonthPayments = successfulPayments.filter(p => {
    if (!p.paidAt) return false
    const d = new Date(p.paidAt)
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    return d.getMonth() === prevMonth && d.getFullYear() === prevYear
  })
  const annualPayments = successfulPayments.filter(
    p => p.paidAt && new Date(p.paidAt).getFullYear() === currentYear
  )
  const prevYearPayments = successfulPayments.filter(
    p => p.paidAt && new Date(p.paidAt).getFullYear() === currentYear - 1
  )

  const monthlyCurrent = sumAmount(monthlyPayments)
  const monthlyPrevious = sumAmount(prevMonthPayments)
  const annualCurrent = sumAmount(annualPayments)
  const annualPrevious = sumAmount(prevYearPayments)

  const filteredSubscriptions = filters.branch && filters.branch !== 'all'
    ? subscriptions.filter(sub => {
        const selectedBranch = branches.find(b => b.name === filters.branch)
        return selectedBranch ? sub.branchId === selectedBranch.id : true
      })
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

  const branchData = branches.map(b => ({
    name: b.name ?? 'Unknown',
    revenue: 0,
    expenses: 0,
    profit: 0,
    members: 0,
    growth: 0,
  }))

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
    paymentMethods: paymentMethods_,
    branches: branchData,
  }
}

// Public API

export const analyticsApi = {
  getAnalytics: async (filters: AnalyticsFilters): Promise<AnalyticsData> => {
    const branchApi = getAuthenticatedApi(BranchApi)
    const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)

    const PAGEABLE = { page: 0, size: 9999 }

    const [branchesRes, paymentsRes, paymentMethodsRes, subscriptionsRes] = await Promise.all([
      branchApi.getAllBranches({ pageable: PAGEABLE }),
      paymentApi.getAllPayments({ pageable: PAGEABLE }),
      paymentApi.getAllPaymentMethods({ pageable: PAGEABLE }),
      memberSubscriptionApi.getAllMemberSubscriptions({ pageable: PAGEABLE }),
    ])

    const transformed = transform(
      branchesRes.data ?? [],
      paymentsRes.data ?? [],
      paymentMethodsRes.data ?? [],
      subscriptionsRes.data ?? [],
      filters,
    )

    // FALLBACK: sample data for display.
    // Remove this block once real payments exist in the database.
    const hasRealData = (paymentsRes.data ?? []).length > 0
    if (!hasRealData) {
      return {
        ...SAMPLE_DATA,
        // Always use real branches from the API for the branch selector
        branches: branchesRes.data?.length
          ? branchesRes.data.map(b => ({
              name: b.name ?? 'Unknown',
              revenue: 0,
              expenses: 0,
              profit: 0,
              members: 0,
              growth: 0,
            }))
          : SAMPLE_DATA.branches,
          
        membershipGrowth: transformed.membershipGrowth.length
          ? transformed.membershipGrowth
          : SAMPLE_DATA.membershipGrowth,
      }
    }

    return transformed
  },
}