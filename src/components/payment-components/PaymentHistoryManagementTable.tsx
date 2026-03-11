import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { format } from 'date-fns'
import { 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  Search, 
  XCircle, 
  Download, 
  CreditCard, 
  ArrowUpDown, 
  Loader2,
  Trash2,
  MoreHorizontal,
  Eye,
  Printer
} from 'lucide-react'

import { usePaymentHistoryDataQuery } from '@/hooks/billing/usePaymentHistoryLookups'
import {
  usePaymentHistoryDeleteInvoice,
  usePaymentHistoryDeletePayment,
} from '@/hooks/billing/usePaymentHistoryDelete'
import { usePaymentHistorySelectedPayment } from '@/hooks/billing/usePaymentHistorySelectedPayment'
import { mapPaymentHistoryDisplayStatus, type PaymentHistoryDisplayStatus } from '@/hooks/billing/PaymentHistory.utils'
import { parseCalendarDay } from '@/lib/date-utils'
import type {
  PaymentHistoryFilters,
  PaymentTableDTOParsed,
  InvoiceTableDTOParsed,
} from '@/types/payment/paymentSchemas'

import { PaymentDetailsDialog } from '@/components/payment-components/PaymentHistoryDetailsDialog'
import { ReceiptDialog } from '@/components/payment-components/PaymentHistoryReceiptDialog'
import { DeleteAdminConfirmDialog } from '@/components/common/DeleteAdminConfirm'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function formatCurrency(amount: number, currency: string = 'PHP') {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

function statusBadge(status: PaymentHistoryDisplayStatus) {
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

export function PaymentHistoryTable() {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceTableDTOParsed | null>(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentTableDTOParsed | null>(null)
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceTableDTOParsed | null>(null)

  const [pageSize] = useState(4)
  const [pageIndex, setPageIndex] = useState(0)

  const deletePaymentMutation = usePaymentHistoryDeletePayment()
  const deleteInvoiceMutation = usePaymentHistoryDeleteInvoice()

  const {
    invoices,
    payments,
    paymentByInvoiceId,
    invoiceById,
    paymentMethodById,
    memberNameByActorId,
    isLoading: paymentsLoading,
    methodsLoading,
    membersLoading,
    paymentsError,
  } = usePaymentHistoryDataQuery()

  const {
    selectedPayment,
    isLoading: selectedPaymentLoading,
    error: selectedPaymentError,
  } = usePaymentHistorySelectedPayment(selectedPaymentId, payments)

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

  // Filtering Logic — invoice-centric
  const filterInvoices = (filters: PaymentHistoryFilters): InvoiceTableDTOParsed[] => {
    const q = filters.query.trim().toLowerCase()
    const from = filters.fromDate ? new Date(filters.fromDate) : null
    const to = filters.toDate ? new Date(filters.toDate) : null

    return invoices.filter((inv: InvoiceTableDTOParsed) => {
      const payment = paymentByInvoiceId.get(inv.id)
      const st = mapPaymentHistoryDisplayStatus(inv, payment)
      if (filters.status !== 'all' && st !== filters.status) return false

      if (q) {
        const methodName = payment ? (paymentMethodById.get(payment.paymentMethodId)?.name ?? '') : ''
        const memberName = memberNameByActorId.get(inv.actorId) ?? ''
        const haystack = `${inv.id} ${methodName} ${inv.status} ${memberName}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }

      const date = inv.dueDate ?? inv.issuedAt ?? null
      if (from && date && date < from) return false
      if (to && date && date > to) return false
      return true
    })
  }

  // Calculate totals from filtered data — done inline in form.Subscribe render

  if (paymentsError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        {paymentsError instanceof Error ? paymentsError.message : 'Failed to load payments'}
      </div>
    )
  }

  return (
    <div className=" h-full flex flex-col mt-0">
      <form.Subscribe selector={(state) => state.values}>
        {(filters) => {
          // Compute filtered data inside render — invoice-centric
          const filteredInvoices = filterInvoices(filters).sort((a: InvoiceTableDTOParsed, b: InvoiceTableDTOParsed) => {
             const dateA = a.issuedAt?.getTime() ?? a.dueDate?.getTime() ?? 0
             const dateB = b.issuedAt?.getTime() ?? b.dueDate?.getTime() ?? 0
             return dateB - dateA
          })
          
          // Pagination
          const pageCount = Math.max(1, Math.ceil(filteredInvoices.length / pageSize))
          const pageItems = filteredInvoices.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

          return (
            <div className="flex flex-col gap-3">
              {/* Main Table Card */}
              <Card className="flex flex-col shadow-md border-muted/40 w-full ">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl font-bold tracking-tight">Payment History</CardTitle>
                      <CardDescription className="mt-1">
                        View and manage {filteredInvoices.length} billing records, invoices, and transaction statuses.
                      </CardDescription>
                    </div>
                    <Badge variant="default" className="w-fit px-3 py-1 text-sm">
                      Total: {filteredInvoices.length}
                    </Badge>
                  </div>
                </CardHeader>

              {/* Updated wrapper: make content flex-1 but remove absolute heights so the card stretches cleanly */}
              <div className="flex-1 min-h-0">
                <CardContent className="p-0">
                  <div className="p-4 border-b bg-muted/5 flex flex-col xl:flex-row items-stretch xl:items-center gap-3">
                    <div className="relative w-full xl:flex-1 xl:max-w-sm">
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
                            className="pl-9 h-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0 w-full"
                          />
                        )}
                      </form.Field>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto">
                      <form.Field name="status">
                        {(field) => (
                          <Select
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value as PaymentHistoryFilters['status'])
                              setPageIndex(0)
                            }}
                          >
                            <SelectTrigger className="h-10 w-full sm:w-35 bg-background/50 border-muted-foreground/20">
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
                                className={`justify-start text-left font-normal h-10 w-full sm:w-40 bg-background/50 border-muted-foreground/20 ${!field.state.value ? 'text-muted-foreground' : ''}`}
                                aria-label="From date"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className="truncate">
                                  {field.state.value ? format(new Date(field.state.value), 'MMM d, yyyy') : <span>From Date</span>}
                                </span>
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
                                className={`justify-start text-left font-normal h-10 w-full sm:w-40 bg-background/50 border-muted-foreground/20 ${!field.state.value ? 'text-muted-foreground' : ''}`}
                                aria-label="To date"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className="truncate">
                                  {field.state.value ? format(new Date(field.state.value), 'MMM d, yyyy') : <span>To Date</span>}
                                </span>
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

                    <div className="flex items-center  ml-auto gap-2 w-full xl:w-auto xl:mt-0 justify-end ">
                      <Button className="h-10">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {paymentsLoading ? (
                    <div className="flex min-h-55 flex-col items-center justify-center gap-2 text-muted-foreground">
                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
                       <p className="text-sm">Loading payment history...</p>
                    </div>
                  ) : filteredInvoices.length === 0 ? (
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
                            <TableHead className="w-[20%] pl-6">Member</TableHead>
                            <TableHead className="w-[20%]">Method</TableHead>
                            <TableHead className="w-[15%]">
                               <div className="flex items-center gap-1">
                                 Date
                                 <ArrowUpDown className="h-3 w-3" />
                               </div>
                            </TableHead>
                            <TableHead className="w-[15%] text-right">Amount</TableHead>
                            <TableHead className="w-[20%] text-center">Status</TableHead>
                            <TableHead className="w-[10%] text-right pr-6 whitespace-nowrap">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pageItems.map((inv: InvoiceTableDTOParsed) => {
                            const payment = paymentByInvoiceId.get(inv.id)
                            const methodName = payment ? paymentMethodById.get(payment.paymentMethodId)?.name : undefined
                            const st = mapPaymentHistoryDisplayStatus(inv, payment)
                            const memberName = memberNameByActorId.get(inv.actorId)

                            return (
                              <TableRow
                                key={inv.id}
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer hover:bg-muted/40 transition-colors group border-b border-muted/40"

                              >
                                <TableCell className="pl-6 py-4 align-top">
                                  <div className="flex items-start gap-3 w-full min-w-0">
                                    <div className="flex flex-col gap-0.5 w-full min-w-0">
                                      <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate block">
                                        {membersLoading ? '...' : (memberName || 'Unknown Member')}
                                      </span>
                                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 w-full min-w-0">
                                         <span className="truncate max-w-25 sm:max-w-30">
                                            Inv #{inv.id.slice(0, 8)}...
                                         </span>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                
                                <TableCell className="py-4 align-top">
                                  <div className="w-fit p-1 -ml-1 rounded-md hover:bg-muted transition-colors">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                                      <CreditCard className="h-3.5 w-3.5 opacity-70" />
                                      <span className="truncate max-w-30">{methodsLoading ? '...' : (methodName || '—')}</span>
                                    </div>
                                    <div className="pl-5 text-xs text-muted-foreground truncate max-w-30">
                                      {payment?.referenceNum ? `Ref: ${payment.referenceNum}` : 'Ref: —'}
                                    </div>
                                  </div>
                                </TableCell>
                                
                                <TableCell className="py-4 align-top">
                                   <div className="flex flex-col gap-0.5">
                                      {payment?.paidAt ? (
                                        <>
                                            <span className="text-sm font-medium text-foreground/80">
                                                {format(new Date(payment.paidAt), 'MMM dd, yyyy')}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(payment.paidAt), 'h:mm a')}
                                            </span>
                                        </>
                                      ) : inv.dueDate ? (
                                        <>
                                            <span className="text-xs text-muted-foreground">Due</span>
                                            <span className="text-sm font-medium text-foreground/80">
                                                {format(inv.dueDate, 'MMM dd, yyyy')}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {format(inv.dueDate, 'h:mm a')}
                                            </span>
                                        </>
                                      ) : (
                                        <span className="text-sm text-muted-foreground italic">—</span>
                                      )}
                                   </div>
                                </TableCell>
                                
                                <TableCell className="py-4 align-top text-right">
                                  <span className="font-semibold text-sm">
                                    {formatCurrency(inv.total, 'PHP')}
                                  </span>
                                </TableCell>
                                
                                <TableCell className="py-4 align-top">
                                  <div className="flex flex-col items-center justify-center">
                                    {statusBadge(st)}
                                  </div>
                                </TableCell>

                                <TableCell className="py-4 align-top text-right pr-6">
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
                                          setSelectedPaymentId(payment?.id ?? null)
                                          setSelectedInvoice(inv)
                                          setDetailsOpen(true)
                                        }}
                                        >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                        </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          if (payment) {
                                            setSelectedPaymentId(payment.id)
                                            setReceiptOpen(true)
                                          }
                                        }}
                                        disabled={!payment}
                                      >
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print Receipt
                                      </DropdownMenuItem>
                                      
                                      <DropdownMenuSeparator />
                                      
                                      <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={(e) => {
                                           e.stopPropagation()
                                           if (payment) {
                                             setPaymentToDelete(payment)
                                             setInvoiceToDelete(null)
                                           } else {
                                             setInvoiceToDelete(inv)
                                             setPaymentToDelete(null)
                                           }
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
                        {filteredInvoices.length > 0 && (
                          <TableFooter className="bg-muted/5">
                            <TableRow className="hover:bg-transparent">
                              <TableCell colSpan={6} className="p-0">
                                <div className="flex flex-col items-center justify-center gap-2 px-3 py-2 sm:flex-row sm:justify-between w-full h-full">
                                  <div className="text-sm text-center text-muted-foreground sm:text-left">
                                    Showing {Math.min(pageIndex * pageSize + 1, filteredInvoices.length)} to {Math.min((pageIndex + 1) * pageSize, filteredInvoices.length)} of {filteredInvoices.length} entries
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
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                                      Page {pageIndex + 1} / {pageCount}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                                      disabled={pageIndex >= Math.max(0, pageCount - 1)}
                                      className="h-8 px-3 text-xs"
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        )}
                      </Table>
                    </div>
                  )}
                </CardContent>
              </div>
              </Card>

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
            setSelectedInvoice(null)
          }
        }}
        paymentId={selectedPaymentId}
        payment={selectedPayment}
        invoice={selectedInvoice ?? undefined}
        loading={selectedPaymentLoading}
        error={selectedPaymentError ?? undefined}
        paymentMethodMap={paymentMethodById}
        memberName={selectedPayment ? (() => {
           const invoice = invoiceById.get(selectedPayment.invoiceId)
           return invoice?.actorId ? memberNameByActorId.get(invoice.actorId) : undefined
        })() : (selectedInvoice ? memberNameByActorId.get(selectedInvoice.actorId) : undefined)}
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
             } else if (invoiceToDelete?.id) {
                 await deleteInvoiceMutation.mutateAsync(invoiceToDelete.id)
                 setInvoiceToDelete(null)
             }
         }}
         title={paymentToDelete ? `Delete Payment: ${paymentToDelete.id}` : `Delete Invoice: ${invoiceToDelete?.id ?? ''}`}
         description={paymentToDelete
           ? 'Are you sure you want to delete this payment record? This action cannot be undone.'
           : 'Are you sure you want to delete this invoice? This action cannot be undone.'}
         confirmText={paymentToDelete ? 'Delete Payment' : 'Delete Invoice'}
      />
    </div>
  )
}
