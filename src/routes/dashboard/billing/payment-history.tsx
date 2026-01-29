import { createFileRoute } from '@tanstack/react-router'

import { useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { format } from 'date-fns'
import { AlertTriangle, CheckCircle2, Clock, Receipt, Search, XCircle } from 'lucide-react'

import { usePaymentMethods, usePayments } from '@/hooks/usePaymentHistory'
import {
  paymentHistoryFiltersSchema,
  type PaymentHistoryFilters,
  type PaymentMethodTableDTOParsed,
  type PaymentTableDTOParsed,
} from '@/types/payment/paymentSchemas'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

function validateFilters(value: PaymentHistoryFilters): string | undefined {
  const parsed = paymentHistoryFiltersSchema.safeParse(value)
  if (parsed.success) return undefined
  return parsed.error.issues[0]?.message ?? 'Invalid filters'
}

function PaymentHistoryRoute() {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)

  const defaultValues: PaymentHistoryFilters = {
    query: '',
    status: 'all',
    fromDate: '',
    toDate: '',
  }

  const form = useForm({
    defaultValues,
    onSubmit: async () => {
      // Filters apply live; submission is optional.
    },
  })

  const {
    data: payments = [],
    isLoading: paymentsLoading,
    error: paymentsError,
  } = usePayments(0, 200)

  const {
    data: paymentMethods = [],
    isLoading: methodsLoading,
  } = usePaymentMethods(0, 200)

  const paymentMethodById = useMemo(() => {
    const map = new Map<string, PaymentMethodTableDTOParsed>()
    for (const method of paymentMethods) map.set(method.id, method)
    return map
  }, [paymentMethods])

  const selectedPayment = useMemo(() => {
    if (!selectedPaymentId) return null
    return payments.find((p) => p.id === selectedPaymentId) ?? null
  }, [payments, selectedPaymentId])

  const totals = useMemo(() => {
    const totalsByStatus: Record<DisplayStatus, number> = {
      paid: 0,
      failed: 0,
      pending: 0,
    }

    for (const p of payments) {
      const st = mapDisplayStatus(p)
      totalsByStatus[st] += p.amount
    }

    return totalsByStatus
  }, [payments])

  if (paymentsError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {paymentsError instanceof Error
          ? paymentsError.message
          : 'Failed to load payment history'}
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <form.Subscribe selector={(state) => state.values}>
              {(filters) => {
                const q = filters.query.trim().toLowerCase()
                const from = filters.fromDate ? new Date(filters.fromDate) : null
                const to = filters.toDate ? new Date(filters.toDate) : null

                const filteredCount = payments.filter((p) => {
                  const st = mapDisplayStatus(p)
                  if (filters.status !== 'all' && st !== filters.status) return false

                  if (q) {
                    const methodName = paymentMethodById.get(p.paymentMethodId)?.name ?? ''
                    const haystack = `${p.id} ${p.invoiceId} ${methodName} ${p.status} ${p.failureReason ?? ''}`
                      .toLowerCase()
                    if (!haystack.includes(q)) return false
                  }

                  const date = p.paidAt ? new Date(p.paidAt) : null
                  if (from && date && date < from) return false
                  if (to && date && date > to) return false
                  return true
                }).length

                return (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle>Transactions</CardTitle>
                      <CardDescription>
                        {paymentsLoading ? 'Loading…' : `${filteredCount} payments`}
                      </CardDescription>
                    </div>
                    <div className="w-full sm:w-55">
                      <form.Field name="status">
                        {(field) => (
                          <Select
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value as PaymentHistoryFilters['status'])
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </form.Field>
                    </div>
                  </div>
                )
              }}
            </form.Subscribe>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void form.handleSubmit()
              }}
              className="grid grid-cols-1 gap-3 md:grid-cols-12"
            >
              <div className="relative md:col-span-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <form.Field name="query">
                  {(field) => (
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Search id, invoice, method, status…"
                      className="pl-9"
                    />
                  )}
                </form.Field>
              </div>

              <div className="md:col-span-3">
                <form.Field name="fromDate">
                  {(field) => (
                    <Input
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>
              </div>

              <div className="md:col-span-3">
                <form.Field name="toDate">
                  {(field) => (
                    <Input
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>
              </div>
            </form>

            <form.Subscribe selector={(state) => state.values}>
              {(values) => {
                const message = validateFilters(values)
                return message ? (
                  <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    {message}
                  </div>
                ) : null
              }}
            </form.Subscribe>

            <div className="mt-4">
              <form.Subscribe selector={(state) => state.values}>
                {(filters) => {
                  const q = filters.query.trim().toLowerCase()
                  const from = filters.fromDate ? new Date(filters.fromDate) : null
                  const to = filters.toDate ? new Date(filters.toDate) : null

                  const filteredPayments = payments
                    .filter((p) => {
                      const st = mapDisplayStatus(p)
                      if (filters.status !== 'all' && st !== filters.status) return false

                      if (q) {
                        const methodName = paymentMethodById.get(p.paymentMethodId)?.name ?? ''
                        const haystack = `${p.id} ${p.invoiceId} ${methodName} ${p.status} ${p.failureReason ?? ''}`
                          .toLowerCase()
                        if (!haystack.includes(q)) return false
                      }

                      const date = p.paidAt ? new Date(p.paidAt) : null
                      if (from && date && date < from) return false
                      if (to && date && date > to) return false
                      return true
                    })
                    .sort((a, b) => {
                      const dateA = a.paidAt ? new Date(a.paidAt).getTime() : 0
                      const dateB = b.paidAt ? new Date(b.paidAt).getTime() : 0
                      return dateB - dateA
                    })

                  if (paymentsLoading) {
                    return (
                      <div className="rounded-md border p-6 text-sm text-muted-foreground">
                        Loading payment history…
                      </div>
                    )
                  }

                  if (filteredPayments.length === 0) {
                    return (
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
                              form.reset()
                            }}
                          >
                            Reset filters
                          </Button>
                        </EmptyContent>
                      </Empty>
                    )
                  }

                  return (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[22%]">Payment</TableHead>
                            <TableHead className="w-[22%]">Invoice</TableHead>
                            <TableHead className="w-[18%]">Method</TableHead>
                            <TableHead className="w-[16%]">Paid At</TableHead>
                            <TableHead className="w-[14%]">Amount</TableHead>
                            <TableHead className="w-[8%]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.map((p) => {
                            const methodName = paymentMethodById.get(p.paymentMethodId)?.name
                            const st = mapDisplayStatus(p)

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
                                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                                <TableCell className="font-mono text-xs">{p.invoiceId}</TableCell>
                                <TableCell className="text-sm">
                                  {methodsLoading ? 'Loading…' : (methodName ?? '—')}
                                </TableCell>
                                <TableCell>
                                  {p.paidAt ? format(new Date(p.paidAt), 'MMM dd, yyyy') : '—'}
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {formatCurrency(p.amount, 'PHP')}
                                </TableCell>
                                <TableCell>{statusBadge(st)}</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )
                }}
              </form.Subscribe>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Totals</CardTitle>
              <CardDescription>Summary by display status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                {statusBadge('paid')}
                <div className="text-sm font-semibold">{formatCurrency(totals.paid, 'PHP')}</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                {statusBadge('pending')}
                <div className="text-sm font-semibold">{formatCurrency(totals.pending, 'PHP')}</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                {statusBadge('failed')}
                <div className="text-sm font-semibold">{formatCurrency(totals.failed, 'PHP')}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Based on PaymentTableDTO fields.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <span>
                  Display status is derived from <span className="font-mono text-xs">paidAt</span> and
                  <span className="font-mono text-xs"> failureReason</span>.
                </span>
              </div>
              <div>
                API status: <span className="font-mono text-xs">IN | OUT | UNDECIDED</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setSelectedPaymentId(null)
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Payment details</DialogTitle>
            <DialogDescription>
              {selectedPayment ? 'Details from PaymentTableDTO.' : 'No payment selected.'}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">Payment ID</div>
                  <div className="mt-1 break-all font-mono text-xs">{selectedPayment.id}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Invoice ID</div>
                  <div className="mt-1 break-all font-mono text-xs">{selectedPayment.invoiceId}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Payment Method</div>
                  <div className="mt-1 text-sm">
                    {paymentMethodById.get(selectedPayment.paymentMethodId)?.name ?? '—'}
                  </div>
                  <div className="mt-1 break-all font-mono text-xs text-muted-foreground">
                    {selectedPayment.paymentMethodId}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="mt-1 text-sm font-semibold">
                    {formatCurrency(selectedPayment.amount, 'PHP')}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">API Status</div>
                  <div className="mt-1 font-mono text-xs">{selectedPayment.status}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Display Status</div>
                  <div className="mt-1">{statusBadge(mapDisplayStatus(selectedPayment))}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Paid At</div>
                  <div className="mt-1 text-sm">
                    {selectedPayment.paidAt ? format(new Date(selectedPayment.paidAt), 'PPpp') : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Failure Reason</div>
                  <div className="mt-1 text-sm">{selectedPayment.failureReason ?? '—'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Select a row to view details.</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
