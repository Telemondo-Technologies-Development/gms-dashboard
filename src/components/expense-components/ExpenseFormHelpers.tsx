import type { ChangeEvent } from 'react'
import { Upload, FileText, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatExpenseType, formatPeso } from '@/lib/expense/expense-utils'

// DatePicker
interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : 'Pick a date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

// SelectField
interface SelectFieldProps {
  id?: string
  value: string
  onValueChange: (v: string) => void
  placeholder: string
  options: readonly { value: string; label: string }[]
}

export function SelectField({ id, value, onValueChange, placeholder, options }: SelectFieldProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ReceiptUpload
interface ReceiptUploadProps {
  id: string
  receipt: File | null
  /** Called with the newly selected File, or null to clear. */
  onFileChange: (file: File | null) => void
  compact?: boolean
}

export function ReceiptUpload({ id, receipt, onFileChange, compact = false }: ReceiptUploadProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files?.[0] ?? null)
  }

  return (
    <div className="space-y-3">
      {compact && receipt && (
        <div className="rounded-lg border border-dashed p-4 bg-muted/50 flex items-center gap-3">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{receipt.name}</p>
            <p className="text-xs text-muted-foreground">{(receipt.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      )}
      <label
        htmlFor={id}
        className={cn(
          'flex w-full items-center justify-center rounded-lg border border-dashed cursor-pointer hover:bg-muted/50 transition-colors',
          compact ? 'px-4 py-6' : 'px-4 py-8',
        )}
      >
        <div className="text-center space-y-2">
          <Upload className={cn('mx-auto text-muted-foreground', compact ? 'h-6 w-6' : 'h-8 w-8')} />
          <div className="text-sm text-muted-foreground">
            {receipt ? (
              compact ? (
                'Change file'
              ) : (
                <span className="font-medium">{receipt.name}</span>
              )
            ) : (
              'Click to upload or drag and drop'
            )}
          </div>
          {!compact && !receipt && (
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG, DOC (max 10MB)</p>
          )}
        </div>
      </label>
      <input
        id={id}
        type="file"
        onChange={handleChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="sr-only"
      />
    </div>
  )
}

// ExpenseSummaryPanel
interface ExpenseSummaryPanelProps {
  type: string
  salaryType?: string
  branch: string
  
  paymentMethodName: string
  receipt: File | null
  amount: string
}

export function ExpenseSummaryPanel({
  type, salaryType, branch, paymentMethodName, receipt, amount,
}: ExpenseSummaryPanelProps) {
  const rows = [
    { label: 'Expense Type',   value: type              ? formatExpenseType(type) : '—' },
    ...(type === 'salary'     ? [{ label: 'Salary Type', value: salaryType || '—' }]    : []),
    { label: 'Branch',         value: branch            || '—' },
    { label: 'Payment Method', value: paymentMethodName || '—' },
    { label: 'Receipt',        value: receipt           ? 'Attached' : 'Not attached' },
  ]

  const parsedAmount = parseFloat(amount)

  return (
    <div className="rounded-xl bg-muted/50 p-4 space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{row.label}</span>
          <span className="font-medium capitalize">{row.value}</span>
        </div>
      ))}
      <div className="border-t pt-3 flex items-center justify-between">
        <span className="font-semibold">Total Amount</span>
        <span className="text-2xl font-bold text-primary">
          {parsedAmount > 0 ? formatPeso(parsedAmount) : '₱0.00'}
        </span>
      </div>
    </div>
  )
}
