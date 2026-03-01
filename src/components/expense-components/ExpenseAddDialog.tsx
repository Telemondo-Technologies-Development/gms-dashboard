import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { PaymentApi } from '@/api/generated/apis'
import { paymentQueryKeys } from '@/lib/QueryKeys'
import { EXPENSE_TYPES, SALARY_TYPES } from '@/lib/expense/expense-constants'
import {
  useAssetOptions,
  useMaintenanceOptions,
  useSuppliesLogOptions,
} from '@/hooks/expense/useExpensePickerData.ts'
import {
  DatePicker,
  SelectField,
  ReceiptUpload,
  ExpenseSummaryPanel,
} from '@/components/expense-components/ExpenseFormHelpers'
import type { AddExpenseFormData } from '@/lib/expense/expense-types'

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: AddExpenseFormData
  setFormData: React.Dispatch<React.SetStateAction<AddExpenseFormData>>
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  receipt: File | null
  setReceipt: (file: File | null) => void
  onSubmit: () => void
  onCancel: () => void
  branches: string[]
  isPending?: boolean
}

// Per-type linked-record pickers
function AssetPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data = [], isLoading } = useAssetOptions(true)
  if (isLoading) return <Skeleton className="h-9 w-full" />
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger>
      <SelectContent>
        {data.map((a) => <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

function MaintenancePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data = [], isLoading } = useMaintenanceOptions(true)
  if (isLoading) return <Skeleton className="h-9 w-full" />
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Select maintenance record" /></SelectTrigger>
      <SelectContent>
        {data.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

function SuppliesLogPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data = [], isLoading } = useSuppliesLogOptions(true)
  if (isLoading) return <Skeleton className="h-9 w-full" />
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Select supplies log" /></SelectTrigger>
      <SelectContent>
        {data.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

// Type-specific extra fields
function TypeExtraFields({
  type, formData, set,
}: {
  type: string
  formData: AddExpenseFormData
  set: (patch: Partial<AddExpenseFormData>) => void
}) {
  switch (type) {
    case 'asset':
      return (
        <div className="space-y-2">
          <Label>Asset *</Label>
          <AssetPicker
            value={formData.assetId ?? ''}
            onChange={(v) => set({ assetId: v })}
          />
        </div>
      )

    case 'asset-maintenance':
      return (
        <div className="space-y-2">
          <Label>Maintenance Record *</Label>
          <MaintenancePicker
            value={formData.assetMaintenanceId ?? ''}
            onChange={(v) => set({ assetMaintenanceId: v })}
          />
        </div>
      )

    case 'salary':
      return (
        <div className="space-y-2">
          <Label>Salary Type *</Label>
          <SelectField
            value={formData.salaryType ?? ''}
            placeholder="Select salary type"
            options={SALARY_TYPES}
            onValueChange={(v) => set({ salaryType: v })}
          />
        </div>
      )

    case 'utility':
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Utility Type ID *</Label>
            <Input
              placeholder="Enter utility type ID"
              value={formData.utilityTypeId ?? ''}
              onChange={(e) => set({ utilityTypeId: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Meter *</Label>
            <Input
              placeholder="Enter meter number"
              value={formData.meter ?? ''}
              onChange={(e) => set({ meter: e.target.value })}
            />
          </div>
        </div>
      )

    case 'supplies':
      return (
        <div className="space-y-2">
          <Label>Supplies Log *</Label>
          <SuppliesLogPicker
            value={formData.suppliesLogId ?? ''}
            onChange={(v) => set({ suppliesLogId: v })}
          />
        </div>
      )

    case 'other':
      return (
        <div className="space-y-2">
          <Label>Expense Category ID *</Label>
          <Input
            placeholder="Enter other expense type ID"
            value={formData.otherExpenseTypeId ?? ''}
            onChange={(e) => set({ otherExpenseTypeId: e.target.value })}
          />
        </div>
      )

    default:
      return null
  }
}

// Main dialog
export function AddExpenseDialog({
  open, onOpenChange,
  formData, setFormData,
  date, setDate,
  receipt, setReceipt,
  onSubmit, onCancel,
  branches,
  isPending = false,
}: AddExpenseDialogProps) {
  const set = (patch: Partial<AddExpenseFormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }))

  // Validation helpers
  const isFormValid = useMemo(() => {
    if (!date || !formData.type || !formData.amount || !formData.branch) {
      return false
    }
    
    // Type-specific validation
    switch (formData.type) {
      case 'asset':
        return !!formData.assetId
      case 'asset-maintenance':
        return !!formData.assetMaintenanceId
      case 'salary':
        return true // salaryType has default
      case 'utility':
        return !!formData.utilityTypeId && !!formData.meter
      case 'supplies':
        return !!formData.suppliesLogId
      case 'other':
        return !!formData.otherExpenseTypeId
      default:
        return false
    }
  }, [date, formData, date])

  const branchOptions = useMemo(
    () => branches.map((b) => ({ value: b, label: b })),
    [branches],
  )

  const paymentApi = useMemo(() => getAuthenticatedApi(PaymentApi), [])
  const paymentMethodsQuery = useQuery({
    queryKey: [paymentQueryKeys.paymentMethods],
    staleTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await paymentApi.getAllPaymentMethods({ pageable: { page: 0, size: 200 } })
      return res.data ?? []
    },
  })
  const paymentMethods = paymentMethodsQuery.data ?? []
  const paymentMethodName = paymentMethods.find((m) => m.id === formData.paymentMethod)?.name ?? ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Record a new expense entry with receipt and payment details.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Expense Information */}
            <Card>
              <CardHeader><CardTitle className="text-base">Expense Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">

                {/* Expense type */}
                <div className="space-y-2">
                  <Label>Expense Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => set({
                      type: v,
                      
                      name: '', 
                      assetId: undefined,
                      assetMaintenanceId: undefined,
                      salaryType: v === 'salary' ? (formData.salaryType || '') : '',
                      utilityTypeId: undefined,
                      meter: undefined,
                      suppliesLogId: undefined,
                      otherExpenseTypeId: undefined,
                    })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {EXPENSE_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type-specific fields */}
                {formData.type && (
                  <TypeExtraFields type={formData.type} formData={formData} set={set} />
                )}


                {/* Date + Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <DatePicker date={date} onSelect={setDate} />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (PHP) *</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => {
                        if (/^\d*\.?\d*$/.test(e.target.value)) set({ amount: e.target.value })
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Additional notes or details..."
                    value={formData.description}
                    onChange={(e) => set({ description: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Receipt */}
                <div className="space-y-2">
                  <Label>Receipt / Document</Label>
                  <ReceiptUpload id="add-receipt" receipt={receipt} onFileChange={setReceipt} />
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader><CardTitle className="text-base">Payment Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Branch *</Label>
                  <SelectField
                    value={formData.branch}
                    placeholder="Select branch"
                    options={branchOptions}
                    onValueChange={(v) => set({ branch: v })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  {paymentMethodsQuery.isLoading ? (
                    <Skeleton className="h-9 w-full" />
                  ) : (
                    <Select value={formData.paymentMethod} onValueChange={(v) => set({ paymentMethod: v })}>
                      <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <ExpenseSummaryPanel
                  type={formData.type}
                  salaryType={formData.salaryType}
                  branch={formData.branch}
                  paymentMethodName={paymentMethodName}
                  receipt={receipt}
                  amount={formData.amount}
                />
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => { onCancel(); onOpenChange(false) }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="button" onClick={onSubmit} disabled={isPending || !isFormValid}>
              {isPending ? 'Creating…' : 'Create Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
