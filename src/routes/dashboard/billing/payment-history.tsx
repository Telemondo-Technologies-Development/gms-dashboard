import { createFileRoute } from '@tanstack/react-router'

import { useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { AlertTriangle, CalendarIcon, CheckCircle2, Clock, Receipt, Search, XCircle } from 'lucide-react'

import { usePayments, usePayment } from '@/hooks/billing/usePayments'
import { usePaymentMethods } from '@/hooks/billing/usePaymentMethods'
import { useInvoices } from '@/hooks/billing/useInvoices'
import { getAuthenticatedApi } from '@/lib/api-client'
import { MemberApi } from '@/api/generated/apis/MemberApi'
import { apiResponseListMemberTableSchema } from '@/types/membership/memberSchemas'
import type { MemberTableData } from '@/types/membership/memberSchemas'
import {
  paymentHistoryFiltersSchema,
  type PaymentHistoryFilters,
  type PaymentMethodTableDTOParsed,
  type PaymentTableDTOParsed,
  type InvoiceTableDTOParsed,
} from '@/types/payment/paymentSchemas'

import { PaymentDetailsDialog } from '@/components/payment-components/PaymentDetailsDialog'
import { ReceiptDialog } from '@/components/payment-components/ReceiptDialog'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
  const [receiptOpen, setReceiptOpen] = useState(false)
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

  const paymentsQuery = usePayments(0, 200)
  const payments = paymentsQuery.data ?? []
  const paymentsLoading = paymentsQuery.isLoading
  const paymentsError = paymentsQuery.error

  const membersQuery = useQuery<MemberTableData[]>({
    queryKey: ['payment-history-members'],
    queryFn: async () => {
      const api = getAuthenticatedApi(MemberApi)
      const resp = await api.getAllMembers({ pageable: { page: 0, size: 1000 } })
      const parsed = apiResponseListMemberTableSchema.parse(resp)
      return parsed.data ?? []
    },
    staleTime: 60000,
  })

  const members = membersQuery.data ?? []
  const membersLoading = membersQuery.isLoading

  const methodsQuery = usePaymentMethods(0, 200)
  const paymentMethods = methodsQuery.data ?? []
  const methodsLoading = methodsQuery.isLoading

  const invoicesQuery = useInvoices(0, 500)
  const invoices = invoicesQuery.data ?? []
  const invoicesLoading = invoicesQuery.isLoading
  const invoicesError = invoicesQuery.error

  const invoiceById = useMemo(() => {
    const map = new Map<string, InvoiceTableDTOParsed>()
    for (const inv of invoices) map.set(inv.id, inv)
    return map
  }, [invoices])

  const memberNameByActorId = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of members) {
      if (!m.actorId) continue
      const fullName = [m.firstName, m.middleName, m.surname, m.suffix].filter(Boolean).join(' ')
      map.set(m.actorId, fullName || 'Unknown')
    }
    return map
  }, [members])

  const paymentMethodById = useMemo(() => {
    const map = new Map<string, PaymentMethodTableDTOParsed>()
    for (const method of paymentMethods) map.set(method.id, method)
    return map
  }, [paymentMethods])

  const paymentQuery = usePayment(selectedPaymentId)

  const selectedPayment = useMemo(() => {
    if (paymentQuery.data) return paymentQuery.data
    if (!selectedPaymentId) return null
    return payments.find((p) => p.id === selectedPaymentId) ?? null
  }, [paymentQuery.data, payments, selectedPaymentId])

  const selectedPaymentLoading = !!selectedPaymentId && paymentQuery.isLoading && !selectedPayment
  const selectedPaymentError = paymentQuery.error instanceof Error ? paymentQuery.error.message : undefined

  const filterPayments = (filters: PaymentHistoryFilters) => {
    const q = filters.query.trim().toLowerCase()
    const from = filters.fromDate ? new Date(filters.fromDate) : null
    const to = filters.toDate ? new Date(filters.toDate) : null

    return payments.filter((p) => {
      const st = mapDisplayStatus(p)
      if (filters.status !== 'all' && st !== filters.status) return false

      if (q) {
        const methodName = paymentMethodById.get(p.paymentMethodId)?.name ?? ''
        const invoice = invoiceById.get(p.invoiceId)
        const memberName = invoice?.actorId ? memberNameByActorId.get(invoice.actorId) ?? '' : ''
        const haystack = `${p.id} ${p.invoiceId} ${methodName} ${p.status} ${p.failureReason ?? ''} ${memberName}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }

      const date = p.paidAt ? new Date(p.paidAt) : null
      if (from && date && date < from) return false
      if (to && date && date > to) return false
      return true
    })
  }

  const totals = useMemo(() => {
    const totalsByStatus: Record<DisplayStatus, number> = { paid: 0, failed: 0, pending: 0 }
    for (const p of payments) {
      totalsByStatus[mapDisplayStatus(p)] += p.amount
    }
    return totalsByStatus
  }, [payments])

  if (paymentsError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {paymentsError instanceof Error ? paymentsError.message : 'Failed to load payments'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <form.Subscribe selector={(state) => state.values}>
              {(filters) => (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                      {paymentsLoading ? 'Loading…' : `${filterPayments(filters).length} payments`}
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
              )}
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
                      placeholder="Search id, invoice, member, method, status…"
                      className="pl-9 rounded-2xl"
                    />
                  )}
                </form.Field>
              </div>

              <div className="md:col-span-3">
                <form.Field name="fromDate">
                  {(field) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.state.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.state.value ? (
                            format(new Date(field.state.value), 'PPP')
                          ) : (
                            <span>Pick a from date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.state.value ? new Date(field.state.value) : undefined}
                          onSelect={(date) =>
                            field.handleChange(date ? format(date, 'yyyy-MM-dd') : '')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </form.Field>
              </div>

              <div className="md:col-span-3">
                <form.Field name="toDate">
                  {(field) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.state.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.state.value ? (
                            format(new Date(field.state.value), 'PPP')
                          ) : (
                            <span>Pick a to date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.state.value ? new Date(field.state.value) : undefined}
                          onSelect={(date) =>
                            field.handleChange(date ? format(date, 'yyyy-MM-dd') : '')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                  const filteredPayments = filterPayments(filters).sort((a, b) => {
                    const dateA = a.paidAt ? new Date(a.paidAt).getTime() : 0
                    const dateB = b.paidAt ? new Date(b.paidAt).getTime() : 0
                    return dateB - dateA
                  })

                  if (paymentsLoading || invoicesLoading) {
                    return (
                      <div className="rounded-md border p-6 text-sm text-muted-foreground">
                        Loading payment history…
                      </div>
                    )
                  }

                  if (invoicesError) {
                    return (
                      <div className="rounded-md border p-6 text-sm text-destructive">
                        {invoicesError instanceof Error ? invoicesError.message : 'Failed to load invoices'}
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
                            <TableHead className="w-[18%]">Member</TableHead>
                            <TableHead className="w-[16%]">Method</TableHead>
                            <TableHead className="w-[14%]">Paid At</TableHead>
                            <TableHead className="w-[10%]">Amount</TableHead>
                            <TableHead className="w-[6%]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.map((p) => {
                            const methodName = paymentMethodById.get(p.paymentMethodId)?.name
                            const st = mapDisplayStatus(p)
                            const invoice = invoiceById.get(p.invoiceId)
                            const memberName = invoice?.actorId ? memberNameByActorId.get(invoice.actorId) : undefined

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
                                <TableCell className="text-sm">
                                  {membersLoading ? (
                                    <span className="text-muted-foreground">Loading…</span>
                                  ) : (
                                    <span className="font-medium">{memberName || '—'}</span>
                                  )}
                                </TableCell>
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

      <PaymentDetailsDialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) {
            setReceiptOpen(false)
            setSelectedPaymentId(null)
          }
        }}
        paymentId={selectedPaymentId}
        payment={selectedPayment}
        loading={selectedPaymentLoading}
        error={selectedPaymentError}
        paymentMethodMap={paymentMethodById}
        onPrintReceipt={() => setReceiptOpen(true)}
      />

      <ReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        paymentId={selectedPaymentId}
        payment={selectedPayment}
        loading={selectedPaymentLoading}
        error={selectedPaymentError}
        paymentMethodMap={paymentMethodById}
      />
    </div>
  )
}
