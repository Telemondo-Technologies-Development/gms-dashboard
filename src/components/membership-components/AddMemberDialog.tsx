import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiResponseMemberTableSchema, memberPostDtoSchema } from '@/types/membership/memberSchemas'
import type { AddMemberDialogProps, MemberFormData } from '@/types/membership/memberSchemas'
import { apiResponseListUserTableSchema, apiResponseUserTableSchema, type UserTable } from '@/types/user/userSchemas'
import type { JwtClaims } from '@/types/user/userSchemas'
import type { MemberFormValues } from '@/types/membership/memberSchemas'



function tryDecodeJwtClaims(token: string): JwtClaims | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const payload = parts[1]
  if (!payload) return null

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    if (typeof atob !== 'function') return null
    const json = atob(padded)
    const parsed: unknown = JSON.parse(json)
    return parsed && typeof parsed === 'object' ? (parsed as JwtClaims) : null
  } catch {
    return null
  }
}

function getStringClaim(claims: JwtClaims | null, key: string): string | undefined {
  if (!claims) return undefined
  const value = claims[key]
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function looksLikeUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

async function fetchJsonOrThrow(url: string, token?: string): Promise<unknown> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  })

  const rawText = await response.text().catch(() => '')
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). ${rawText || 'Check server logs for details.'}`)
  }

  try {
    return JSON.parse(rawText)
  } catch {
    throw new Error('Unexpected response from the server (invalid JSON).')
  }
}

async function fetchUserById(userId: string, token?: string): Promise<UserTable> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
  const url = `${base}/api/user/${encodeURIComponent(userId)}`

  const json = await fetchJsonOrThrow(url, token)
  const parsed = apiResponseUserTableSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Failed to validate user response.')
  }
  if (!parsed.data.success) {
    throw new Error(parsed.data.message ?? 'Failed to fetch user.')
  }
  return parsed.data.data
}

async function fetchUserByEmail(email: string, token?: string): Promise<UserTable | null> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
  const url = `${base}/api/user`

  const json = await fetchJsonOrThrow(url, token)
  const parsed = apiResponseListUserTableSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Failed to validate users response.')
  }
  if (!parsed.data.success) {
    throw new Error(parsed.data.message ?? 'Failed to fetch users.')
  }

  const needle = email.trim().toLowerCase()
  return parsed.data.data.find((u) => u.email.toLowerCase() === needle) ?? null
}

export function AddMemberDialog({ onAddMember }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [lastApiResponse, setLastApiResponse] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const defaultValues: MemberFormValues = {
    createdById: '',
    firstName: '',
    middleName: '',
    surname: '',
    suffix: '',
    profilePictureId: '',
    status: 'IN',
  }

  const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') ?? '') : ''
  const storedEmail = typeof window !== 'undefined' ? (localStorage.getItem('auth_email') ?? '') : ''
  const claims = token ? tryDecodeJwtClaims(token) : null
  const authUserId = (() => {
    const sub = getStringClaim(claims, 'sub')
    return sub && looksLikeUuid(sub) ? sub : undefined
  })()

  const currentUserQuery = useQuery({
    queryKey: ['currentUser', authUserId ?? null, storedEmail || null],
    enabled: typeof window !== 'undefined' && (!!authUserId || !!storedEmail),
    queryFn: async () => {
      if (authUserId) return await fetchUserById(authUserId, token)
      if (storedEmail) return await fetchUserByEmail(storedEmail, token)
      return null
    },
    retry: false,
  })

  const createdByActorId = currentUserQuery.data?.actorId
  const currentUserEmail = currentUserQuery.data?.email ?? storedEmail

  const createMemberMutation = useMutation({
    mutationFn: async (values: MemberFormValues) => {
      const createdById = values.createdById.trim()
      if (!createdById) {
        throw new Error('Missing actor id for the current user. Please log in again or ask admin to create an actor record.')
      }

      const memberPostDTO = {
        createdById,
        firstName: values.firstName.trim(),
        middleName: values.middleName.trim() ? values.middleName.trim() : undefined,
        profilePictureId: values.profilePictureId.trim() ? values.profilePictureId.trim() : undefined,
        surname: values.surname.trim(),
        suffix: values.suffix.trim() ? values.suffix.trim() : undefined,
        status: values.status,
      }

      const validated = memberPostDtoSchema.parse(memberPostDTO)

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
      const url = `${base}/api/member`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(validated),
      })

      const rawText = await response.text().catch(() => '')
      if (!response.ok) {
        throw new Error(`Create member failed (${response.status}). ${rawText || 'Check server logs for details.'}`)
      }

      const parsedJson: unknown = rawText.trim() ? JSON.parse(rawText) : null
      const envelope = apiResponseMemberTableSchema.parse(parsedJson)
      if (!envelope.success) {
        throw new Error(envelope.message ?? 'Failed to create member.')
      }

      return envelope.data
    },
    onSuccess: (data) => {
      setLastApiResponse(JSON.stringify(data, null, 2))
      setSubmitError(null)

      void queryClient.invalidateQueries({ queryKey: ['members'] })

      const fullName = [data.firstName, data.middleName, data.surname, data.suffix].filter(Boolean).join(' ')
      const payload: MemberFormData = {
        id: data.id,
        members: [
          {
            id: data.id,
            name: fullName || 'Unknown',
            email: '',
            phone: '',
          },
        ],
        startDate: undefined,
        endDate: undefined,
        membershipType: 'Member',
        membershipDuration: '',
        billingAmount: '',
        billingCycle: '',
        paymentMethod: '',
        membershipDetails: `Status: ${data.status}`,
        documents: [],
      }

      onAddMember(payload)
    },
  })

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      setLastApiResponse(null)

      if (!value.createdById.trim()) {
        setSubmitError('Current user actor id is missing. Cannot create member.')
        return
      }

      try {
        await createMemberMutation.mutateAsync(value)
        setOpen(false)
        form.reset()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create member.'
        setSubmitError(message)
      }
    },
  })

  useEffect(() => {
    if (!createdByActorId) return
    const current = form.state.values.createdById
    if (current !== createdByActorId) {
      form.setFieldValue('createdById', createdByActorId)
    }
  }, [createdByActorId, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Member
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="max-w-lg">
        <DialogHeader className="text-left">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle>Add New Member</DialogTitle>
            <DialogClose asChild>
              <Button type="button" variant="ghost" size="sm">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="createdById">
            {(field) => (
              <input
                type="hidden"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <div className="space-y-2">
            <Label>Current user</Label>
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
              {currentUserQuery.isLoading ? 'Loading…' : (currentUserEmail || '—')}
            </div>
            {currentUserQuery.error ? (
              <p className="text-xs text-destructive" role="alert">
                {currentUserQuery.error instanceof Error
                  ? currentUserQuery.error.message
                  : 'Failed to load current user.'}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.Field
              name="firstName"
              validators={{
                onChange: ({ value }) => (!value.trim() ? 'First name is required.' : undefined),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>First name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Juan"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <p className="text-sm text-destructive" role="alert">
                      {field.state.meta.errors[0]}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field name="middleName">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Middle name (optional)</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="D."
                  />
                </div>
              )}
            </form.Field>

            <form.Field
              name="surname"
              validators={{
                onChange: ({ value }) => (!value.trim() ? 'Surname is required.' : undefined),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Surname</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Dela Cruz"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <p className="text-sm text-destructive" role="alert">
                      {field.state.meta.errors[0]}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field name="suffix">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Suffix (optional)</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Jr."
                  />
                </div>
              )}
            </form.Field>

            <form.Field
              name="profilePictureId"
              validators={{
                onChange: ({ value }) => {
                  const trimmed = value.trim()
                  if (!trimmed) return undefined
                  return looksLikeUuid(trimmed) ? undefined : 'Profile picture id must be a UUID.'
                },
              }}
            >
              {(field) => (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={field.name}>Profile picture id (optional)</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="UUID"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <p className="text-sm text-destructive" role="alert">
                      {field.state.meta.errors[0]}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Backend expects an existing uploaded image id.
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as MemberFormValues['status'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">IN</SelectItem>
                    <SelectItem value="OUT">OUT</SelectItem>
                    <SelectItem value="UNDECIDED">UNDECIDED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {submitError ? (
            <p className="text-sm text-destructive" role="alert">
              {submitError}
            </p>
          ) : null}

          {createMemberMutation.error && !submitError ? (
            <p className="text-sm text-destructive" role="alert">
              {createMemberMutation.error instanceof Error ? createMemberMutation.error.message : 'Failed to create member.'}
            </p>
          ) : null}

          {lastApiResponse ? (
            <pre className="max-h-40 overflow-auto rounded-md border bg-muted/50 p-3 text-xs whitespace-pre-wrap wrap-break-word">
              {lastApiResponse}
            </pre>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={createMemberMutation.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!form.state.values.createdById.trim() || !canSubmit || isSubmitting || createMemberMutation.isPending}
                >
                  {createMemberMutation.isPending ? 'Creating…' : 'Create Member'}
                </Button>
              )}
            </form.Subscribe>
            <Button variant="secondary"> Add Subscription</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
