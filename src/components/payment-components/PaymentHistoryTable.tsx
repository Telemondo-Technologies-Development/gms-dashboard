import { useMemo, useState, useCallback } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  Search, 
  XCircle, 
  Filter, 
  Download, 
  CreditCard, 
  User, 
  ArrowUpDown, 
  RefreshCw,
  Loader2
} from 'lucide-react'

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

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
        <Badge className="gap-1.5 bg-green-500 hover:bg-green-600 border-transparent" variant="default">
          <CheckCircle2 className="h-3.5 w-3.5" />Paid
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="gap-1.5" variant="destructive">
          <XCircle className="h-3.5 w-3.5" />Failed
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="gap-1.5 bg-orange-500 hover:bg-orange-600 border-transparent text-white" variant="outline">
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

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function PaymentHistoryTable() {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(0)

  const defaultValues: PaymentHistoryFilters = {
    query: '',
    status: 'all',
    fromDate: '',
    toDate: '',
  }

  const form = useForm({
    defaultValues,
    onSubmit: async () => {
      // Filters apply live
    },
  })

  // Fetch data
  const paymentsQuery = usePayments(0, 200)
  const payments = paymentsQuery.data ?? []
  const paymentsLoading = paymentsQuery.isLoading
  const paymentsError = paymentsQuery.error

  const methodsQuery = usePaymentMethods(0, 200)
  const paymentMethods = methodsQuery.data ?? []
  const methodsLoading = methodsQuery.isLoading

  const invoicesQuery = useInvoices(0, 500)
  const invoices = invoicesQuery.data ?? []
  const invoicesLoading = invoicesQuery.isLoading
  const invoicesError = invoicesQuery.error

  // Memoized lookups
  const invoiceById = useMemo(() => {
    const map = new Map<string, InvoiceTableDTOParsed>()
    for (const inv of invoices) map.set(inv.id, inv)
    return map
  }, [invoices])

  const paymentMethodById = useMemo(() => {
    const map = new Map<string, PaymentMethodTableDTOParsed>()
    for (const method of paymentMethods) map.set(method.id, method)
    return map
  }, [paymentMethods])

  // Single Member fetching logic - keeping inside component for now as in Route
  const membersQuery = useQuery<MemberTableData[]>({
    queryKey: ['payment-history-members'],
    queryFn: async () => {
      const api = getAuthenticatedApi(MemberApi)
      const resp = await api.getAllMembers({ pageable: { page: 0, size: 1000 } })
      const parsed = apiResponseListMemberTableSchema.parse(resp)
      return parsed.data ?? []
    },
    staleTime: 60_000,
  })

  const members = membersQuery.data ?? []
  const membersLoading = membersQuery.isLoading

  const memberNameByActorId = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of members) {
      if (!m.actorId) continue
      const fullName = [m.firstName, m.middleName, m.surname, m.suffix].filter(Boolean).join(' ')
      map.set(m.actorId, fullName || 'Unknown')
    }
    return map
  }, [members])

  // Selected Payment Data
  const paymentQuery = usePayment(selectedPaymentId)
  const selectedPayment = useMemo(() => {
    if (paymentQuery.data) return paymentQuery.data
    if (!selectedPaymentId) return null
    return payments.find((p) => p.id === selectedPaymentId) ?? null
  }, [paymentQuery.data, payments, selectedPaymentId])

  const selectedPaymentLoading = !!selectedPaymentId && paymentQuery.isLoading && !selectedPayment
  const selectedPaymentError = paymentQuery.error instanceof Error ? paymentQuery.error.message : undefined

  // Filtering Logic
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

  // Calculate Totals based on Filtered Data
  const totals = useMemo(() => {
    // We need to re-calculate totals based on *current filters*
    // But hooks can't conditionaly run. We'll use the form state.
    // Instead of subscribing inside render, we can just grab current values because useForm rerenders on change?
    // TanStack Form's useForm doesn't automatically trigger re-render of component on value change unless subscribed.
    // So we'll move the calculation inside the Subscribe block or use a state that updates on form change?
    // Actually, let's keep it simple: we will render the totals INSIDE the Subscribe block where we have access to `filters`.
    return { paid: 0, failed: 0, pending: 0 } // placeholder, actual calc in render
  }, []) // We will calculate in render prop

  const handleRefresh = useCallback(() => {
    paymentsQuery.refetch()
    methodsQuery.refetch()
    invoicesQuery.refetch()
    membersQuery.refetch()
  }, [paymentsQuery, methodsQuery, invoicesQuery, membersQuery])

  if (paymentsError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        {paymentsError instanceof Error ? paymentsError.message : 'Failed to load payments'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Payment History</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and manage billing records, invoices, and transaction statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={paymentsLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", paymentsLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <form.Subscribe selector={(state) => state.values}>
        {(filters) => {
          // Compute filtered data inside render
          const filteredPayments = filterPayments(filters).sort((a, b) => {
             const dateA = a.paidAt ? new Date(a.paidAt).getTime() : 0
             const dateB = b.paidAt ? new Date(b.paidAt).getTime() : 0
             return dateB - dateA
          })
          
          const currentTotals = filteredPayments.reduce((acc, p) => {
             const st = mapDisplayStatus(p)
             acc[st] += p.amount
             return acc
          }, { paid: 0, failed: 0, pending: 0 } as Record<DisplayStatus, number>)
          
          // Pagination
          const pageCount = Math.max(1, Math.ceil(filteredPayments.length / pageSize))
          const pageItems = filteredPayments.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

          return (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              {/* Main Table Card */}
              <Card className="xl:col-span-3  flex flex-col h-full">
                <CardHeader className="pb-4 space-y-4">
                   <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                     <div>
                       <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
                       <CardDescription>
                         Showing {filteredPayments.length} records based on current filters
                       </CardDescription>
                     </div>
                     
                      {/* Status Filter */}
                     <div className="w-full md:w-48">
                      <form.Field name="status">
                        {(field) => (
                          <Select
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value as PaymentHistoryFilters['status'])
                              setPageIndex(0)
                            }}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </form.Field>
                     </div>
                   </div>

                   <Separator />

                   {/* Search and Date Filters */}
                   <div className="flex flex-col md:flex-row gap-3">
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                        <form.Field name="query">
                          {(field) => (
                            <Input
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(e.target.value)
                                setPageIndex(0) 
                              }}
                              placeholder="Search by ID, member, or method..."
                              className="pl-9 h-9 bg-background/50"
                            />
                          )}
                        </form.Field>
                     </div>
                     
                     <div className="flex gap-2 w-full md:w-auto">
                        <form.Field name="fromDate">
                          {(field) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    'justify-start text-left font-normal h-9 w-full md:w-[130px]',
                                    !field.state.value && 'text-muted-foreground',
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                  {field.state.value ? (
                                    format(new Date(field.state.value), 'MMM d, yyyy')
                                  ) : (
                                    <span>From Date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                  mode="single"
                                  selected={field.state.value ? new Date(field.state.value) : undefined}
                                  onSelect={(date) => {
                                    field.handleChange(date ? format(date, 'yyyy-MM-dd') : '')
                                    setPageIndex(0)
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </form.Field>

                        <form.Field name="toDate">
                          {(field) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    'justify-start text-left font-normal h-9 w-full md:w-[130px]',
                                    !field.state.value && 'text-muted-foreground',
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                  {field.state.value ? (
                                    format(new Date(field.state.value), 'MMM d, yyyy')
                                  ) : (
                                    <span>To Date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                  mode="single"
                                  selected={field.state.value ? new Date(field.state.value) : undefined}
                                  onSelect={(date) => {
                                    field.handleChange(date ? format(date, 'yyyy-MM-dd') : '')
                                    setPageIndex(0)
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </form.Field>
                     </div>
                   </div>
                </CardHeader>

                <CardContent className="flex-1 p-0">
                  {paymentsLoading || invoicesLoading ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 text-muted-foreground">
                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
                       <p className="text-sm">Loading payment history...</p>
                    </div>
                  ) : filteredPayments.length === 0 ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Receipt className="h-6 w-6 text-muted-foreground" />
                       </div>
                       <h3 className="mt-4 text-lg font-semibold">No payments found</h3>
                       <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                         We couldn't find any payment records matching your current filters.
                       </p>
                       <Button 
                         variant="outline" 
                         className="mt-4"
                         onClick={() => form.reset()}
                        >
                         Clear Filters
                       </Button>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow className="hover:bg-transparent border-b border-muted/60">
                            <TableHead className="w-[30%] pl-6 py-4 font-semibold text-foreground/70">Member</TableHead>
                            <TableHead className="w-[20%] py-4 font-semibold text-foreground/70">Method</TableHead>
                            <TableHead className="w-[20%] py-4 font-semibold text-foreground/70">
                               <div className="flex items-center gap-1">
                                 Paid Date
                                 <ArrowUpDown className="h-3 w-3" />
                               </div>
                            </TableHead>
                            <TableHead className="w-[15%] py-4 font-semibold text-foreground/70">Amount</TableHead>
                            <TableHead className="w-[15%] py-4 font-semibold text-foreground/70 text-right pr-6">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pageItems.map((p) => {
                            const methodName = paymentMethodById.get(p.paymentMethodId)?.name
                            const st = mapDisplayStatus(p)
                            const invoice = invoiceById.get(p.invoiceId)
                            const memberName = invoice?.actorId ? memberNameByActorId.get(invoice.actorId) : undefined

                            return (
                              <TableRow
                                key={p.id}
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer hover:bg-muted/40 transition-colors group border-b border-muted/40"
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
                                <TableCell className="pl-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <div className="font-medium text-sm text-foreground">
                                        {membersLoading ? '...' : (memberName || 'Unknown Member')}
                                      </div>
                                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                         <span className="truncate max-w-[120px]">
                                            Invoice #{p.invoiceId.slice(0, 8)}...
                                         </span>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                
                                <TableCell className="py-4">
                                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                     <CreditCard className="h-3.5 w-3.5 opacity-70" />
                                     <span>{methodsLoading ? '...' : (methodName || '—')}</span>
                                   </div>
                                </TableCell>
                                
                                <TableCell className="py-4">
                                   <div className="flex flex-col gap-0.5">
                                      {p.paidAt ? (
                                        <>
                                            <span className="text-sm font-medium text-foreground/80">
                                                {format(new Date(p.paidAt), 'MMM dd, yyyy')}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(p.paidAt), 'h:mm a')}
                                            </span>
                                        </>
                                      ) : (
                                        <span className="text-sm text-muted-foreground italic">—</span>
                                      )}
                                   </div>
                                </TableCell>
                                
                                <TableCell className="py-4">
                                  <span className="font-semibold text-sm">
                                    {formatCurrency(p.amount, 'PHP')}
                                  </span>
                                </TableCell>
                                
                                <TableCell className="py-4 text-right pr-6">
                                  {statusBadge(st)}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>

                <div className="border-t bg-muted/5 p-4 mt-auto">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-xs text-muted-foreground font-medium">
                            Page {pageIndex + 1} of {pageCount}
                        </div>
                        <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                            disabled={pageIndex <= 0}
                            className="h-8 px-3 text-xs"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                            disabled={pageIndex >= pageCount - 1}
                            className="h-8 px-3 text-xs"
                        >
                            Next
                        </Button>
                        </div>
                    </div>
                </div>
              </Card>

              {/* Stats / Totals Card Side Panel - Integrated into component */}
              <div className="space-y-6">
                <Card className="shadow-md border-muted/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Summary</CardTitle>
                    <CardDescription>Totals for displayed records</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</span>
                        <div className="text-2xl font-bold tracking-tight text-primary">
                          {formatCurrency(currentTotals.paid + currentTotals.pending, 'PHP')}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                           <span className="text-green-500 font-medium">
                              {filteredPayments.length} 
                           </span>
                           transactions
                        </div>
                     </div>
                     
                     <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between gap-3 text-sm">
                           <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-green-500" />
                             <span className="text-muted-foreground">Paid</span>
                           </div>
                           <span className="font-medium">{formatCurrency(currentTotals.paid, 'PHP')}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm">
                           <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-orange-500" />
                             <span className="text-muted-foreground">Pending</span>
                           </div>
                           <span className="font-medium">{formatCurrency(currentTotals.pending, 'PHP')}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm">
                           <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-destructive" />
                             <span className="text-muted-foreground">Failed</span>
                           </div>
                           <span className="font-medium">{formatCurrency(currentTotals.failed, 'PHP')}</span>
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter className="bg-muted/5 border-t p-4">
                     <Button className="w-full" variant="outline" onClick={() => setReceiptOpen(true)} disabled={!selectedPaymentId}>
                        <Receipt className="h-4 w-4 mr-2" />
                        Generate Receipt
                     </Button>
                  </CardFooter>
                </Card>
                
                {/* Could add another card for filters summary or quick actions */}
              </div>
            </div>
          )
        }}
      </form.Subscribe>

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
