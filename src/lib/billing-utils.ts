import { addDays, addWeeks, addMonths, addYears } from 'date-fns'
import type { SubscriptionAvailedTableDTOIntervalsEnum } from '@/api/generated/models/SubscriptionAvailedTableDTO'

export type BillingInterval = SubscriptionAvailedTableDTOIntervalsEnum

/**
 * Given a billing start date and a subscription cycle definition,
 * returns the due date for the NEXT invoice period.
 *
 * Examples:
 *   startDate = Mar 3, WEEKLY  x1 => Mar 10
 *   startDate = Mar 3, MONTHLY x1 => Apr 3
 *   startDate = Mar 3, DAILY   x7 => Mar 10  (same as weekly but explicit)
 */
export function calculateNextDueDate(
  fromDate: Date,
  intervals: BillingInterval,
  intervalCount: number,
): Date {
  const count = intervalCount > 0 ? intervalCount : 1
  switch (intervals) {
    case 'DAILY':   return addDays(fromDate, count)
    case 'WEEKLY':  return addWeeks(fromDate, count)
    case 'MONTHLY': return addMonths(fromDate, count)
    case 'YEARLY':  return addYears(fromDate, count)
    default:        return addMonths(fromDate, count)
  }
}

/**
 * Formats a billing cycle for display.
 *   (1, 'WEEKLY')  => "1 Week"
 *   (2, 'MONTHLY') => "2 Months"
 */
export function formatBillingCycle(intervalCount: number, intervals: BillingInterval): string {
  const singularMap: Record<BillingInterval, string> = {
    MINUTES: 'Minute',
    DAILY: 'Day',
    WEEKLY: 'Week',
    MONTHLY: 'Month',
    YEARLY: 'Year',
  }
  const unit = singularMap[intervals] ?? intervals
  return intervalCount === 1 ? `${intervalCount} ${unit}` : `${intervalCount} ${unit}s`
}

/**
 * Resolves the correct PaymentPostDTO status based on amount paid vs invoice total.
 *
 *   amount <= 0               => PENDING  (no payment yet)
 *   0 < amount < invoiceTotal => PARTIAL
 *   amount >= invoiceTotal    => FULL
 */
export function resolvePaymentStatus(
  amountPaid: number,
  invoiceSubtotal: number,
): 'FULL' | 'PARTIAL' | 'PENDING' {
  if (amountPaid <= 0) return 'PENDING'
  if (amountPaid >= invoiceSubtotal) return 'FULL'
  return 'PARTIAL'
}
