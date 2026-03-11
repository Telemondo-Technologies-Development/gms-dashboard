import { useMemo, useState } from 'react'
import { Edit2, Trash2, FileText, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { PaymentApi } from '@/api/generated/apis'
import { paymentQueryKeys } from '@/lib/QueryKeys'
import { EXPENSE_TYPES, SALARY_TYPES } from '@/lib/expense/expense-constants'
import { formatExpenseType, formatPesoStr } from '@/lib/expense/expense-utils'
import {
  useAssetOptions,
  useMaintenanceOptions,
  useSuppliesLogOptions,
} from '@/hooks/expense/useExpensePickerData'
import {
  DatePicker,
  SelectField,
  ReceiptUpload,
  ExpenseSummaryPanel,
} from '@/components/expense-components/ExpenseFormHelpers'
import type { AddExpenseFormData } from '@/lib/expense/expense-types'

interface ExpenseDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  formData: AddExpenseFormData
  setFormData: React.Dispatch<React.SetStateAction<AddExpenseFormData>>
  date: Date | undefined
  setDate: (v: Date | undefined) => void
  receipt: File | null
  setReceipt: (v: File | null) => void
  onSubmit: () => void
  onDelete: () => void
  onCancel: () => void
  branches: string[]
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label, view, edit, isEditing,
}: {
  label: string
  view: React.ReactNode
  edit: React.ReactNode
  isEditing: boolean
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {isEditing ? edit : view}
    </div>
  )
}

