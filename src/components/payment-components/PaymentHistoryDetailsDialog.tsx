import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Calendar as CalendarIcon,
  CreditCard,
  FileText,
  User,
  Info,
  AlertTriangle,
  UserCircle2
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { isAdminSession } from '@/lib/auth/auth-permissions'
import { useAuthSession } from '@/lib/auth/auth-session'
import { useEmployeeDisplayName } from '@/hooks/users/useStaffDisplayName'
import { invoiceQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { EditAdminConfirmDialog } from '@/components/common/EditAdminConfirm'
import {
  PaymentHistoryUpdatePaymentAdminConfirm,
  PaymentHistoryUpdatePaymentForm,
  PaymentHistoryUpdatePaymentTrigger,
} from '@/components/payment-components/PaymentHistoryUpdatePayment'
import { usePaymentHistoryUpdatePayment } from '@/hooks/billing/usePaymentHistoryUpdatePayment'
import type { PaymentTableDTOParsed, PaymentMethodTableDTOParsed, InvoiceTableDTOParsed } from '@/types/payment/paymentSchemas'

interface PaymentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentId?: string | null
  payment: PaymentTableDTOParsed | null
  loading?: boolean
  error?: string
  paymentMethodMap: Map<string, PaymentMethodTableDTOParsed>
  onPrintReceipt?: (payment: PaymentTableDTOParsed) => void
  memberName?: string
  /** Invoice to show when there is no payment record yet (e.g. pending invoice). */
  invoice?: InvoiceTableDTOParsed
}

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
        <Badge className="gap-1.5 px-2.5 py-0.5" variant="default">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Paid
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="gap-1.5 px-2.5 py-0.5" variant="destructive">
          <XCircle className="h-3.5 w-3.5" />
          Failed
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="gap-1.5 px-2.5 py-0.5 bg-orange-500 hover:bg-orange-600 border-transparent text-white" variant="outline">
          <Clock className="h-3.5 w-3.5" />
          Pending
        </Badge>
      )
  }
}

