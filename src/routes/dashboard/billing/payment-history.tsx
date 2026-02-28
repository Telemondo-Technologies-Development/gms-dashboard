import { createFileRoute } from '@tanstack/react-router'
import { PaymentHistoryTable } from '@/components/payment-components/PaymentHistoryManagementTable'

export const Route = createFileRoute('/dashboard/billing/payment-history')({
  component: PaymentHistoryRoute,
  errorComponent: ({ error }: { error: unknown }) => (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      {error instanceof Error ? error.message : 'Something went wrong'}
    </div>
  ),
  pendingComponent: () => (
    <div className="flex items-center justify-center rounded-md border p-6">
      <div className="text-sm text-muted-foreground">Loading payment history…</div>
    </div>
  ),
})

function PaymentHistoryRoute() {
  return <PaymentHistoryTable />
}
