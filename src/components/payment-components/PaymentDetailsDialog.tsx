import { format } from 'date-fns'
import { CheckCircle2, Clock, XCircle, Printer } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { PaymentTableDTOParsed, PaymentMethodTableDTOParsed } from '@/types/payment/paymentSchemas'

interface PaymentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentId?: string | null
  payment: PaymentTableDTOParsed | null
  loading?: boolean
  error?: string
  paymentMethodMap: Map<string, PaymentMethodTableDTOParsed>
  onPrintReceipt?: (payment: PaymentTableDTOParsed) => void
}

type DisplayStatus = 'paid' | 'failed' | 'pending'

function formatCurrency(amount: number, currency: string = 'PHP') {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

function mapDisplayStatus(payment: PaymentTableDTOParsed): DisplayStatus {
  if (payment.paidAt) return 'paid'
  if (payment.failureReason && payment.failureReason.trim().length > 0) return 'failed'
  return 'pending'
}

function statusBadge(status: DisplayStatus) {
  switch (status) {
    case 'paid':
      return (
        <Badge className="gap-1" variant="default">
          <CheckCircle2 className="h-3.5 w-3.5" />Paid
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="gap-1" variant="destructive">
          <XCircle className="h-3.5 w-3.5" />Failed
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="gap-1" variant="outline">
          <Clock className="h-3.5 w-3.5" />Pending
        </Badge>
      )
  }
}

export function PaymentDetailsDialog({
  open,
  onOpenChange,
  paymentId,
  payment,
  loading,
  error,
  paymentMethodMap,
  onPrintReceipt,
}: PaymentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Payment details</DialogTitle>
          <DialogDescription>
            {loading
              ? 'Loading payment…'
              : payment
                ? 'Details from PaymentTableDTO.'
                : paymentId
                  ? 'Payment not found.'
                  : 'No payment selected.'}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-md border p-6 text-sm text-muted-foreground">Loading payment details…</div>
        ) : payment ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-muted-foreground">Payment ID</div>
                <div className="mt-1 break-all font-mono text-xs">{payment.id}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Invoice ID</div>
                <div className="mt-1 break-all font-mono text-xs">{payment.invoiceId}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Payment Method</div>
                <div className="mt-1 text-sm">
                  {paymentMethodMap.get(payment.paymentMethodId)?.name ?? '—'}
                </div>
                <div className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  {payment.paymentMethodId}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Amount</div>
                <div className="mt-1 text-sm font-semibold">
                  {formatCurrency(payment.amount, 'PHP')}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-muted-foreground">API Status</div>
                <div className="mt-1 font-mono text-xs">{payment.status}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Display Status</div>
                <div className="mt-1">{statusBadge(mapDisplayStatus(payment))}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Paid At</div>
                <div className="mt-1 text-sm">
                  {payment.paidAt ? format(new Date(payment.paidAt), 'PPpp') : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Failure Reason</div>
                <div className="mt-1 text-sm">{payment.failureReason ?? '—'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Select a row to view details.</div>
        )}

        <DialogFooter className="gap-4 sm:gap-4">
           {payment && onPrintReceipt && (
            <Button variant="default" onClick={() => onPrintReceipt(payment)}>
              <Printer className="mr-2 h-4 w-4" />
              Receipt
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}