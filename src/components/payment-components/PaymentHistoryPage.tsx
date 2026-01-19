import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  FileText,
  Receipt,
  Search,
  XCircle,
} from 'lucide-react'

import { mockPayments, mockSubscriptions } from '@/lib/mock-payments'
import type { BillingSubscription, Payment, PaymentStatus } from '@/lib/schemas'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PaymentDetailsDialog } from '@/components/payment-components/PaymentDetailsDialog'
import { StatementDialog } from '@/components/payment-components/StatementDialog'
import {
  amountDueCents,
  effectiveStatus,
  formatMoney,
  isStatusFilter,
  type StatusFilter,
  startOfDay,
  endOfDay,
} from '@/components/payment-components/billing-utils'

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

export function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>(() => mockPayments)
  const [subscriptions, setSubscriptions] = useState<BillingSubscription[]>(() => mockSubscriptions)

  const [query, setQuery] = useState('')
  const [memberId, setMemberId] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [statementOpen, setStatementOpen] = useState(false)

  const now = new Date()

  const members = useMemo(() => {
    const entries = new Map<string, string>()
    for (const p of payments) entries.set(p.memberId, p.memberName)
    return Array.from(entries.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [payments])

  const selectedPayment = selectedPaymentId
    ? payments.find((p) => p.id === selectedPaymentId) ?? null
    : null

  const filteredPayments = useMemo(() => {
    const q = query.trim().toLowerCase()
    const from = fromDate ? startOfDay(new Date(fromDate)) : null
    const to = toDate ? endOfDay(new Date(toDate)) : null

    return payments
      .filter((p) => {
        const st = effectiveStatus(p, now)
        if (statusFilter !== 'all' && st !== statusFilter) return false
        if (memberId !== 'all' && p.memberId !== memberId) return false
        if (q) {
          const haystack = `${p.memberName} ${p.description} ${p.reference ?? ''}`.toLowerCase()
          if (!haystack.includes(q)) return false
        }
        if (from && p.dueDate < from) return false
        if (to && p.dueDate > to) return false
        return true
      })
      .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())
  }, [payments, query, memberId, statusFilter, fromDate, toDate, now])

  const totals = useMemo(() => {
    let paidCents = 0
    let overdueCents = 0
    let upcomingCents = 0
    let failedCents = 0

    for (const p of payments) {
      const st = effectiveStatus(p, now)
      const amt = amountDueCents(p)
      if (st === 'paid') paidCents += amt
      if (st === 'overdue') overdueCents += amt
      if (st === 'upcoming') upcomingCents += amt
      if (st === 'failed') failedCents += amt
    }
    return { paidCents, overdueCents, upcomingCents, failedCents }
  }, [payments, now])


  const updatePayment = (id: string, updater: (prev: Payment) => Payment) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? updater(p) : p)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setStatementOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Generate statement
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>View full transaction history and filter by status.</CardDescription>
              </div>
              <Tabs
                value={statusFilter}
                onValueChange={(value) => {
                  if (isStatusFilter(value)) setStatusFilter(value)
                }}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="failed">Failed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
              <div className="relative md:col-span-5">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search member, description, reference…"
                  className="pl-9"
                />
              </div>
              <div className="md:col-span-3">
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
              <div className="md:col-span-2">
                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>

            <div className="mt-4">
              {filteredPayments.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Receipt />
                    </EmptyMedia>
                    <EmptyTitle>No payments found</EmptyTitle>
                    <EmptyDescription>Try adjusting your filters.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQuery('')
                        setMemberId('all')
                        setStatusFilter('all')
                        setFromDate('')
                        setToDate('')
                      }}
                    >
                      Reset filters
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[26%]">Member</TableHead>
                        <TableHead className="w-[26%]">Description</TableHead>
                        <TableHead className="w-[12%]">Cycle</TableHead>
                        <TableHead className="w-[14%]">Due</TableHead>
                        <TableHead className="w-[14%]">Amount</TableHead>
                        <TableHead className="w-[8%]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((p) => {
                        const st = effectiveStatus(p, now)
                        return (
                          <TableRow
                            key={p.id}
                            role="button"
                            tabIndex={0}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedPaymentId(p.id)
                              setDetailsOpen(true)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setSelectedPaymentId(p.id)
                                setDetailsOpen(true)
                              }
                            }}
                          >
                            <TableCell className="font-medium">{p.memberName}</TableCell>
                            <TableCell>
                              <div className="min-w-0">
                                <div className="truncate">{p.description}</div>
                                <div className="text-xs text-muted-foreground">
                                  {p.reference ? `Ref: ${p.reference}` : '—'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{p.cycle}</TableCell>
                            <TableCell>{format(p.dueDate, 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="font-semibold">{formatMoney(amountDueCents(p), p.currency)}</TableCell>
                            <TableCell>{statusBadge(st)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Totals</CardTitle>
              <CardDescription>Summary of all payments by status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                {statusBadge('paid')}
                <div className="text-sm font-semibold">{formatMoney(totals.paidCents, 'PHP')}</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                {statusBadge('overdue')}
                <div className="text-sm font-semibold">{formatMoney(totals.overdueCents, 'PHP')}</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                {statusBadge('upcoming')}
                <div className="text-sm font-semibold">{formatMoney(totals.upcomingCents, 'PHP')}</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                {statusBadge('failed')}
                <div className="text-sm font-semibold">{formatMoney(totals.failedCents, 'PHP')}</div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Recurring billing</CardTitle>
              <CardDescription>Billing cycles and next charges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {subscriptions.map((s) => (
                <div key={s.id} className="rounded-md border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{s.memberDisplayName}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.cycle} • Next {format(s.nextBillingDate, 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <Badge
                      variant={
                        s.status === 'active'
                          ? 'default'
                          : s.status === 'paused'
                            ? 'outline'
                            : 'destructive'
                      }
                    >
                      {s.status}
                    </Badge>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{formatMoney(s.amountCents, s.currency)}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSubscriptions((prev) =>
                          prev.map((x) =>
                            x.id === s.id
                              ? { ...x, status: x.status === 'active' ? 'paused' : 'active' }
                              : x,
                          ),
                        )
                      }}
                    >
                      {s.status === 'active' ? 'Pause' : 'Resume'}
                    </Button>
                  </div>
                </div>
              ))}
              {subscriptions.length === 0 && <div className="text-sm text-muted-foreground">No subscriptions configured.</div>}
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentDetailsDialog
        open={detailsOpen}
        payment={selectedPayment}
        now={now}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setSelectedPaymentId(null)
        }}
        onUpdate={(patch) => {
          if (!selectedPayment) return
          setPayments((prev) => prev.map((p) => (p.id === selectedPayment.id ? { ...p, ...patch } : p)))
        }}
        onMarkPaid={() => {
          if (!selectedPayment) return
          updatePayment(selectedPayment.id, (prev) => ({ ...prev, paidAt: new Date(), status: 'paid' }))
        }}
      />

      <StatementDialog open={statementOpen} onOpenChange={setStatementOpen} members={members} payments={payments} now={now} />
    </div>
  )
}
