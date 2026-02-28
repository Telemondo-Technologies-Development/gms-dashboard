import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Calendar,
  CreditCard,
  FileText,
  User,
  Info,
  AlertTriangle 
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { isAdminSession } from '@/lib/auth/auth-permissions'
import { useAuthSession } from '@/lib/auth/auth-session'
import { useEmployeeDisplayName } from '@/hooks/users/useEmployeeDisplayName'
import { invoiceQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import type { PaymentTableDTOParsed, PaymentMethodTableDTOParsed } from '@/types/payment/paymentSchemas'

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
}: PaymentDetailsDialogProps) {
  const session = useAuthSession()
  const queryClient = useQueryClient()
  const isAdmin = useMemo(
    () => isAdminSession({ token: session.token, roles: session.roles }),
    [session.token, session.roles],
  )

  const [isEditing, setIsEditing] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [amountInput, setAmountInput] = useState('')
  const [methodId, setMethodId] = useState('')
  const [statusValue, setStatusValue] = useState<PaymentTableDTOParsed['status']>('IN')
  const [paidAtInput, setPaidAtInput] = useState('')
  const [failureReason, setFailureReason] = useState('')

  const paymentMethodOptions = useMemo(
    () => Array.from(paymentMethodMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    [paymentMethodMap],
  )
  const { displayName: createdByName, isLoading: isCreatedByLoading } = useEmployeeDisplayName(payment?.createdById)

  useEffect(() => {
    if (!payment) {
      setIsEditing(false)
      setEditError(null)
      return
    }

    setAmountInput(payment.amount.toString())
    setMethodId(payment.paymentMethodId)
    setStatusValue(payment.status)
    setPaidAtInput(toDateTimeLocalValue(payment.paidAt))
    setFailureReason(payment.failureReason ?? '')
    setEditError(null)
    setIsEditing(false)
  }, [payment])

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

      const paidAt = paidAtInput ? new Date(paidAtInput) : undefined
      if (paidAtInput && Number.isNaN(paidAt?.getTime())) {
        throw new Error('Paid date is invalid.')
      }

      const paymentApi = getAuthenticatedApi(PaymentApi)
      const response = await paymentApi.updatePayment({
        id: payment.id,
        paymentPutDTO: {
          amount: parsedAmount,
          paymentMethodId: methodId,
          status: statusValue,
          updatedById: session.actorId,
          paidAt,
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
           <p>Created by:{' '} <span className="text-xs">{isCreatedByLoading ? 'Loading…' : (createdByName ?? 'Unknown user')}</span></p>
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
                                  <SelectItem value="IN">IN</SelectItem>
                                  <SelectItem value="OUT">OUT</SelectItem>
                                  <SelectItem value="UNDECIDED">UNDECIDED</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Paid Date</Label>
                              <Input
                                type="datetime-local"
                                value={paidAtInput}
                                onChange={(event) => setPaidAtInput(event.target.value)}
                              />
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
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
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

          </div>
          ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
             <FileText className="h-8 w-8 opacity-20 mb-2" />
             <p className="text-sm">No payment selected.</p>
          </div>
        )}
        </div>

        {payment ? (
          <DialogFooter className="mt-2 gap-2">
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
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Transaction
                </Button>
              )
            ) : null}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function toDateTimeLocalValue(value: Date | null): string {
  if (!value) return ''
  return format(new Date(value), "yyyy-MM-dd'T'HH:mm")
}