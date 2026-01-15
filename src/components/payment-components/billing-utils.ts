import type { Payment, PaymentStatus } from '@/lib/schemas'

export type StatusFilter = 'all' | PaymentStatus

export function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amountCents / 100)
}

export function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function amountDueCents(payment: Payment) {
  return payment.baseAmountCents + payment.convenienceFeeCents - payment.discountCents
}

export function effectiveStatus(payment: Payment, now: Date): PaymentStatus {
  if (payment.paidAt) return 'paid'
  if (payment.status === 'failed') return 'failed'
  const due = startOfDay(payment.dueDate)
  const today = startOfDay(now)
  return due < today ? 'overdue' : 'upcoming'
}

export function isStatusFilter(value: string): value is StatusFilter {
  return value === 'all' || value === 'paid' || value === 'failed' || value === 'upcoming' || value === 'overdue'
}
