import { createFileRoute } from '@tanstack/react-router'
import { PaymentHistoryTable } from '@/components/payment-components/PaymentHistoryManagementTable'
import { PaymentHistorySummary } from '@/components/payment-components/PaymentHistorySummary'
import { usePaymentHistoryDataQuery } from '@/hooks/billing/usePaymentHistoryLookups'
import { summarizePaymentHistory } from '@/hooks/billing/PaymentHistory.utils'

export const Route = createFileRoute('/dashboard/billing/payment-history')({
  component: PaymentHistoryRoute,
  errorComponent: ({ error }: { error: unknown }) => (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-sm text-destructive">
      {error instanceof Error ? error.message : 'Something went wrong'}
    </div>
  ),
  pendingComponent: () => (
    <div className="flex items-center justify-center rounded-md border border-muted/30 bg-muted/5 p-2">
      <div className="text-sm text-muted-foreground">Loading payment history…</div>
    </div>
  ),
})

function PaymentHistoryRoute() {
  const { invoices, paymentByInvoiceId, paymentsError } = usePaymentHistoryDataQuery()
  const totals = summarizePaymentHistory(invoices, paymentByInvoiceId)

  return (
    <div className="flex flex-col gap-3">
      {!paymentsError ? (
        <PaymentHistorySummary totals={totals} transactionCount={invoices.length} />
      ) : null}
      <PaymentHistoryTable />
    </div>
  )
}
