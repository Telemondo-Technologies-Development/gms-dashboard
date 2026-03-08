import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export interface RoleFormState {
  name: string
  description: string
}

interface InlineAddRoleFormProps {
  formState: RoleFormState
  setFormState: React.Dispatch<React.SetStateAction<RoleFormState>>
  onCancel: () => void
  error?: string | null
}

export function InlineAddRoleForm({ formState, setFormState, onCancel, error }: InlineAddRoleFormProps) {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-muted/30 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">New Role</h4>
          <p className="text-sm text-muted-foreground">Create a new role to assign to this employee.</p>
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role-name">Role Name</Label>
          <Input
            id="role-name"
            value={formState.name}
            onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Branch Manager"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role-description">Description</Label>
          <Textarea
            id="role-description"
            value={formState.description}
            onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the responsibilities of this role..."
            rows={3}
            className="bg-background"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      ) : null}
    </div>
  )
}
