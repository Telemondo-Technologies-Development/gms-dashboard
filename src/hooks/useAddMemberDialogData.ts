import { useQuery } from '@tanstack/react-query'

import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import { BranchPersonnelApi } from '@/api/generated/apis/BranchPersonnelApi'
import type { BranchPersonnelTableDTO } from '@/api/generated/models/BranchPersonnelTableDTO'
import { BranchPersonnelTableDTOStatusEnum } from '@/api/generated/models/BranchPersonnelTableDTO'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import type { AuthSession } from '@/lib/auth-session'
import { apiResponseListUserTableSchema, apiResponseUserTableSchema, type UserTable, type JwtClaims } from '@/types/user/userSchemas'

import { userQueryKeys, branchQueryKeys, subscriptionAvailedQueryKeys } from '@/lib/QueryKeys'



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

export function useAddMemberDialogData(options: { session: AuthSession; open: boolean }) {
  const { session, open } = options
  const token = session.token ?? ''
  const storedEmail = session.email ?? ''
  const storedUsername = session.username ?? ''
  const storedActorId = session.actorId ?? ''

  const claims = token ? tryDecodeJwtClaims(token) : null
  const authUserId = (() => {
    const sub = getStringClaim(claims, 'sub')
    return sub && looksLikeUuid(sub) ? sub : undefined
  })()

  const currentUserQuery = useQuery({
    queryKey: [userQueryKeys.currentUser, authUserId ?? null, storedEmail || null],
    enabled: typeof window !== 'undefined' && open && (!!authUserId || !!storedEmail),
    queryFn: async () => {
      if (authUserId) return await fetchUserById(authUserId, token)
      if (storedEmail) return await fetchUserByEmail(storedEmail, token)
      return null
    },
    retry: false,
  })

  const createdByActorId = currentUserQuery.data?.actorId
  const resolvedActorId = session.actorId ?? createdByActorId ?? (storedActorId || undefined)
  const currentUserEmail =
    session.email ?? session.username ?? currentUserQuery.data?.email ?? storedEmail ?? storedUsername

  const branchPersonnelApi = getAuthenticatedApi(BranchPersonnelApi)
  const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)

  const branchPersonnelQuery = useQuery<BranchPersonnelTableDTO | null>({
    queryKey: [branchQueryKeys.branches, resolvedActorId ?? null, token || null],
    enabled: open && !!resolvedActorId,
    queryFn: async () => {
      if (!resolvedActorId) return null
      const response = await branchPersonnelApi.getAllBranchPersonnel({ pageable: { page: 0, size: 1000 } })
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch branch personnel.')
      }

      const record =
        response.data?.find(
          (r) => r.actorId === resolvedActorId && r.status === BranchPersonnelTableDTOStatusEnum.Active,
        ) ?? null
      return record
    },
    retry: false,
  })

  const subscriptionsQuery = useQuery<SubscriptionAvailedTableDTO[]>({
    queryKey: [subscriptionAvailedQueryKeys.subscriptionAvailed, token || null],
    enabled: typeof window !== 'undefined' && open,
    queryFn: async () => {
      const response = await subscriptionAvailedApi.getAllSubscriptionAvailed({
        pageable: {
          page: 0,
          size: 500,
          sort: ['name,asc'],
        },
      })
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch subscription availed.')
      }
      return response.data ?? []
    },
    retry: false,
    staleTime: 60_000,
  })

  return {
    token,
    authUserId,
    currentUserQuery,
    createdByActorId,
    resolvedActorId,
    currentUserEmail,
    branchPersonnelQuery,
    subscriptionsQuery,
  }
}
