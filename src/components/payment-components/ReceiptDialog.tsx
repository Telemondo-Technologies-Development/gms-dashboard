import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { format } from 'date-fns'
import { AlertTriangle, Printer } from 'lucide-react'

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

interface ReceiptProps {
  payment: PaymentTableDTOParsed
  paymentMethod?: PaymentMethodTableDTOParsed
} 

export function Receipt({ payment, paymentMethod }: ReceiptProps) {
  return (
    <div className="w-full bg-white p-8 text-black" id="receipt-content">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wider">Official Receipt</h1>
        <p className="text-sm text-muted-foreground">Gym Management System</p>
      </div>

      <div className="mb-6 flex justify-between border-b pb-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">Date</p>
          <p>{payment.paidAt ? format(new Date(payment.paidAt), 'PPP') : '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Receipt #</p>
          <p className="font-mono">{payment.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="mb-8 space-y-2">
        <div className="flex justify-between">
          <span>Payment Method</span>
          <span>{paymentMethod?.name ?? payment.paymentMethodId}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
          <span>Total Amount</span>
          <span>
            {new Intl.NumberFormat('en-PH', {
              style: 'currency',
              currency: 'PHP',
            }).format(payment.amount)}
          </span>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-12 pt-4 border-t">
        <p>Thank you for your business!</p>
        <p>This is a computer generated receipt.</p>
      </div>
    </div>
  )
}

interface ReceiptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentId?: string | null
  payment: PaymentTableDTOParsed | null
  loading?: boolean
  error?: string
  paymentMethodMap: Map<string, PaymentMethodTableDTOParsed>
}

export function ReceiptDialog({
  open,
  onOpenChange,
  paymentId,
  payment,
  loading,
  error,
  paymentMethodMap,
}: ReceiptDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Receipt-${payment?.id}`,
  })

  const method = payment ? paymentMethodMap.get(payment.paymentMethodId) : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Print Receipt</DialogTitle>
          <DialogDescription>
            {payment ? (
              <>Preview of the receipt for payment {payment.id}</>
            ) : loading ? (
              <>Loading payment…</>
            ) : paymentId ? (
              <>Payment not found.</>
            ) : (
              <>No payment selected.</>
            )}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-md border p-6 text-sm text-muted-foreground">Loading receipt preview…</div>
        ) : payment ? (
          <>
            <div className="rounded-md border bg-gray-50 p-4">
              <div ref={contentRef} className="mx-auto max-w-75 bg-white shadow-sm">
                <Receipt payment={payment} paymentMethod={method} />
              </div>
            </div>

            <Separator />
          </>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => handlePrint && handlePrint()} disabled={!payment || !!loading || !!error}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
