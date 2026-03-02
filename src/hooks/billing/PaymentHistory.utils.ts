import { ZodError } from 'zod'

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