function invoiceStatusBadge(status: InvoiceTableDTOParsed['status']) {
  switch (status) {
    case 'PAID':
      return <Badge className="gap-1.5 px-2.5 py-0.5" variant="default"><CheckCircle2 className="h-3.5 w-3.5" />Paid</Badge>
    case 'OVERDUE':
      return <Badge className="gap-1.5 px-2.5 py-0.5" variant="destructive"><XCircle className="h-3.5 w-3.5" />Overdue</Badge>
    case 'PENDING':
    case 'ISSUED':
    case 'DUE':
      return <Badge className="gap-1.5 px-2.5 py-0.5 bg-orange-500 hover:bg-orange-600 border-transparent text-white" variant="outline"><Clock className="h-3.5 w-3.5" />{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function PaymentDetailsDialog({
  open,
  onOpenChange,
  paymentId,
  payment,
  loading,
  error,
  paymentMethodMap,
  onPrintReceipt,
  memberName,
  invoice,
}: PaymentDetailsDialogProps) {
  const session = useAuthSession()
  const queryClient = useQueryClient()
  const isAdmin = useMemo(
    () => isAdminSession({ token: session.token, roles: session.roles }),
    [session.token, session.roles],
  )

  const [isEditing, setIsEditing] = useState(false)
  const [showEditConfirm, setShowEditConfirm] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [amountInput, setAmountInput] = useState('')
  const [methodId, setMethodId] = useState('')
  const [statusValue, setStatusValue] = useState<PaymentTableDTOParsed['status']>('PENDING')
  const [paidAt, setPaidAt] = useState<Date | undefined>(undefined)
  const [failureReason, setFailureReason] = useState('')
  const paymentMethodOptions = useMemo(
    () => Array.from(paymentMethodMap.values()).sort((left, right) => left.name.localeCompare(right.name)),
    [paymentMethodMap],
  )
  const { displayName: createdByName, isLoading: isCreatedByLoading } = useEmployeeDisplayName(payment?.createdById)
  const updatePaymentController = usePaymentHistoryUpdatePayment({
    payment,
    invoice,
    paymentMethodMap,
  })
  const resetUpdatePaymentState = updatePaymentController.resetState

  useEffect(() => {
    if (!payment) {
      setIsEditing(false)
      setEditError(null)
      resetUpdatePaymentState()
      return
    }

    setAmountInput(payment.amount.toString())
    setMethodId(payment.paymentMethodId)
    setStatusValue(payment.status)
    setPaidAt(payment.paidAt ?? undefined)
    setFailureReason(payment.failureReason ?? '')
    setEditError(null)
    setIsEditing(false)
    resetUpdatePaymentState()
  }, [payment, resetUpdatePaymentState])

  const updatePaymentMutation = useMutation({
    mutationFn: async () => {
      if (!payment) throw new Error('No payment selected.')
      if (!session.actorId) throw new Error('Missing actor ID for current user.')

      const parsedAmount = Number(amountInput)
      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
        throw new Error('Amount must be a valid positive number.')
      }
      if (!methodId.trim()) {
        throw new Error('Payment method is required.')
      }

      const paidAtDate = paidAt instanceof Date && !Number.isNaN(paidAt.getTime()) ? paidAt : undefined

      const paymentApi = getAuthenticatedApi(PaymentApi)
      const response = await paymentApi.updatePayment({
        id: payment.id,
        paymentPutDTO: {
          amount: parsedAmount,
          paymentMethodId: methodId,
          status: statusValue,
          updatedById: session.actorId,
          paidAt: paidAtDate,
          failureReason: failureReason.trim() || undefined,
        },
      })

      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to update payment.')
      }

      return response.data
    },
    onSuccess: () => {
      setEditError(null)
      setIsEditing(false)
      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments] })
      void queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] })
    },
    onError: (error: unknown) => {
      setEditError(error instanceof Error ? error.message : 'Failed to update payment.')
    },
  })

  const canSave =
    !!payment &&
    !!methodId.trim() &&
    !!amountInput.trim() &&
    Number(amountInput) >= 0 &&
    !updatePaymentMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Payment Details</DialogTitle>
          <DialogDescription>
            View and manage payment transaction details
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              {error}
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-2 text-muted-foreground">
               <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
               <p className="text-sm">Loading payment details...</p>
            </div>
          ) : payment ? (
            <div className="space-y-6 pb-4">
              {editError ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {editError}
                </div>
              ) : null}

              {/* Status Card */}
            <Card className="bg-muted/10 border-none shadow-sm">
                <CardContent className="p-4 flex flex-row items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground font-medium">Payment Status</span>
                        <div className="mt-1">{statusBadge(mapDisplayStatus(payment))}</div>
                    </div>
                    <div className="text-right">
                         <span className="text-sm text-muted-foreground font-medium">Total Amount</span>
                         <div className="text-2xl font-bold tracking-tight text-primary">
                             {formatCurrency(payment.amount, 'PHP')}
                         </div>
                    </div>
                </CardContent>
            </Card>

            <div className={isEditing ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
                <div className="space-y-4">
                     <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" /> Member Information
                     </h4>
                     <div className="rounded-lg border p-3 bg-card space-y-3">
                         <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Payer Name</p>
                            <p className="font-medium text-sm mt-0.5">{memberName || '—'}</p>
                         </div>
                         <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Invoice ID</p>
                            <p className="font-mono text-xs mt-0.5 break-all text-muted-foreground">{payment.invoiceId}</p>
                         </div>
                         <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                              <UserCircle2 className="h-3 w-3" />
                              Created By
                            </p>
                            <p className="font-medium text-sm mt-0.5">
                              {isCreatedByLoading ? 'Loading…' : (createdByName ?? 'Unknown user')}
                            </p>
                         </div>
                     </div>
                </div>

                <div className="space-y-4">
                     <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-4 w-4" /> Transaction Details
                     </h4>
                     <div className="rounded-lg border p-3 bg-card space-y-3">
                        {isEditing ? (
                          <>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Payment Method</Label>
                              <Select value={methodId} onValueChange={setMethodId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                  {paymentMethodOptions.map((method) => (
                                    <SelectItem key={method.id} value={method.id}>
                                      {method.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Amount</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amountInput}
                                onChange={(event) => setAmountInput(event.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
                              <Select value={statusValue} onValueChange={(value) => setStatusValue(value as PaymentTableDTOParsed['status'])}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="FULL">Full</SelectItem>
                                  <SelectItem value="PARTIAL">Partial</SelectItem>
                                  <SelectItem value="PENDING">Pending</SelectItem>
                                  <SelectItem value="MISSED">Missed</SelectItem>
                                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                  <SelectItem value="WAITING">Waiting</SelectItem>
                                  <SelectItem value="FAILED">Failed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Paid Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                                    {paidAt ? format(paidAt, 'MMM d, yyyy h:mm a') : <span className="text-muted-foreground">Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={paidAt}
                                    onSelect={(date) => setPaidAt(date ?? undefined)}
                                    disabled={{ after: new Date() }}
                                    initialFocus
                                  />
                                  <div className="mt-2 flex items-center justify-end gap-2 border-t pt-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setPaidAt(undefined)}
                                    >
                                      Clear
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => setPaidAt(new Date())}
                                    >
                                      Today
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Failure Reason</Label>
                              <Textarea
                                rows={2}
                                value={failureReason}
                                onChange={(event) => setFailureReason(event.target.value)}
                                placeholder="Optional"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider">Payment Method</p>
                              <p className="font-medium text-sm mt-0.5 flex items-center gap-2">
                                {paymentMethodMap.get(payment.paymentMethodId)?.name ?? 'Unknown Method'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider">Reference Number</p>
                              <p className="font-medium text-sm mt-0.5">{payment.referenceNum ?? '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider">Paid Date</p>
                              <p className="font-medium text-sm mt-0.5 flex items-center gap-2">
                                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                {payment.paidAt ? format(new Date(payment.paidAt), 'MMM d, yyyy h:mm a') : '—'}
                              </p>
                            </div>
                          </>
                        )}
                     </div>
                </div>
            </div>

            {payment.failureReason && (
                 <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <div className="flex items-start gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold">Payment Failed</p>
                            <p className="text-sm opacity-90 mt-1">{payment.failureReason}</p>
                        </div>
                    </div>
                 </div>
            )}
            
            <Separator />
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                <span>Recorded on {payment.paidAt ? format(new Date(payment.paidAt), 'PPpp') : '—'}</span>
            </div>

            <PaymentHistoryUpdatePaymentForm controller={updatePaymentController} />

          </div>
          ) : invoice ? (
          <div className="space-y-6 pb-4">
            <Card className="bg-muted/10 border-none shadow-sm">
              <CardContent className="p-4 flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground font-medium">Invoice Status</span>
                  <div className="mt-1">{invoiceStatusBadge(invoice.status)}</div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground font-medium">Total Due</span>
                  <div className="text-2xl font-bold tracking-tight text-primary">
                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(invoice.total)}
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" /> Member Information
                </h4>
                <div className="rounded-lg border p-3 bg-card space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Member</p>
                    <p className="font-medium text-sm mt-0.5">{memberName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Invoice ID</p>
                    <p className="font-mono text-xs mt-0.5 break-all text-muted-foreground">{invoice.id}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" /> Invoice Details
                </h4>
                <div className="rounded-lg border p-3 bg-card space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Issued</p>
                    <p className="font-medium text-sm mt-0.5">{invoice.issuedAt ? format(invoice.issuedAt, 'MMM d, yyyy h:mm a') : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Due Date</p>
                    <p className="font-medium text-sm mt-0.5">{invoice.dueDate ? format(invoice.dueDate, 'MMM d, yyyy h:mm a') : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Grace Period Ends</p>
                    <p className="font-medium text-sm mt-0.5">{invoice.gracePeriodDate ? format(invoice.gracePeriodDate, 'MMM d, yyyy') : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
            {!updatePaymentController.markPaidMode && (
              <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800 dark:bg-orange-950 dark:text-orange-300 flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                No payment has been recorded for this invoice yet.
              </div>
            )}

            <PaymentHistoryUpdatePaymentForm controller={updatePaymentController} />
          </div>
          ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
             <FileText className="h-8 w-8 opacity-20 mb-2" />
             <p className="text-sm">No payment selected.</p>
          </div>
        )}
        </div>

        {(payment || invoice) ? (
          <DialogFooter className="mt-2 gap-2">
            <PaymentHistoryUpdatePaymentTrigger controller={updatePaymentController} isEditing={isEditing} />

            {isAdmin ? (
              isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={updatePaymentMutation.isPending}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => void updatePaymentMutation.mutateAsync()} disabled={!canSave}>
                    {updatePaymentMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                !updatePaymentController.markPaidMode ? (
                  <Button type="button" onClick={() => setShowEditConfirm(true)}>
                    Edit Transaction
                  </Button>
                ) : null
              )
            ) : null}
          </DialogFooter>
        ) : null}
        
        <EditAdminConfirmDialog
          open={showEditConfirm}
          onOpenChange={setShowEditConfirm}
          onConfirm={() => {
            setIsEditing(true)
            setShowEditConfirm(false)
          }}
          title="Unlock Edit Access"
          description="Admin confirmation is required to edit this payment transaction. Please enter your admin password to proceed."
          confirmText="Unlock & Edit"
        />

        <PaymentHistoryUpdatePaymentAdminConfirm controller={updatePaymentController} />
      </DialogContent>
    </Dialog>
  )
}