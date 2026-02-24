import { format } from 'date-fns'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Calendar,
  CreditCard,
  FileText,
  User,
  Info,
  AlertTriangle 
} from 'lucide-react'
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
import { Card, CardContent } from '@/components/ui/card'
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
  memberName?: string
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
        <Badge className="gap-1.5 px-2.5 py-0.5" variant="default">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Paid
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="gap-1.5 px-2.5 py-0.5" variant="destructive">
          <XCircle className="h-3.5 w-3.5" />
          Failed
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="gap-1.5 px-2.5 py-0.5 bg-orange-500 hover:bg-orange-600 border-transparent text-white" variant="outline">
          <Clock className="h-3.5 w-3.5" />
          Pending
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
  memberName,
}: PaymentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Payment Details</DialogTitle>
          <DialogDescription>
            Reference ID: <span className="font-mono text-xs">{payment?.id ?? '—'}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              {error}
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-2 text-muted-foreground">
               <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
               <p className="text-sm">Loading payment details...</p>
            </div>
          ) : payment ? (
            <div className="space-y-6 pb-4">
              {/* Status Card */}
            <Card className="bg-muted/10 border-none shadow-sm">
                <CardContent className="p-4 flex flex-row items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground font-medium">Payment Status</span>
                        <div className="mt-1">{statusBadge(mapDisplayStatus(payment))}</div>
                    </div>
                    <div className="text-right">
                         <span className="text-sm text-muted-foreground font-medium">Total Amount</span>
                         <div className="text-2xl font-bold tracking-tight text-primary">
                             {formatCurrency(payment.amount, 'PHP')}
                         </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                     <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" /> Member Information
                     </h4>
                     <div className="rounded-lg border p-3 bg-card space-y-3">
                         <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Payer Name</p>
                            <p className="font-medium text-sm mt-0.5">{memberName || '—'}</p>
                         </div>
                         <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Invoice ID</p>
                            <p className="font-mono text-xs mt-0.5 break-all text-muted-foreground">{payment.invoiceId}</p>
                         </div>
                     </div>
                </div>

                <div className="space-y-4">
                     <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-4 w-4" /> Transaction Details
                     </h4>
                     <div className="rounded-lg border p-3 bg-card space-y-3">
                         <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Payment Method</p>
                            <p className="font-medium text-sm mt-0.5 flex items-center gap-2">
                               {paymentMethodMap.get(payment.paymentMethodId)?.name ?? 'Unknown Method'}
                            </p>
                         </div>
                         <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Paid Date</p>
                            <p className="font-medium text-sm mt-0.5 flex items-center gap-2">
                               <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                               {payment.paidAt ? format(new Date(payment.paidAt), 'MMM d, yyyy h:mm a') : '—'}
                            </p>
                         </div>
                     </div>
                </div>
            </div>

            {payment.failureReason && (
                 <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <div className="flex items-start gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold">Payment Failed</p>
                            <p className="text-sm opacity-90 mt-1">{payment.failureReason}</p>
                        </div>
                    </div>
                 </div>
            )}
            
            <Separator />
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                <span>Recorded on {payment.paidAt ? format(new Date(payment.paidAt), 'PPpp') : '—'}</span>
            </div>

          </div>
          ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
             <FileText className="h-8 w-8 opacity-20 mb-2" />
             <p className="text-sm">No payment selected.</p>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}