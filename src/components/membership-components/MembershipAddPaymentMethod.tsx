import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InlineAddPaymentMethodFormProps {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  onCancel: () => void
  error?: string | null
}

export function InlineAddPaymentMethodForm({ name, setName, onCancel, error }: InlineAddPaymentMethodFormProps) {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-muted/30 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">New Payment Method</h4>
          <p className="text-sm text-muted-foreground">Add a new mode of payment for billing.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0" aria-label="Cancel">
          <span className="sr-only">Cancel</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-method-name">Name</Label>
        <Input
          id="payment-method-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Cash, GCash, Credit Card"
          className="bg-background"
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}