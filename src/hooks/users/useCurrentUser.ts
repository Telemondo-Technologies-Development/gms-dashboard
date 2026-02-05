import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthSession } from '@/lib/auth/auth-session'
import { tryDecodeJwtClaims, getStringClaim, looksLikeUuid } from '@/lib/auth/jwt-utils'
import { apiResponseListUserTableSchema, apiResponseUserTableSchema, type UserTable } from '@/types/user/userSchemas'
import { userQueryKeys } from '@/lib/QueryKeys'

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
  const url = `/api/user/${encodeURIComponent(userId)}`

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
  const url = `/api/user`

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

export function useCurrentUser() {
  const session = useAuthSession()

  const identity = useMemo(() => {
    if (typeof window === 'undefined') return null

    const token = session.token ?? undefined
    const storedEmail = session.email ?? undefined
    const storedUsername = session.username ?? undefined

    const claims = token ? tryDecodeJwtClaims(token) : null
    const claimEmail =
      getStringClaim(claims, 'email') ??
      getStringClaim(claims, 'preferred_username') ??
      getStringClaim(claims, 'upn')

    const resolvedEmail =
      (claimEmail && claimEmail.includes('@') ? claimEmail : undefined) ??
      (storedEmail && storedEmail.includes('@') ? storedEmail : undefined)

    const sub = getStringClaim(claims, 'sub')
    const userId = sub && looksLikeUuid(sub) ? sub : undefined

    return {
      token,
      email: resolvedEmail,
      username: storedUsername,
      actorId: session.actorId ?? undefined,
      userId,
    }
  }, [session.actorId, session.email, session.token, session.username])

  const currentUserQuery = useQuery({
    queryKey: [userQueryKeys.currentUser, identity?.userId ?? null, identity?.email ?? null, identity?.token ?? null],
    enabled: typeof window !== 'undefined' && !!identity && (!!identity.userId || !!identity.email),
    queryFn: async () => {
      if (!identity) return null
      if (identity.userId) {
        return await fetchUserById(identity.userId, identity.token ?? undefined)
      }
      if (identity.email) {
        return await fetchUserByEmail(identity.email, identity.token ?? undefined)
      }
      return null
    },
    retry: false,
  })

  return {
    identity,
    currentUser: currentUserQuery.data,
    isLoading: currentUserQuery.isLoading,
    error: currentUserQuery.error,
  }
}

