/**
 * Dashboard Utility Functions
 * Shared utilities for dashboard metrics and calculations
 */

import { differenceInDays, isAfter, isBefore, startOfMonth, endOfMonth } from 'date-fns'

export interface Member {
  id: string
  name: string
  membershipType: string
  startDate: Date
  endDate: Date
  status: string
  branch: string
  monthlyFee: number
  amountPaid: number
}

export interface Asset {
  id: string
  name: string
  status: string
  condition: string
  branch: string
  price: number
}

export interface Expense {
  id: string
  type: string
  amount: number
  date: Date
  branch: string
}

export interface BranchMetrics {
  name: string
  activeMembers: number
  revenue: number
  expenses: number
  assets: number
}

/**
 * Get active members count
 */
export function getActiveMembersCount(members: Member[]): number {
  return members.filter((m) => m.status === 'Active').length
}

/**
 * Get expired memberships count
 */
export function getExpiredMembershipsCount(members: Member[]): number {
  const today = new Date()
  return members.filter((m) => isBefore(m.endDate, today) && m.status !== 'Expired').length
}

/**
 * Get memberships expiring soon (within 7 days)
 */
export function getExpiringSoonCount(members: Member[]): number {
  const today = new Date()
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  return members.filter((m) => {
    return (
      m.status === 'Active' &&
      isAfter(m.endDate, today) &&
      isBefore(m.endDate, sevenDaysFromNow)
    )
  }).length
}

/**
 * Calculate total revenue for current month
 */
export function getCurrentMonthRevenue(members: Member[]): number {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  return members
    .filter((m) => {
      return isAfter(m.startDate, monthStart) || isAfter(m.endDate, monthStart)
    })
    .reduce((sum, m) => sum + m.amountPaid, 0)
}

/**
 * Calculate outstanding dues
 */
export function getOutstandingDues(members: Member[]): number {
  return members
    .filter((m) => m.status === 'Active')
    .reduce((sum, m) => {
      const due = m.monthlyFee - m.amountPaid
      return sum + (due > 0 ? due : 0)
    }, 0)
}

/**
 * Get asset status summary
 */
export function getAssetStatusSummary(assets: Asset[]) {
  return {
    operational: assets.filter((a) => a.status === 'Operational').length,
    needsRepair: assets.filter((a) => a.status === 'Needs Repair').length,
    underMaintenance: assets.filter((a) => a.status === 'Under Maintenance').length,
    total: assets.length,
  }
}

/**
 * Calculate total expenses for current month
 */
export function getCurrentMonthExpenses(expenses: Expense[]): number {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  return expenses
    .filter((e) => isAfter(e.date, monthStart) && isBefore(e.date, monthEnd))
    .reduce((sum, e) => sum + e.amount, 0)
}

/**
 * Get expense breakdown by type
 */
export function getExpenseBreakdown(expenses: Expense[]) {
  const breakdown: Record<string, number> = {}

  expenses.forEach((e) => {
    if (!breakdown[e.type]) {
      breakdown[e.type] = 0
    }
    breakdown[e.type] += e.amount
  })

  return breakdown
}

/**
 * Calculate branch performance metrics
 */
export function getBranchMetrics(
  branchName: string,
  members: Member[],
  assets: Asset[],
  expenses: Expense[]
): BranchMetrics {
  const branchMembers = members.filter((m) => m.branch === branchName)
  const branchAssets = assets.filter((a) => a.branch === branchName)
  const branchExpenses = expenses.filter((e) => e.branch === branchName)

  return {
    name: branchName,
    activeMembers: branchMembers.filter((m) => m.status === 'Active').length,
    revenue: branchMembers.reduce((sum, m) => sum + m.amountPaid, 0),
    expenses: branchExpenses.reduce((sum, e) => sum + e.amount, 0),
    assets: branchAssets.length,
  }
}

/**
 * Get all branch metrics
 */
export function getAllBranchMetrics(
  branches: string[],
  members: Member[],
  assets: Asset[],
  expenses: Expense[]
): BranchMetrics[] {
  return branches.map((branch) => getBranchMetrics(branch, members, assets, expenses))
}

/**
 * Calculate growth percentage
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Get members with outstanding dues
 */
export function getMembersWithDues(members: Member[]): Member[] {
  return members.filter((m) => {
    const due = m.monthlyFee - m.amountPaid
    return m.status === 'Active' && due > 0
  })
}
