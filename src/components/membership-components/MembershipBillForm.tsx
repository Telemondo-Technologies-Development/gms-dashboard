import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InlineAddPaymentMethodForm } from '@/components/membership-components/MembershipAddPaymentMethod'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { paymentQueryKeys } from '@/lib/QueryKeys'
import { apiResponseListPaymentMethodTableDTOSchema, type PaymentMethodTableDTOParsed } from '@/types/payment/paymentSchemas'
import { formatBillingCycle } from '@/lib/billing-utils'

export interface AddBillingDialogProps {
  selectedSubscription: SubscriptionAvailedTableDTO | null | undefined
  paymentMethodId: string
  onPaymentMethodChange: (id: string, name: string) => void
  paymentReferenceNum: string
  onPaymentReferenceNumChange: (value: string) => void
  totalCost: string
  disabled?: boolean
  loadPaymentMethods?: boolean
  createdById?: string | null
  newPaymentMethodForm?: {
    name: string
    setName: React.Dispatch<React.SetStateAction<string>>
    error: string | null
  }
  onCreatePaymentMethod?: () => Promise<void>
  isCreatingPaymentMethod?: boolean
}

export function AddBillingDialog({
  selectedSubscription,
  paymentMethodId,
  onPaymentMethodChange,
  paymentReferenceNum,
  onPaymentReferenceNumChange,
  totalCost,
  disabled = false,
  loadPaymentMethods = true,
  createdById: _createdById = null,
  newPaymentMethodForm,
  onCreatePaymentMethod,
  isCreatingPaymentMethod = false,
}: AddBillingDialogProps) {
  const NONE_PAYMENT_METHOD_VALUE = '__none__'
  const EMPTY_PAYMENT_METHODS_VALUE = '__empty_payment_methods__'

  const paymentApi = getAuthenticatedApi(PaymentApi)

  const paymentMethodsQuery = useQuery<PaymentMethodTableDTOParsed[]>({
    queryKey: [paymentQueryKeys.paymentMethods],
    enabled: loadPaymentMethods,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await paymentApi.getAllPaymentMethods({ pageable: { page: 0, size: 200 } })
      const parsed = apiResponseListPaymentMethodTableDTOSchema.parse(response)
      return parsed.data ?? []
    },
  })

  const paymentMethods = (paymentMethodsQuery.data ?? []).filter((m) => {
    const id = typeof m.id === 'string' ? m.id.trim() : ''
    return id.length > 0 && id !== NONE_PAYMENT_METHOD_VALUE && id !== EMPTY_PAYMENT_METHODS_VALUE
  })
  const selectedPaymentMethodName = paymentMethods.find((m) => m.id === paymentMethodId)?.name ?? ''
  const effectivePaymentMethodName =
    paymentMethodId === 'new_payment_method'
      ? (newPaymentMethodForm?.name ?? '')
      : selectedPaymentMethodName
  const requiresReference =
    !!paymentMethodId &&
    paymentMethodId !== NONE_PAYMENT_METHOD_VALUE &&
    effectivePaymentMethodName.trim().length > 0 &&
    !effectivePaymentMethodName.trim().toLowerCase().includes('cash')

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium leading-none tracking-tight">Billing & Payment</h3>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Mode of Payment <span className="text-red-500">*</span>  </Label>
          <Select
            value={paymentMethodId}
            disabled={disabled}
            onValueChange={(id) => {
              if (id === EMPTY_PAYMENT_METHODS_VALUE) return
              if (id === NONE_PAYMENT_METHOD_VALUE) {
                onPaymentMethodChange('', '')
                return
              }
              if (id === 'new_payment_method') {
                onPaymentMethodChange('new_payment_method', '')
                return
              }
              const name = paymentMethods.find((m) => m.id === id)?.name ?? ''
              onPaymentMethodChange(id, name)
            }}
          >
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_PAYMENT_METHOD_VALUE}>No payment recorded</SelectItem>
              {paymentMethods.length ? (
                paymentMethods.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={EMPTY_PAYMENT_METHODS_VALUE} disabled>
                  No payment methods found
                </SelectItem>
              )}
              {!disabled && newPaymentMethodForm && (
                <SelectItem value="new_payment_method" className="text-primary font-medium">
                  + New Payment Method
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {paymentMethodId === 'new_payment_method' && !disabled && newPaymentMethodForm && (
            <>
              <InlineAddPaymentMethodForm
                name={newPaymentMethodForm.name}
                setName={newPaymentMethodForm.setName}
                onCancel={() => onPaymentMethodChange('', '')}
                error={newPaymentMethodForm.error}
              />
              {onCreatePaymentMethod && (
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => void onCreatePaymentMethod()}
                    disabled={isCreatingPaymentMethod || !newPaymentMethodForm.name.trim()}
                  >
                    {isCreatingPaymentMethod ? 'Saving...' : 'Create Method'}
                  </Button>
                </div>
              )}
            </>
          )}

          {disabled && newPaymentMethodForm && onCreatePaymentMethod && (
            <>
              <InlineAddPaymentMethodForm
                name={newPaymentMethodForm.name}
                setName={newPaymentMethodForm.setName}
                onCancel={() => onPaymentMethodChange('', '')}
                error={newPaymentMethodForm.error}
              />
              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => void onCreatePaymentMethod()}
                  disabled={isCreatingPaymentMethod || !newPaymentMethodForm.name.trim()}
                >
                  {isCreatingPaymentMethod ? 'Saving...' : 'Create Method'}
                </Button>
              </div>
            </>
          )}

          {requiresReference && (
            <div className="space-y-2">
              <Label htmlFor="paymentReferenceNum">Reference Number <span className="text-red-500">*</span></Label>
              <Input
                id="paymentReferenceNum"
                value={paymentReferenceNum}
                onChange={(event) => onPaymentReferenceNumChange(event.target.value)}
                placeholder="Enter transaction reference number"
                disabled={disabled}
              />
              {!paymentReferenceNum.trim() ? (
                <p className="text-xs text-destructive">Reference number is required for non-cash payments.</p>
              ) : null}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subscription</span>
            <span className="font-medium">{selectedSubscription?.name || '—'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">
              PHP {selectedSubscription ? selectedSubscription.amount.toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Billing cycle</span>
            <span className="font-medium">
              {selectedSubscription
                ? formatBillingCycle(selectedSubscription.intervalCount, selectedSubscription.intervals)
                : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Mode of payment</span>
            <span className="font-medium">{selectedPaymentMethodName || '—'}</span>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">PHP {totalCost}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

