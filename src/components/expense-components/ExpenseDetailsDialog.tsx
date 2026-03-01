import { useMemo } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { PaymentApi } from '@/api/generated/apis'
import { paymentQueryKeys } from '@/lib/QueryKeys'
import { EXPENSE_TYPES, SALARY_TYPES } from '@/lib/expense/expense-constants'
import { formatExpenseType, formatPesoStr } from '@/lib/expense/expense-utils'
import {
  DatePicker,
  SelectField,
  ReceiptUpload,
  ExpenseSummaryPanel,
} from '@/components/expense-components/ExpenseFormHelpers'

interface ExpenseDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  type: string;          setType: (v: string) => void
  name: string;          setName: (v: string) => void
  date: Date | undefined; setDate: (v: Date | undefined) => void
  amount: string;        setAmount: (v: string) => void
  branch: string;        setBranch: (v: string) => void
  paymentMethod: string; setPaymentMethod: (v: string) => void
  description: string;   setDescription: (v: string) => void
  receipt: File | null;  setReceipt: (v: File | null) => void
  salaryType: string;    setSalaryType: (v: string) => void
  onSubmit: () => void
  onDelete: () => void
  onCancel: () => void
  branches: string[]
}

// Field helper
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

export function ExpenseDetailsDialog({
  open, onOpenChange,
  isEditing, setIsEditing,
  type, setType,
  name, setName,
  date, setDate,
  amount, setAmount,
  branch, setBranch,
  paymentMethod, setPaymentMethod,
  description, setDescription,
  receipt, setReceipt,
  salaryType, setSalaryType,
  onSubmit, onDelete, onCancel,
  branches,
}: ExpenseDetailsDialogProps) {
  const branchOptions = useMemo(
    () => branches.map((b) => ({ value: b, label: b })),
    [branches],
  )

  // Stable API instance
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
  const paymentMethods = paymentMethodsQuery.data ?? []
  const paymentMethodName = paymentMethods.find((m) => m.id === paymentMethod)?.name ?? paymentMethod

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Expense' : 'Expense Details'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Expense Information ── */}
            <Card>
              <CardHeader><CardTitle className="text-base">Expense Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Expense Type"
                    isEditing={isEditing}
                    view={
                      <div className="flex items-center h-9">
                        <Badge variant="secondary" className="capitalize">
                          {formatExpenseType(type)}
                        </Badge>
                      </div>
                    }
                    edit={
                      <SelectField
                        id="edit-type"
                        value={type}
                        placeholder="Select type"
                        options={EXPENSE_TYPES}
                        onValueChange={(v) => {
                          setType(v)
                          if (v !== 'salary') setSalaryType('')
                        }}
                      />
                    }
                  />

                  {type === 'salary' && (
                    <Field
                      label="Salary Type"
                      isEditing={isEditing}
                      view={
                        <div className="flex items-center h-9">
                          <Badge variant="outline" className="capitalize">{salaryType}</Badge>
                        </div>
                      }
                      edit={
                        <SelectField
                          id="edit-salaryType"
                          value={salaryType}
                          placeholder="Select salary type"
                          options={SALARY_TYPES}
                          onValueChange={setSalaryType}
                        />
                      }
                    />
                  )}
                </div>

                <Field
                  label="Name / Note"
                  isEditing={isEditing}
                  view={<Input value={name} disabled className="bg-muted text-muted-foreground" />}
                  edit={
                    <Input
                      id="edit-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  }
                />

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
                        value={formatPesoStr(amount)}
                        disabled
                        className="bg-muted text-muted-foreground font-semibold"
                      />
                    }
                    edit={
                      <Input
                        id="edit-amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    }
                  />
                </div>

                <Field
                  label="Description"
                  isEditing={isEditing}
                  view={
                    <div className="min-h-[60px] rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                      {description || 'No description provided'}
                    </div>
                  }
                  edit={
                    <Textarea
                      id="edit-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  }
                />

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
                        <p className="text-center text-sm text-muted-foreground">
                          No receipt attached
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ── Payment Details ── */}
            <Card>
              <CardHeader><CardTitle className="text-base">Payment Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <Field
                  label="Branch"
                  isEditing={isEditing}
                  view={<Input value={branch} disabled className="bg-muted text-muted-foreground" />}
                  edit={
                    <SelectField
                      id="edit-branch"
                      value={branch}
                      placeholder="Select branch"
                      options={branchOptions}
                      onValueChange={setBranch}
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
                      <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                        Loading…
                      </div>
                    ) : (
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
                  type={type}
                  salaryType={salaryType}
                  branch={branch}
                  paymentMethodName={paymentMethodName}
                  receipt={receipt}
                  amount={amount}
                />
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex items-center justify-between mt-6">
            {isEditing && (
              <Button type="button" variant="destructive" onClick={onDelete} className="gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              {isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                  <Button type="button" onClick={onSubmit}>Save Changes</Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                  <Button type="button" onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit2 className="h-4 w-4" /> Edit
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
