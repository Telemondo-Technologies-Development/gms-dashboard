import { ZodError } from 'zod'
import type { InvoiceTableDTOParsed, PaymentTableDTOParsed } from '@/types/payment/paymentSchemas'

export type PaymentHistoryDisplayStatus = 'paid' | 'failed' | 'pending'

/**
 * Format a ZodError into a concise string summary
 */
export function zodIssueSummary(error: ZodError, maxIssues: number = 3): string {
  const issues = error.issues.slice(0, Math.max(1, maxIssues))
  return issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join('.') : '(root)'
      return `${path}: ${issue.message}`
    })
    .join('; ')
}

/**
 * Map payment status based on payment and invoice data
 */
export function mapPaymentStatus(
  payment: { paidAt?: Date | string | null; failureReason?: string | null },
  invoice?: { status?: string; dueDate?: Date | string }
): 'paid' | 'failed' | 'overdue' | 'upcoming' {
  if (payment.paidAt) {
    return 'paid'
  }

  if (payment.failureReason) {
    return 'failed'
  }

  if (invoice) {
    if (invoice.status === 'OVERDUE') {
      return 'overdue'
    }
    if (invoice.status === 'ISSUED' && invoice.dueDate) {
      const dueDate = new Date(invoice.dueDate)
      const now = new Date()
      if (dueDate < now) {
        return 'overdue'
      }
      return 'upcoming'
    }
  }

  return 'upcoming'
}

/**
 * Format payment amount from cents to currency string
 */
export function formatPaymentAmount(amountCents: number, currency: string = 'PHP'): string {
  const amount = amountCents / 100
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function mapPaymentHistoryDisplayStatus(
  invoice: InvoiceTableDTOParsed,
  payment?: PaymentTableDTOParsed,
): PaymentHistoryDisplayStatus {
  if (payment?.paidAt || invoice.status === 'PAID') return 'paid'
  if (invoice.status === 'OVERDUE') return 'failed'
  if (payment?.failureReason && payment.failureReason.trim().length > 0) return 'failed'
  return 'pending'
}

export function summarizePaymentHistory(
  invoices: InvoiceTableDTOParsed[],
  paymentByInvoiceId: Map<string, PaymentTableDTOParsed>,
) {
  return invoices.reduce(
    (acc, invoice) => {
      const payment = paymentByInvoiceId.get(invoice.id)
      const status = mapPaymentHistoryDisplayStatus(invoice, payment)
      acc[status] += invoice.total
      return acc
    },
    {
      paid: 0,
      pending: 0,
      failed: 0,
    } as Record<PaymentHistoryDisplayStatus, number>,
  )
}
