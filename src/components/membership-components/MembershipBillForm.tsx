import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddPaymentMethodDialog } from '@/components/membership-components/MembershipAddPaymentMethodDrawer'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { paymentQueryKeys } from '@/lib/QueryKeys'
import { apiResponseListPaymentMethodTableDTOSchema, type PaymentMethodTableDTOParsed } from '@/types/payment/paymentSchemas'

export interface AddBillingDialogProps {
  selectedSubscription: SubscriptionAvailedTableDTO | null | undefined
  paymentMethodId: string
  onPaymentMethodChange: (id: string, name: string) => void
  totalCost: string
  disabled?: boolean
  loadPaymentMethods?: boolean
  createdById?: string | null
}

export function AddBillingDialog({
  selectedSubscription,
  paymentMethodId,
  onPaymentMethodChange,
  totalCost,
  disabled = false,
  loadPaymentMethods = true,
  createdById = null,
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Billing & Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedSubscription ? (
          <>
            <div className="space-y-2">
              <Label>Subscription Plan</Label>
              <Input value={selectedSubscription.name} disabled className="bg-muted text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label>Amount (PHP)</Label>
              <Input value={selectedSubscription.amount.toFixed(2)} disabled className="bg-muted text-muted-foreground" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Billing Interval</Label>
                <Input
                  value={`${selectedSubscription.intervalCount} ${selectedSubscription.intervals}`}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label>Grace Period</Label>
                <Input
                  value={`${selectedSubscription.gracePeriodDays} days`}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            Please select a subscription plan to view billing details
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Mode of Payment * </Label>
          <Select
            value={paymentMethodId}
            disabled={disabled}
            onValueChange={(id) => {
              if (id === EMPTY_PAYMENT_METHODS_VALUE) return
              if (id === NONE_PAYMENT_METHOD_VALUE) {
                onPaymentMethodChange('', '')
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
            </SelectContent>
          </Select>
          {!disabled ? (
            <div className="pt-2">
              <AddPaymentMethodDialog
                createdById={createdById}
                onCreated={(id, name) => onPaymentMethodChange(id, name)}
              />
            </div>
          ) : null}
        </div>

        <Card className="rounded-xl bg-muted/50 p-4 space-y-3">
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
                ? `${selectedSubscription.intervalCount} ${selectedSubscription.intervals}`
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
        </Card>
      </CardContent>
    </Card>
  )
}

