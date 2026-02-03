import { createFileRoute } from '@tanstack/react-router'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { AlertTriangle, CalendarIcon, CheckCircle2, Clock, Receipt, Search, XCircle } from 'lucide-react'

import { usePayment, usePaymentMethods, usePayments, useInvoices } from '@/hooks/usePaymentHistory'
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
import { useAuthStore } from '@/lib/auth-session'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
type InvoiceDisplayStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE'

const PAYMENT_HISTORY_QUERY_KEYS = {
  members: 'members',
}

function getDebugBillingFlag(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  if (params.get('debugBilling') === '1' || params.get('debug') === '1') return true
  return window.localStorage.getItem('debugBilling') === '1'
}

function safeErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined
  if (error instanceof Error) return error.message
  return String(error)
}

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

function invoiceStatusBadge(status: InvoiceDisplayStatus) {
  switch (status) {
    case 'PAID':
      return (
        <Badge className="gap-1" variant="default">
          <CheckCircle2 className="h-3.5 w-3.5" />Paid
        </Badge>
      )
    case 'OVERDUE':
      return (
        <Badge className="gap-1" variant="destructive">
          <AlertTriangle className="h-3.5 w-3.5" />Overdue
        </Badge>
      )
    case 'ISSUED':
      return (
        <Badge className="gap-1" variant="outline">
          <Clock className="h-3.5 w-3.5" />Issued
        </Badge>
      )
    case 'DRAFT':
    default:
      return (
        <Badge className="gap-1" variant="secondary">
          Draft
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
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments')
  const [debugEnabled, setDebugEnabled] = useState<boolean>(() => getDebugBillingFlag())

  const token = useAuthStore((state) => state.token)
  const tokenPresent = !!token

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!import.meta.env.DEV) return
    window.localStorage.setItem('debugBilling', debugEnabled ? '1' : '0')
  }, [debugEnabled])

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
    queryKey: [PAYMENT_HISTORY_QUERY_KEYS.members],
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
  const selectedPaymentError =
    paymentQuery.error instanceof Error ? paymentQuery.error.message : paymentQuery.error ? 'Failed to load payment.' : undefined

  useEffect(() => {
    if (!import.meta.env.DEV) return
    if (!debugEnabled) return

    console.debug('[billing:payment-history]', {
      tokenPresent,
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '(unset)',
      activeTab,
      payments: {
        status: paymentsQuery.status,
        fetchStatus: paymentsQuery.fetchStatus,
        count: payments.length,
        error: safeErrorMessage(paymentsQuery.error),
        updatedAt: paymentsQuery.dataUpdatedAt,
        enabled: tokenPresent,
      },
      invoices: {
        status: invoicesQuery.status,
        fetchStatus: invoicesQuery.fetchStatus,
        count: invoices.length,
        error: safeErrorMessage(invoicesQuery.error),
        updatedAt: invoicesQuery.dataUpdatedAt,
        enabled: tokenPresent,
      },
      paymentMethods: {
        status: methodsQuery.status,
        fetchStatus: methodsQuery.fetchStatus,
        count: paymentMethods.length,
        error: safeErrorMessage(methodsQuery.error),
        updatedAt: methodsQuery.dataUpdatedAt,
        enabled: tokenPresent,
      },
      members: {
        status: membersQuery.status,
        fetchStatus: membersQuery.fetchStatus,
        count: members.length,
        error: safeErrorMessage(membersQuery.error),
        updatedAt: membersQuery.dataUpdatedAt,
      },
      selectedPayment: {
        id: selectedPaymentId,
        status: paymentQuery.status,
        fetchStatus: paymentQuery.fetchStatus,
        hasData: !!paymentQuery.data,
        error: safeErrorMessage(paymentQuery.error),
      },
    })
  }, [
    activeTab,
    debugEnabled,
    tokenPresent,
    payments.length,
    invoices.length,
    paymentMethods.length,
    members.length,
    paymentsQuery.status,
    paymentsQuery.fetchStatus,
    paymentsQuery.error,
    paymentsQuery.dataUpdatedAt,
    invoicesQuery.status,
    invoicesQuery.fetchStatus,
    invoicesQuery.error,
    invoicesQuery.dataUpdatedAt,
    methodsQuery.status,
    methodsQuery.fetchStatus,
    methodsQuery.error,
    methodsQuery.dataUpdatedAt,
    membersQuery.status,
    membersQuery.fetchStatus,
    membersQuery.error,
    membersQuery.dataUpdatedAt,
    selectedPaymentId,
    paymentQuery.status,
    paymentQuery.fetchStatus,
    paymentQuery.error,
    paymentQuery.data,
  ])

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

  const invoiceTotals = useMemo(() => {
    const byStatus: Record<InvoiceDisplayStatus, { count: number; total: number }> = {
      DRAFT: { count: 0, total: 0 },
      ISSUED: { count: 0, total: 0 },
      PAID: { count: 0, total: 0 },
      OVERDUE: { count: 0, total: 0 },
    }

    for (const inv of invoices) {
      const st = (inv.status ?? 'ISSUED') as InvoiceDisplayStatus
      const row = byStatus[st] ?? byStatus.ISSUED
      row.count += 1
      row.total += inv.total
    }

    return byStatus
  }, [invoices])

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

      {import.meta.env.DEV ? (
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Debug is dev-only. You can also enable via <span className="font-mono">?debugBilling=1</span>.
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setDebugEnabled((v) => !v)}
          >
            {debugEnabled ? 'Hide Debug' : 'Show Debug'}
          </Button>
        </div>
      ) : null}

      {import.meta.env.DEV && debugEnabled ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Debug: Billing Data Flow</CardTitle>
            <CardDescription>
              Helps diagnose empty lists due to missing token, disabled queries, API errors, or schema mismatches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-md border p-3">
                <div className="font-medium">Auth</div>
                <div className="mt-1 text-muted-foreground">
                  token present: <span className="font-mono">{String(tokenPresent)}</span>
                </div>
                {!tokenPresent ? (
                  <div className="mt-2 text-destructive">
                    Payments/invoices/payment-methods queries are <span className="font-mono">enabled: !!token</span> and will not run.
                  </div>
                ) : null}
                <div className="mt-2 text-muted-foreground">
                  VITE_API_BASE_URL: <span className="font-mono">{import.meta.env.VITE_API_BASE_URL ?? '(unset)'}</span>
                </div>
              </div>

              <div className="rounded-md border p-3">
                <div className="font-medium">Current</div>
                <div className="mt-1 text-muted-foreground">
                  tab: <span className="font-mono">{activeTab}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  selected payment id: <span className="font-mono">{selectedPaymentId ?? '(none)'}</span>
                </div>
                {selectedPaymentError ? (
                  <div className="mt-2 text-destructive">selected payment error: {selectedPaymentError}</div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-md border p-3">
                <div className="font-medium">Payments</div>
                <div className="mt-1 text-muted-foreground">
                  status: <span className="font-mono">{paymentsQuery.status}</span> / fetch:{' '}
                  <span className="font-mono">{paymentsQuery.fetchStatus}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  count: <span className="font-mono">{payments.length}</span>
                </div>
                {paymentsQuery.dataUpdatedAt ? (
                  <div className="mt-1 text-muted-foreground">
                    updated: <span className="font-mono">{format(new Date(paymentsQuery.dataUpdatedAt), 'PPpp')}</span>
                  </div>
                ) : null}
                {safeErrorMessage(paymentsQuery.error) ? (
                  <div className="mt-2 text-destructive">error: {safeErrorMessage(paymentsQuery.error)}</div>
                ) : null}
              </div>

              <div className="rounded-md border p-3">
                <div className="font-medium">Invoices</div>
                <div className="mt-1 text-muted-foreground">
                  status: <span className="font-mono">{invoicesQuery.status}</span> / fetch:{' '}
                  <span className="font-mono">{invoicesQuery.fetchStatus}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  count: <span className="font-mono">{invoices.length}</span>
                </div>
                {invoicesQuery.dataUpdatedAt ? (
                  <div className="mt-1 text-muted-foreground">
                    updated: <span className="font-mono">{format(new Date(invoicesQuery.dataUpdatedAt), 'PPpp')}</span>
                  </div>
                ) : null}
                {safeErrorMessage(invoicesQuery.error) ? (
                  <div className="mt-2 text-destructive">error: {safeErrorMessage(invoicesQuery.error)}</div>
                ) : null}
              </div>

              <div className="rounded-md border p-3">
                <div className="font-medium">Payment Methods</div>
                <div className="mt-1 text-muted-foreground">
                  status: <span className="font-mono">{methodsQuery.status}</span> / fetch:{' '}
                  <span className="font-mono">{methodsQuery.fetchStatus}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  count: <span className="font-mono">{paymentMethods.length}</span>
                </div>
                {safeErrorMessage(methodsQuery.error) ? (
                  <div className="mt-2 text-destructive">error: {safeErrorMessage(methodsQuery.error)}</div>
                ) : null}
              </div>
            </div>

            {membersQuery.error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-destructive">
                Members query error: {safeErrorMessage(membersQuery.error) ?? 'Unknown error'}
              </div>
            ) : null}

            <div className="text-xs text-muted-foreground">
              Tip: if payments/invoices show <span className="font-mono">fetch: idle</span> and token is false, the hook is disabled.
              If you see “schema mismatch”, the backend response doesn’t match the Zod schema in <span className="font-mono">paymentSchemas</span>.
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'payments' | 'invoices')}>
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Tabs value={activeTab} className="xl:col-span-2">
          <TabsContent value="payments">
            <Card>
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
                        const invoice = invoiceById.get(p.invoiceId)
                        const memberName = invoice?.actorId ? (memberNameByActorId.get(invoice.actorId) ?? '') : ''
                        const haystack = `${p.id} ${p.invoiceId} ${methodName} ${p.status} ${p.failureReason ?? ''} ${memberName}`
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
                      const q = filters.query.trim().toLowerCase()
                      const from = filters.fromDate ? new Date(filters.fromDate) : null
                      const to = filters.toDate ? new Date(filters.toDate) : null

                      const filteredPayments = payments
                        .filter((p) => {
                          const st = mapDisplayStatus(p)
                          if (filters.status !== 'all' && st !== filters.status) return false

                          if (q) {
                            const methodName = paymentMethodById.get(p.paymentMethodId)?.name ?? ''
                            const invoice = invoiceById.get(p.invoiceId)
                            const memberName = invoice?.actorId ? (memberNameByActorId.get(invoice.actorId) ?? '') : ''
                            const haystack = `${p.id} ${p.invoiceId} ${methodName} ${p.status} ${p.failureReason ?? ''} ${memberName}`
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
                                <TableHead className="w-[18%]">Payment</TableHead>
                                <TableHead className="w-[18%]">Invoice</TableHead>
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
                                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                                    <TableCell className="font-mono text-xs">
                                      <div className="flex flex-col">
                                        <span>{p.invoiceId}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                          {invoice ? `Invoice: ${invoice.status}` : '—'}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {membersLoading ? (
                                        <span className="text-muted-foreground">Loading…</span>
                                      ) : memberName ? (
                                        <div className="flex flex-col">
                                          <span className="font-medium">{memberName}</span>
                                          {invoice?.actorId ? (
                                            <span className="font-mono text-[10px] text-muted-foreground">{invoice.actorId}</span>
                                          ) : null}
                                        </div>
                                      ) : (
                                        '—'
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
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  {invoicesLoading ? 'Loading…' : `${invoices.length} invoices`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form.Subscribe selector={(state) => state.values}>
                  {(filters) => {
                    const q = filters.query.trim().toLowerCase()
                    const filteredInvoices = invoices
                      .filter((inv) => {
                        if (!q) return true
                        const memberName = inv.actorId ? (memberNameByActorId.get(inv.actorId) ?? '') : ''
                        const haystack = `${inv.id} ${inv.status} ${inv.actorId ?? ''} ${inv.memberSubscriptionId ?? ''} ${memberName}`
                          .toLowerCase()
                        return haystack.includes(q)
                      })
                      .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())

                    if (invoicesLoading) {
                      return (
                        <div className="rounded-md border p-6 text-sm text-muted-foreground">
                          Loading invoices…
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

                    if (filteredInvoices.length === 0) {
                      return (
                        <Empty>
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <Receipt />
                            </EmptyMedia>
                            <EmptyTitle>No invoices found</EmptyTitle>
                            <EmptyDescription>Try adjusting your search.</EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      )
                    }

                    return (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[26%]">Invoice</TableHead>
                              <TableHead className="w-[30%]">Member</TableHead>
                              <TableHead className="w-[16%]">Issued</TableHead>
                              <TableHead className="w-[16%]">Due</TableHead>
                              <TableHead className="w-[8%]">Total</TableHead>
                              <TableHead className="w-[8%]">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredInvoices.map((inv) => {
                              const memberName = inv.actorId ? memberNameByActorId.get(inv.actorId) : undefined
                              const st = (inv.status ?? 'ISSUED') as InvoiceDisplayStatus
                              return (
                                <TableRow key={inv.id}>
                                  <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                                  <TableCell className="text-sm">
                                    {membersLoading ? (
                                      <span className="text-muted-foreground">Loading…</span>
                                    ) : memberName ? (
                                      <div className="flex flex-col">
                                        <span className="font-medium">{memberName}</span>
                                        {inv.actorId ? (
                                          <span className="font-mono text-[10px] text-muted-foreground">{inv.actorId}</span>
                                        ) : null}
                                      </div>
                                    ) : (
                                      '—'
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {inv.issuedAt ? format(new Date(inv.issuedAt), 'MMM dd, yyyy') : '—'}
                                  </TableCell>
                                  <TableCell>
                                    {inv.dueDate ? format(new Date(inv.dueDate), 'MMM dd, yyyy') : '—'}
                                  </TableCell>
                                  <TableCell className="font-semibold">{formatCurrency(inv.total, 'PHP')}</TableCell>
                                  <TableCell>{invoiceStatusBadge(st)}</TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  }}
                </form.Subscribe>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          {activeTab === 'payments' ? (
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
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Invoice Totals</CardTitle>
                <CardDescription>Count and total by invoice status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(['ISSUED', 'OVERDUE', 'PAID', 'DRAFT'] as InvoiceDisplayStatus[]).map((st) => (
                  <div key={st} className="flex items-center justify-between gap-3">
                    {invoiceStatusBadge(st)}
                    <div className="text-right text-sm">
                      <div className="font-semibold">{formatCurrency(invoiceTotals[st].total, 'PHP')}</div>
                      <div className="text-xs text-muted-foreground">{invoiceTotals[st].count} items</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
