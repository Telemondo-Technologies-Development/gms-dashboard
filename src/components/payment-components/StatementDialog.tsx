import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Printer } from 'lucide-react'

import type { Payment } from '@/lib/schemas'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import {
  amountDueCents,
  effectiveStatus,
  endOfDay,
  formatMoney,
  startOfDay,
} from '@/components/payment-components/billing-utils'

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
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; max-width: 900px; margin: 0 auto; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 10px 8px; border-top: 1px solid #f3f4f6; font-size: 14px; }
    th { text-align: left; color: #6b7280; font-weight: 600; }
    .muted { color: #6b7280; }
    .totals { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 16px; }
    .k { color: #6b7280; font-size: 12px; }
    .v { font-weight: 700; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`)
  w.document.close()

  w.focus()
  setTimeout(() => {
    w.print()
    w.close()
  }, 50)
}

export function StatementDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: Array<{ id: string; name: string }>
  payments: Payment[]
  now: Date
}) {
  const { open, onOpenChange, members, payments, now } = props

  const [memberId, setMemberId] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const statementData = useMemo(() => {
    const from = fromDate ? startOfDay(new Date(fromDate)) : null
    const to = toDate ? endOfDay(new Date(toDate)) : null
    const memberDisplayName =
      memberId === 'all'
        ? 'All members'
        : members.find((m) => m.id === memberId)?.name ?? 'Member'

    const rows = payments
      .filter((p) => (memberId === 'all' ? true : p.memberId === memberId))
      .filter((p) => {
        if (from && p.dueDate < from) return false
        if (to && p.dueDate > to) return false
        return true
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

    const currency = rows[0]?.currency ?? 'PHP'
    const rangeLabel = `${from ? format(from, 'PP') : 'Any'} → ${to ? format(to, 'PP') : 'Any'}`

    const totalsCents = rows.reduce(
      (acc, p) => {
        const st = effectiveStatus(p, now)
        const amt = amountDueCents(p)
        acc.total += amt
        if (st === 'paid') acc.paid += amt
        if (st === 'overdue' || st === 'upcoming' || st === 'failed') acc.open += amt
        return acc
      },
      { total: 0, paid: 0, open: 0 },
    )

    return {
      memberDisplayName,
      rangeLabel,
      currency,
      rows: rows.map((p) => {
        const st = effectiveStatus(p, now)
        return {
          due: format(p.dueDate, 'PP'),
          description: p.description,
          status: st.toUpperCase(),
          amount: formatMoney(amountDueCents(p), p.currency),
        }
      }),
      totals: {
        total: formatMoney(totalsCents.total, currency),
        paid: formatMoney(totalsCents.paid, currency),
        open: formatMoney(totalsCents.open, currency),
      },
    }
  }, [fromDate, memberId, members, now, payments, toDate])

  const canPrint = statementData.rows.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Generate billing statement</DialogTitle>
          <DialogDescription>Preview a statement using Shadcn components and print it.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="All members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All members</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="mb-1 text-xs text-muted-foreground">From</div>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <div className="mb-1 text-xs text-muted-foreground">To</div>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="sm:flex sm:items-end">
            <Button
              className="w-full"
              variant="outline"
              disabled={!canPrint}
              onClick={() => {
                const rowsHtml = statementData.rows
                  .map(
                    (r) => `
                      <tr>
                        <td>${r.due}</td>
                        <td>${r.description}</td>
                        <td>${r.status}</td>
                        <td style="text-align:right">${r.amount}</td>
                      </tr>
                    `,
                  )
                  .join('')

                const html = `
                  <div class="card">
                    <h1 style="margin:0">Billing Statement</h1>
                    <p class="muted" style="margin:6px 0 0"><strong>Member:</strong> ${statementData.memberDisplayName}</p>
                    <p class="muted" style="margin:6px 0 0"><strong>Range:</strong> ${statementData.rangeLabel}</p>
                    <p class="muted" style="margin:6px 0 0"><strong>Currency:</strong> ${statementData.currency}</p>
                    <p class="muted" style="margin:6px 0 0"><strong>Generated:</strong> ${format(new Date(), 'PPpp')}</p>

                    <div class="totals">
                      <div><div class="k">Total</div><div class="v">${statementData.totals.total}</div></div>
                      <div><div class="k">Paid</div><div class="v">${statementData.totals.paid}</div></div>
                      <div><div class="k">Open</div><div class="v">${statementData.totals.open}</div></div>
                    </div>

                    <table>
                      <thead>
                        <tr>
                          <th style="width: 20%">Due</th>
                          <th>Description</th>
                          <th style="width: 18%">Status</th>
                          <th style="width: 18%; text-align:right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${rowsHtml || '<tr><td colspan="4" class="muted">No payments in this range.</td></tr>'}
                      </tbody>
                    </table>
                  </div>
                `

                printHtml(
                  `Statement - ${memberId === 'all' ? 'all' : memberId}`,
                  html,
                )
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium">Preview</div>
            <div className="text-xs text-muted-foreground">
              {statementData.memberDisplayName} • {statementData.rangeLabel}
            </div>
          </div>

          {statementData.rows.length === 0 ? (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              No payments in this range.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[22%]">Due</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[18%]">Status</TableHead>
                    <TableHead className="w-[18%] text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statementData.rows.map((r, idx) => (
                    <TableRow key={`${r.due}:${idx}`}>
                      <TableCell>{r.due}</TableCell>
                      <TableCell>{r.description}</TableCell>
                      <TableCell className="text-muted-foreground">{r.status}</TableCell>
                      <TableCell className="text-right font-medium">{r.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-sm font-semibold">{statementData.totals.total}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Paid</div>
              <div className="text-sm font-semibold">{statementData.totals.paid}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground">Open</div>
              <div className="text-sm font-semibold">{statementData.totals.open}</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
