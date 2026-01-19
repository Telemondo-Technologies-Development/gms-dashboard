import { useState } from 'react'
import { format } from 'date-fns'
import { AlertTriangle, CalendarClock, CheckCircle2, Receipt, XCircle } from 'lucide-react'

import type { Payment, PaymentStatus } from '@/lib/schemas'

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
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { amountDueCents, effectiveStatus, formatMoney } from '@/components/payment-components/billing-utils'
import { ReceiptDialog } from '@/components/payment-components/ReceiptDialog'

function statusBadge(status: PaymentStatus) {
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
    case 'overdue':
      return (
        <Badge className="gap-1" variant="destructive">
          <AlertTriangle className="h-3.5 w-3.5" />Overdue
        </Badge>
      )
    case 'upcoming':
      return (
        <Badge className="gap-1" variant="outline">
          <CalendarClock className="h-3.5 w-3.5" />Upcoming
        </Badge>
      )
  }
}

function parseMoneyToCents(value: string) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 100)
}

export function PaymentDetailsDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment | null
  now: Date
  onUpdate: (patch: Partial<Payment>) => void
  onMarkPaid: () => void
}) {
  const { open, onOpenChange, payment, now, onUpdate, onMarkPaid } = props

  const [feeInput, setFeeInput] = useState('')
  const [discountInput, setDiscountInput] = useState('')
  const [receiptOpen, setReceiptOpen] = useState(false)

  const st = payment ? effectiveStatus(payment, now) : null

  const resetInputs = () => {
    setFeeInput('')
    setDiscountInput('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          resetInputs()
          setReceiptOpen(false)
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment details</DialogTitle>
          <DialogDescription>View transaction info, generate receipts, and apply fees/discounts.</DialogDescription>
        </DialogHeader>

        {!payment || !st ? (
          <div className="text-sm text-muted-foreground">No payment selected.</div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Member</div>
                <div className="text-lg font-semibold">{payment.memberName}</div>
                <div className="text-sm">{payment.description}</div>
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(st)}
                <Button
                  variant="outline"
                  onClick={() => {
                    setReceiptOpen(true)
                  }}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  View receipt
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Due date</div>
                <div className="text-sm font-medium">{format(payment.dueDate, 'PP')}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Paid at</div>
                <div className="text-sm font-medium">{payment.paidAt ? format(payment.paidAt, 'PPpp') : '—'}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Cycle</div>
                <div className="text-sm font-medium">{payment.cycle}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Method / reference</div>
                <div className="text-sm font-medium">
                  {payment.method ?? '—'}
                  {payment.reference ? ` • ${payment.reference}` : ''}
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="mb-3 text-sm font-medium">Amount</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-muted-foreground">Base</div>
                  <div className="text-sm font-semibold">{formatMoney(payment.baseAmountCents, payment.currency)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Convenience fee</div>
                  <div className="text-sm font-semibold">{formatMoney(payment.convenienceFeeCents, payment.currency)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Discount</div>
                  <div className="text-sm font-semibold">-{formatMoney(payment.discountCents, payment.currency)}</div>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-lg font-semibold">{formatMoney(amountDueCents(payment), payment.currency)}</div>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">Fees & discounts</div>
                  <div className="text-xs text-muted-foreground">Apply convenience fees or discounts for this payment.</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const feeCents = feeInput ? parseMoneyToCents(feeInput) : payment.convenienceFeeCents
                    const discountCents = discountInput ? parseMoneyToCents(discountInput) : payment.discountCents
                    onUpdate({ convenienceFeeCents: feeCents, discountCents })
                    resetInputs()
                  }}
                >
                  Apply
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">Convenience fee ({payment.currency})</div>
                  <Input
                    inputMode="decimal"
                    placeholder={(payment.convenienceFeeCents / 100).toFixed(2)}
                    value={feeInput}
                    onChange={(e) => setFeeInput(e.target.value)}
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">Discount ({payment.currency})</div>
                  <Input
                    inputMode="decimal"
                    placeholder={(payment.discountCents / 100).toFixed(2)}
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {payment && st && st !== 'paid' && <Button onClick={onMarkPaid}>Mark as paid</Button>}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      <ReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        payment={payment}
        status={st}
      />
    </Dialog>
  )
}
