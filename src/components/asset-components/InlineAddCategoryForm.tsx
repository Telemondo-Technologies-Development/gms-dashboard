import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InlineAddCategoryFormProps {
  categoryName: string
  onCategoryNameChange: (name: string) => void
  onCancel: () => void
}

export function InlineAddCategoryForm({ categoryName, onCategoryNameChange, onCancel }: InlineAddCategoryFormProps) {

  return (
    <div className="p-5 border border-muted-foreground/10 rounded-2xl bg-muted/30 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="text-base font-normal leading-none tracking-tight">New Asset Category</h4>
          <p className="text-sm text-muted-foreground/80">Create a new category to classify this asset.</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8 rounded-full hover:bg-background/50" aria-label="Cancel">
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
        <Label htmlFor="category-name" className="text-sm font-normal text-muted-foreground">Category Name *</Label>
        <Input
          id="category-name"
          value={categoryName}
          onChange={(e) => onCategoryNameChange(e.target.value)}
          placeholder="e.g., Gym Equipment, Office Supplies"
          className="h-11 bg-background border-muted-foreground/20 focus:border-primary transition-all rounded-lg"
        />
      </div>

    </div>
  )
}
