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
import type { PaymentTableDTOParsed, PaymentMethodTableDTOParsed } from '@/types/payment/paymentSchemas'

interface ReceiptProps {
  payment: PaymentTableDTOParsed
  paymentMethod?: PaymentMethodTableDTOParsed
  memberName?: string
} 

export function Receipt({ payment, paymentMethod, memberName }: ReceiptProps) {
  return (
    <div className="w-full  bg-white p-8 text-black" id="receipt-content">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold uppercase tracking-wider">Official Receipt</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Gym Fitness Inc.</p>
      </div>

      <div className="mb-8 flex justify-between ">
        <div>
           <div className="mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date Issued</p>
              <p className="text-sm font-medium">{payment.paidAt ? format(new Date(payment.paidAt), 'MMMM d, yyyy') : '—'}</p>
              <p className="text-xs text-muted-foreground">{payment.paidAt ? format(new Date(payment.paidAt), 'h:mm a') : ''}</p>
           </div>
           
           <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Billed To</p>
              <p className="text-sm font-bold uppercase">{memberName || 'Guest / Walk-in'}</p>
           </div>
        </div>
        <div className="text-right">
          <div className="mb-2">
             <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Receipt No.</p>
             <p className="font-mono text-sm">{payment.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className=" p-0 overflow-hidden">
             <div className=" px-4 py-2  flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                 <span>Description</span>
                 <span>Amount</span>
             </div>
             <div className="px-4 py-3 flex justify-between text-sm">
                 <div>
                    <span className="font-medium block">Membership / Service Payment</span>
                    <span className="text-xs text-muted-foreground block mt-0.5">Via {paymentMethod?.name ?? 'Unknown Method'}</span>
                 </div>
                 <span className="font-mono">
                    {new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2 }).format(payment.amount)}
                 </span>
             </div>
        </div>

        <div className="flex justify-end mt-4">
            <div className="w-1/2">
                <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2 }).format(payment.amount)}</span>
                </div>
                <div className="flex justify-between py-1 text-sm border-b pb-2 mb-2">
                    <span className="text-muted-foreground">Tax (0%)</span>
                    <span>0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                        {new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP',
                        }).format(payment.amount)}
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-muted-foreground mt-12 pt-4 border-t uppercase tracking-widest">
        <p>Thank you for your business!</p>
        <p className="mt-1">This is a system generated receipt.</p>
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
  memberName?: string
}

export function ReceiptDialog({
  open,
  onOpenChange,
  paymentId,
  payment,
  loading,
  error,
  paymentMethodMap,
  memberName,
}: ReceiptDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Receipt-${payment?.id}`,
  })

  const method = payment ? paymentMethodMap.get(payment.paymentMethodId) : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Print Receipt</DialogTitle>
          <DialogDescription>
            {payment ? (
              <>Preview of the receipt for payment <span className="font-mono text-xs">{payment.id.slice(0, 8)}</span></>
            ) : loading ? (
              <>Loading payment…</>
            ) : paymentId ? (
              <>Payment not found.</>
            ) : (
              <>No payment selected.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {error ? (
            <div className="border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-2 text-muted-foreground">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
              <p className="text-sm">Loading receipt preview…</p>
            </div>
          ) : payment ? (
            <>
              <div className="bg-gray-50/50 p-4">
                <div ref={contentRef} className="mx-auto max-w-[320px] bg-white shadow-sm border">
                  <Receipt payment={payment} paymentMethod={method} memberName={memberName}/>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => handlePrint && handlePrint()} disabled={!payment || !!loading || !!error}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
