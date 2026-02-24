import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/lib/auth/auth-session'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DeleteAdminConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  title?: string
  description?: string
  confirmText?: string
}

export function DeleteAdminConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Item",
  description = "This action cannot be undone. To confirm deletion, please enter your admin password.",
  confirmText = "Delete",
}: DeleteAdminConfirmDialogProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { username, email } = useAuthStore()

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsVerifying(true)

    try {
      const identifier = username || email

      if (!identifier) {
        throw new Error('User session not found. Please log in again.')
      }

      // 1. Verify Password via Login Endpoint
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      const base = import.meta.env.DEV ? '' : apiBaseUrl || ''
      const response = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: identifier,
          password: password,
        }),
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Incorrect password')
        }
        throw new Error('Verification failed. Please try again.')
      }

      // 2. Password Verified, Proceed to Delete
      setIsVerifying(false)
      setIsDeleting(true)
      
      await onConfirm()
      
      // Reset & Close
      setPassword('')
      setIsDeleting(false)
      onOpenChange(false)
      
    } catch (err) {
      setIsVerifying(false)
      setIsDeleting(false)
      if (err instanceof TypeError) {
        setError('Unable to reach authentication service. Please check your network/API URL.')
        return
      }
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setPassword('')
      setError(null)
      setIsVerifying(false)
      setIsDeleting(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirm} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isVerifying || isDeleting}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isVerifying || isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!password || isVerifying || isDeleting}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
