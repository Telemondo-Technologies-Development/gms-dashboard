import { useMemo, useState, useCallback } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  Loader2,
  Trash2,
  MoreHorizontal,
  Eye,
  Printer
} from 'lucide-react'

import { usePayments, usePayment } from '@/hooks/billing/usePayments'
import { usePaymentMethods } from '@/hooks/billing/usePaymentMethods'
import { useInvoices } from '@/hooks/billing/useInvoices'
import { getAuthenticatedApi } from '@/lib/api-client'
import { parseCalendarDay } from '@/lib/date-utils'
import { MemberApi } from '@/api/generated/apis/MemberApi'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { apiResponseListMemberTableSchema } from '@/types/membership/MembershipManagementSchema'
import type { MemberTableData } from '@/types/membership/MembershipManagementSchema'
import {
  paymentHistoryFiltersSchema,
  type PaymentHistoryFilters,
  type PaymentMethodTableDTOParsed,
  type PaymentTableDTOParsed,
  type InvoiceTableDTOParsed,
} from '@/types/payment/paymentSchemas'

import { PaymentDetailsDialog } from '@/components/payment-components/PaymentHistoryDialog'
import { ReceiptDialog } from '@/components/payment-components/PaymentHistoryReceiptDialog'
import { DeleteAdminConfirmDialog } from '@/components/common/DeleteAdminConfirm'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { invoiceQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'

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
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentTableDTOParsed | null>(null)

  const [pageSize, setPageSize] = useState(6)
  const [pageIndex, setPageIndex] = useState(0)

  const queryClient = useQueryClient()
  const deletePaymentMutation = useMutation({
    mutationFn: async (id: string) => {
      const api = getAuthenticatedApi(PaymentApi)
      await api.deletePayment({ id })
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments]})
      queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] }) // Invoices might update status
    },
  })

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
    <div className="space-y-6 h-full flex flex-col">
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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 h-full">
              {/* Main Table Card */}
              <Card className="xl:col-span-3 flex flex-col h-full shadow-md border-muted/40">
                <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">Payment History</CardTitle>
                    <CardDescription className="mt-1">
                      View and manage {filteredPayments.length} billing records, invoices, and transaction statuses.
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="px-3 py-1 text-sm">
                    Total: {filteredPayments.length}
                  </Badge>
                </div>
              </CardHeader>

              <div className="flex-1 min-h-0 overflow-auto">
                <CardContent className="p-0">
                  <div className="px-6 py-4 border-b bg-muted/5 flex flex-col md:flex-row items-start md:items-center gap-3">
                    <div className="relative flex-1 w-full max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
                      <form.Field name="query">
                        {(field) => (
                          <Input
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value)
                              setPageIndex(0) 
                            }}
                            placeholder="Search by ID, member, or method..."
                            className="pl-9 h-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
                          />
                        )}
                      </form.Field>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <form.Field name="status">
                        {(field) => (
                          <Select
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value as PaymentHistoryFilters['status'])
                              setPageIndex(0)
                            }}
                          >
                            <SelectTrigger className="h-10 w-[140px] bg-background/50 border-muted-foreground/20">
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

                      <form.Field name="fromDate">
                        {(field) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={`justify-start text-left font-normal h-10 w-40 bg-background/50 border-muted-foreground/20 ${!field.state.value ? 'text-muted-foreground' : ''}`}
                                aria-label="From date"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.state.value ? format(new Date(field.state.value), 'MMM d, yyyy') : <span>From Date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align="start">
                              <Calendar
                                mode="single"
                                selected={field.state.value ? parseCalendarDay(field.state.value) ?? undefined : undefined}
                                onSelect={(date) => {
                                  field.handleChange(date ? format(date, 'yyyy-MM-dd') : '')
                                  setPageIndex(0)
                                }}
                                initialFocus
                              />
                              <div className="mt-2 flex items-center justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    field.handleChange('')
                                    setPageIndex(0)
                                  }}
                                >
                                  Clear
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    field.handleChange(format(new Date(), 'yyyy-MM-dd'))
                                    setPageIndex(0)
                                  }}
                                >
                                  Today
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </form.Field>

                      <form.Field name="toDate">
                        {(field) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={`justify-start text-left font-normal h-10 w-40 bg-background/50 border-muted-foreground/20 ${!field.state.value ? 'text-muted-foreground' : ''}`}
                                aria-label="To date"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.state.value ? format(new Date(field.state.value), 'MMM d, yyyy') : <span>To Date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align="start">
                              <Calendar
                                mode="single"
                                selected={field.state.value ? parseCalendarDay(field.state.value) ?? undefined : undefined}
                                onSelect={(date) => {
                                  field.handleChange(date ? format(date, 'yyyy-MM-dd') : '')
                                  setPageIndex(0)
                                }}
                                initialFocus
                              />
                              <div className="mt-2 flex items-center justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    field.handleChange('')
                                    setPageIndex(0)
                                  }}
                                >
                                  Clear
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    field.handleChange(format(new Date(), 'yyyy-MM-dd'))
                                    setPageIndex(0)
                                  }}
                                >
                                  Today
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </form.Field>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={paymentsLoading}
                        className="h-10 w-10 shrink-0"
                      >
                        {paymentsLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button className="h-10">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {paymentsLoading || invoicesLoading ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 text-muted-foreground">
                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
                       <p className="text-sm">Loading payment history...</p>
                    </div>
                  ) : filteredPayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Receipt className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No payments found</h3>
                      <p className="text-muted-foreground max-w-sm mb-6">
                        Try adjusting your filters to find what you're looking for.
                      </p>
                    </div>
                  ) : (
                    <div className="relative w-full overflow-auto">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow className="hover:bg-transparent border-b border-muted/60">
                            <TableHead className="w-[30%] pl-6 ">Member</TableHead>
                            <TableHead className="w-[20%]">Method</TableHead>
                            <TableHead className="w-[20%] ">
                               <div className="flex items-center gap-1">
                                 Paid Date
                                 <ArrowUpDown className="h-3 w-3" />
                               </div>
                            </TableHead>
                            <TableHead className="w-[15%] ">Amount</TableHead>
                            <TableHead className="w-[15%] ">Status</TableHead>
                            <TableHead className="w-[15%] pr-4">Actions</TableHead>
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

                              >
                                <TableCell className="pl-6 py-4 align-top">
                                  <div className="flex items-start gap-3">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                        {membersLoading ? '...' : (memberName || 'Unknown Member')}
                                      </span>
                                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                         <span className="truncate max-w-[120px]">
                                            Invoice #{p.invoiceId.slice(0, 8)}...
                                         </span>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                
                                <TableCell className="py-4 align-top">
                                  <div className="w-fit p-1 -ml-1 rounded-md hover:bg-muted transition-colors">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                                      <CreditCard className="h-3.5 w-3.5 opacity-70" />
                                      <span>{methodsLoading ? '...' : (methodName || '—')}</span>
                                    </div>
                                    <div className="pl-5 text-xs text-muted-foreground">
                                      {p.referenceNum ? `Ref: ${p.referenceNum}` : 'Ref: —'}
                                    </div>
                                  </div>
                                </TableCell>
                                
                                <TableCell className="py-4 align-top">
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
                                
                                <TableCell className="py-4 align-top">
                                  <span className="font-semibold text-sm">
                                    {formatCurrency(p.amount, 'PHP')}
                                  </span>
                                </TableCell>
                                
                                <TableCell className="py-4 align-top text-left">
                                  {statusBadge(st)}
                                </TableCell>

                                <TableCell className="py-4 align-top pr-6 text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedPaymentId(p.id)
                                          setDetailsOpen(true)
                                        }}
                                        >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                        </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedPaymentId(p.id)
                                          // Need to ensure payment data is loaded before opening receipt
                                          // but we can set ID and let the dialog fetch/select it
                                          setReceiptOpen(true)
                                        }}
                                      >
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print Receipt
                                      </DropdownMenuItem>
                                      
                                      <DropdownMenuSeparator />
                                      
                                      <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={(e) => {
                                           e.stopPropagation()
                                           setPaymentToDelete(p)
                                           setDeleteConfirmOpen(true)
                                        }}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="flex items-center justify-between px-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Showing {Math.min(pageIndex * pageSize + 1, filteredPayments.length)} to {Math.min((pageIndex + 1) * pageSize, filteredPayments.length)} of {filteredPayments.length} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                      disabled={pageIndex <= 0}
                      className="h-8 px-3 text-xs"
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
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
        error={selectedPaymentError ?? undefined}
        paymentMethodMap={paymentMethodById}
        memberName={selectedPayment ? (() => {
           const invoice = invoiceById.get(selectedPayment.invoiceId)
           return invoice?.actorId ? memberNameByActorId.get(invoice.actorId) : undefined
        })() : undefined}
        onPrintReceipt={() => setReceiptOpen(true)}
      />

      <ReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        paymentId={selectedPaymentId}
        payment={selectedPayment}
        loading={selectedPaymentLoading}
        error={selectedPaymentError ?? undefined}
        paymentMethodMap={paymentMethodById}
        memberName={selectedPayment ? (() => {
           const invoice = invoiceById.get(selectedPayment.invoiceId)
           return invoice?.actorId ? memberNameByActorId.get(invoice.actorId) : undefined
        })() : undefined}
      />

      <DeleteAdminConfirmDialog
         open={deleteConfirmOpen}
         onOpenChange={setDeleteConfirmOpen}
         onConfirm={async () => {
             if (paymentToDelete?.id) {
                 await deletePaymentMutation.mutateAsync(paymentToDelete.id)
                 setPaymentToDelete(null)
             }
         }}
         title={`Delete Payment: ${paymentToDelete?.id}`}
         description="Are you sure you want to delete this payment record? This action cannot be undone."
         confirmText="Delete Payment"
      />
    </div>
  )
}
