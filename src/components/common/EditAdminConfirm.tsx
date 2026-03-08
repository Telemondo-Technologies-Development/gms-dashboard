import { useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
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

interface EditAdminConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called after admin password is verified — use this to unlock editing in the parent */
  onConfirm: () => void | Promise<void>
  title?: string
  description?: string
  confirmText?: string
}

export function EditAdminConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Unlock Edit Access',
  description = 'Admin confirmation is required to edit this record. Please enter your admin password to unlock editing.',
  confirmText = 'Unlock & Edit',
}: EditAdminConfirmDialogProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

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

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      const base = import.meta.env.DEV ? '' : apiBaseUrl || ''
      const response = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: identifier, password }),
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Incorrect password')
        }
        throw new Error('Verification failed. Please try again.')
      }

      await onConfirm()
      setPassword('')
      onOpenChange(false)
    } catch (err) {
      if (err instanceof TypeError) {
        setError('Unable to reach authentication service. Please check your network/API URL.')
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword('')
      setError(null)
      setIsVerifying(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5 text-destructive" />
            <DialogTitle className="text-destructive">{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirm} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-admin-password">Admin Password</Label>
            <Input
              id="edit-admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              disabled={isVerifying}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!password || isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
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
