import { useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { AlertTriangle, CalendarClock, CheckCircle2, Printer, XCircle } from 'lucide-react'

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
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import { amountDueCents, formatMoney } from '@/components/payment-components/billing-utils'

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

function printHtml(title: string, html: string) {
  const w = window.open('', '_blank', 'noopener,noreferrer')
  if (!w) return

  w.document.open()
  w.document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px; }
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; max-width: 720px; margin: 0 auto; }
    .muted { color: #6b7280; }
    .row { display:flex; justify-content:space-between; gap:12px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 0; border-top: 1px solid #f3f4f6; }
    td:last-child { text-align: right; font-weight: 600; }
    .total td { border-top: 1px solid #e5e7eb; font-size: 14px; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`)
  w.document.close()

  w.focus()
  // Give the browser a tick to layout before printing.
  setTimeout(() => {
    w.print()
    w.close()
  }, 50)
}

export function ReceiptDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment | null
  status: PaymentStatus | null
}) {
  const { open, onOpenChange, payment, status } = props
  const printRef = useRef<HTMLDivElement | null>(null)

  const lineItems = useMemo(() => {
    if (!payment) return []
    return [
      { label: 'Base', amount: formatMoney(payment.baseAmountCents, payment.currency) },
      { label: 'Convenience fee', amount: formatMoney(payment.convenienceFeeCents, payment.currency) },
      { label: 'Discount', amount: `-${formatMoney(payment.discountCents, payment.currency)}` },
      { label: 'Total', amount: formatMoney(amountDueCents(payment), payment.currency), total: true },
    ] as const
  }, [payment])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
          <DialogDescription>Preview a receipt using Shadcn components (printable).</DialogDescription>
        </DialogHeader>

        {!payment || !status ? (
          <div className="text-sm text-muted-foreground">No payment selected.</div>
        ) : (
          <div ref={printRef} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Gym Fitness</div>
                <div className="text-xs text-muted-foreground">Receipt ID: {payment.id}</div>
              </div>
              {statusBadge(status)}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-muted-foreground">Member</div>
                <div className="text-sm font-medium">{payment.memberName}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Due date</div>
                <div className="text-sm font-medium">{format(payment.dueDate, 'PP')}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Paid at</div>
                <div className="text-sm font-medium">
                  {payment.paidAt ? format(payment.paidAt, 'PPpp') : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Method / reference</div>
                <div className="text-sm font-medium">
                  {payment.method ?? '—'}
                  {payment.reference ? ` • ${payment.reference}` : ''}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="text-xs text-muted-foreground">Description</div>
            <div className="text-sm font-medium">{payment.description}</div>

            <div className="mt-4 rounded-md border">
              <Table>
                <TableBody>
                  {lineItems.map((li) => (
                    <TableRow key={li.label} className={'total' in li ? 'font-semibold' : undefined}>
                      <TableCell className="text-muted-foreground">{li.label}</TableCell>
                      <TableCell className="text-right">{li.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">Generated on {format(new Date(), 'PPpp')}</div>
          </div>
        )}

        <DialogFooter>
          {payment && status && (
            <Button
              variant="outline"
              onClick={() => {
                if (!printRef.current) return
                printHtml(`Receipt - ${payment.id}`, `<div class="card">${printRef.current.innerHTML}</div>`)
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