// ── Searchable asset picker ───────────────────────────────────────────────────
function SearchableAssetPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data = [], isLoading } = useAssetOptions(true)
  const [search, setSearch] = useState('')
  if (isLoading) return <Skeleton className="h-9 w-full" />
  const filtered = data.filter((a) =>
    a.label.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  )
  const selected = data.find((a) => a.id === value)
  return (
    <div className="space-y-1">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger>
        <SelectContent>
          <div className="px-2 pb-1 pt-0.5">
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          {filtered.length === 0 && (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">No assets found</div>
          )}
          {filtered.map((a) => (
            <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected && (
        <p className="text-xs text-muted-foreground font-mono">ID: {selected.id}</p>
      )}
    </div>
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

// ── Type-specific extra fields ────────────────────────────────────────────────
function TypeExtraFields({
  type, formData, set, isEditing,
}: {
  type: string
  formData: AddExpenseFormData
  set: (patch: Partial<AddExpenseFormData>) => void
  isEditing: boolean
}) {
  switch (type) {
    case 'asset':
      return (
        <Field
          label="Asset"
          isEditing={isEditing}
          view={
            <div className="space-y-1">
              <Input value={formData.assetId ?? '—'} disabled className="bg-muted text-muted-foreground" />
              {formData.assetId && (
                <p className="text-xs text-muted-foreground font-mono">ID: {formData.assetId}</p>
              )}
            </div>
          }
          edit={<SearchableAssetPicker value={formData.assetId ?? ''} onChange={(v) => set({ assetId: v })} />}
        />
      )
    case 'asset-maintenance':
      return (
        <Field
          label="Maintenance Record"
          isEditing={isEditing}
          view={<Input value={formData.assetMaintenanceId ?? '—'} disabled className="bg-muted text-muted-foreground" />}
          edit={<MaintenancePicker value={formData.assetMaintenanceId ?? ''} onChange={(v) => set({ assetMaintenanceId: v })} />}
        />
      )
    case 'salary':
      return (
        <Field
          label="Salary Type"
          isEditing={isEditing}
          view={
            <div className="flex items-center h-9">
              <Badge variant="outline" className="capitalize">{formData.salaryType || '—'}</Badge>
            </div>
          }
          edit={
            <SelectField
              value={formData.salaryType ?? ''}
              placeholder="Select salary type"
              options={SALARY_TYPES}
              onValueChange={(v) => set({ salaryType: v })}
            />
          }
        />
      )
    case 'utility':
      return (
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Utility Type ID"
            isEditing={isEditing}
            view={<Input value={formData.utilityTypeId ?? '—'} disabled className="bg-muted text-muted-foreground" />}
            edit={
              <Input
                placeholder="Enter utility type ID"
                value={formData.utilityTypeId ?? ''}
                onChange={(e) => set({ utilityTypeId: e.target.value })}
              />
            }
          />
          <Field
            label="Meter"
            isEditing={isEditing}
            view={<Input value={formData.meter ?? '—'} disabled className="bg-muted text-muted-foreground" />}
            edit={
              <Input
                placeholder="Enter meter number"
                value={formData.meter ?? ''}
                onChange={(e) => set({ meter: e.target.value })}
              />
            }
          />
        </div>
      )
    case 'supplies':
      return (
        <Field
          label="Supplies Log"
          isEditing={isEditing}
          view={<Input value={formData.suppliesLogId ?? '—'} disabled className="bg-muted text-muted-foreground" />}
          edit={<SuppliesLogPicker value={formData.suppliesLogId ?? ''} onChange={(v) => set({ suppliesLogId: v })} />}
        />
      )
    case 'other':
      return (
        <Field
          label="Expense Category ID"
          isEditing={isEditing}
          view={<Input value={formData.otherExpenseTypeId ?? '—'} disabled className="bg-muted text-muted-foreground" />}
          edit={
            <Input
              placeholder="Enter other expense type ID"
              value={formData.otherExpenseTypeId ?? ''}
              onChange={(e) => set({ otherExpenseTypeId: e.target.value })}
            />
          }
        />
      )
    default:
      return null
  }
}

// ── Main dialog ───────────────────────────────────────────────────────────────
export function ExpenseDetailsDialog({
  open, onOpenChange,
  isEditing, setIsEditing,
  formData, setFormData,
  date, setDate,
  receipt, setReceipt,
  onSubmit, onDelete, onCancel,
  branches,
}: ExpenseDetailsDialogProps) {
  const set = (patch: Partial<AddExpenseFormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }))

  const branchOptions = useMemo(
    () => branches.map((b) => ({ value: b, label: b })),
    [branches],
  )

  const paymentApi = useMemo(() => getAuthenticatedApi(PaymentApi), [])
  const paymentMethodsQuery = useQuery({
    queryKey: [paymentQueryKeys.paymentMethods],
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await paymentApi.getAllPaymentMethods({ pageable: { page: 0, size: 200 } })
      return res.data ?? []
    },
  })
  const paymentMethods    = paymentMethodsQuery.data ?? []
  const paymentMethodName = paymentMethods.find((m) => m.id === formData.paymentMethod)?.name ?? formData.paymentMethod

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[95vh] flex flex-col p-0 gap-0">

        {/* Sticky header */}
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle>{isEditing ? 'Edit Expense' : 'Expense Details'}</DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Expense Information */}
              <Card>
                <CardHeader><CardTitle className="text-base">Expense Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">

                  <Field
                    label="Expense Type"
                    isEditing={isEditing}
                    view={
                      <div className="flex items-center h-9">
                        <Badge variant="secondary" className="capitalize">
                          {formatExpenseType(formData.type)}
                        </Badge>
                      </div>
                    }
                    edit={
                      <SelectField
                        id="edit-type"
                        value={formData.type}
                        placeholder="Select type"
                        options={EXPENSE_TYPES}
                        onValueChange={(v) => set({
                          type: v,
                          assetId: undefined,
                          assetMaintenanceId: undefined,
                          salaryType: v === 'salary' ? (formData.salaryType || '') : '',
                          utilityTypeId: undefined,
                          meter: undefined,
                          suppliesLogId: undefined,
                          otherExpenseTypeId: undefined,
                        })}
                      />
                    }
                  />

                  {formData.type && (
                    <TypeExtraFields
                      type={formData.type}
                      formData={formData}
                      set={set}
                      isEditing={isEditing}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Date"
                      isEditing={isEditing}
                      view={
                        <div className="flex items-center gap-2 text-sm text-muted-foreground h-9">
                          <CalendarIcon className="h-3 w-3" />
                          {date ? format(date, 'MMM dd, yyyy') : '—'}
                        </div>
                      }
                      edit={<DatePicker date={date} onSelect={setDate} />}
                    />
                    <Field
                      label="Amount (PHP)"
                      isEditing={isEditing}
                      view={
                        <Input
                          value={formatPesoStr(formData.amount)}
                          disabled
                          className="bg-muted text-muted-foreground font-semibold"
                        />
                      }
                      edit={
                        <Input
                          id="edit-amount"
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => set({ amount: e.target.value })}
                          required
                        />
                      }
                    />
                  </div>

                  {/* Remarks / Description */}
                  <Field
                    label="Remarks / Description"
                    isEditing={isEditing}
                    view={
                      <div className="min-h-[60px] rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                        {formData.remarks || <span className="italic">No remarks added.</span>}
                      </div>
                    }
                    edit={
                      <Textarea
                        placeholder="Additional notes or details..."
                        value={formData.remarks ?? ''}
                        onChange={(e) => set({ remarks: e.target.value })}
                        rows={3}
                      />
                    }
                  />

                  {/* Receipt */}
                  <div className="space-y-2">
                    <Label>Receipt / Document</Label>
                    {isEditing ? (
                      <ReceiptUpload
                        id="edit-receipt"
                        receipt={receipt}
                        onFileChange={setReceipt}
                        compact
                      />
                    ) : (
                      <div className="rounded-lg border border-dashed p-8 bg-muted/50">
                        {receipt ? (
                          <div className="flex items-center justify-center gap-3">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                            <div className="text-center">
                              <p className="text-sm font-medium">{receipt.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(receipt.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-center text-sm text-muted-foreground">No receipt attached</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader><CardTitle className="text-base">Payment Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Field
                    label="Branch"
                    isEditing={isEditing}
                    view={<Input value={formData.branch} disabled className="bg-muted text-muted-foreground" />}
                    edit={
                      <SelectField
                        id="edit-branch"
                        value={formData.branch}
                        placeholder="Select branch"
                        options={branchOptions}
                        onValueChange={(v) => set({ branch: v })}
                      />
                    }
                  />

                  <Field
                    label="Payment Method"
                    isEditing={isEditing}
                    view={
                      <Input
                        value={paymentMethodName}
                        disabled
                        className="bg-muted text-muted-foreground capitalize"
                      />
                    }
                    edit={
                      paymentMethodsQuery.isLoading ? (
                        <Skeleton className="h-9 w-full" />
                      ) : (
                        <Select value={formData.paymentMethod} onValueChange={(v) => set({ paymentMethod: v })}>
                          <SelectTrigger id="edit-paymentMethod">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((m) => (
                              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }
                  />

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
          </form>
        </div>

        {/* Sticky footer */}
        <DialogFooter className="px-6 py-4 border-t flex-shrink-0 flex items-center justify-between">
          {isEditing ? (
            <>
              <Button type="button" variant="destructive" onClick={onDelete} className="gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="button" onClick={onSubmit}>Save Changes</Button>
              </div>
            </>
          ) : (
            <>
              <div /> {/* spacer */}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                <Button type="button" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 className="h-4 w-4" /> Edit
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}