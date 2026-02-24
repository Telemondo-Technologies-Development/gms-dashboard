import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { BranchPersonnelApi } from '@/api/generated/apis/BranchPersonnelApi'
import type { BranchPersonnelTableDTO } from '@/api/generated/models/BranchPersonnelTableDTO'
import { BranchPersonnelTableDTOStatusEnum } from '@/api/generated/models/BranchPersonnelTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { useAuthSession } from '@/lib/auth/auth-session'
import { apiResponseListUserTableSchema, apiResponseUserTableSchema, type UserTable } from '@/types/user/userSchemas'
import { tryDecodeJwtClaims, getStringClaim, looksLikeUuid } from '@/lib/auth/jwt-utils'
import { useSubscriptionAvailed } from './useMembershipSubscriptionAvailed'
import { userQueryKeys, branchQueryKeys } from '@/lib/QueryKeys'
import { useSelectedBranchId } from '@/hooks/useSelectedBranchId'


const branchPersonnelApi = getAuthenticatedApi(BranchPersonnelApi)

function getApiBaseUrl(): string {
  return import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || '')
}

function buildApiUrl(path: string): string {
  return `${getApiBaseUrl()}${path}`
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
  const url = buildApiUrl(`/api/user/${encodeURIComponent(userId)}`)

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
  const url = buildApiUrl('/api/user')

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

export function useAddMemberDialogData(options: { open: boolean }) {
  const { open } = options
  const session = useAuthSession()
  const selectedBranchId = useSelectedBranchId()
  const token = session.token ?? ''
  const storedEmail = session.email ?? ''
  const storedUsername = session.username ?? ''
  const storedActorId = session.actorId ?? ''

  const claims = token ? tryDecodeJwtClaims(token) : null

  const authUserId = useMemo(() => {
    const sub = getStringClaim(claims, 'sub')
    return sub && looksLikeUuid(sub) ? sub : undefined
  }, [claims])

  const currentUserQueryEnabled =
    typeof window !== 'undefined' && open && (!!authUserId || !!storedEmail)

  const currentUserQuery = useQuery({
    queryKey: [userQueryKeys.currentUser, authUserId ?? null, storedEmail || null],
    enabled: currentUserQueryEnabled,
    queryFn: async () => {
      if (authUserId) return await fetchUserById(authUserId, token)
      if (storedEmail) return await fetchUserByEmail(storedEmail, token)
      return null
    },
    retry: false,
  })

  const createdByActorId = currentUserQuery.data?.actorId

  const resolvedActorId = useMemo(
    () => session.actorId ?? createdByActorId ?? (storedActorId || undefined),
    [session.actorId, createdByActorId, storedActorId],
  )

  const currentUserEmail = useMemo(
    () => session.email ?? session.username ?? currentUserQuery.data?.email ?? storedEmail ?? storedUsername,
    [session.email, session.username, currentUserQuery.data?.email, storedEmail, storedUsername],
  )

  const branchPersonnelQuery = useQuery<BranchPersonnelTableDTO | null>({
    queryKey: [branchQueryKeys.branches, resolvedActorId ?? null, token || null],
    enabled: open && !!resolvedActorId,
    queryFn: async () => {
      if (!resolvedActorId) return null
      const response = await branchPersonnelApi.getAllBranchPersonnel({ pageable: { page: 0, size: 1000 } })
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch branch personnel.')
      }

      return (
        response.data?.find(
          (record) =>
            record.actorId === resolvedActorId && record.status === BranchPersonnelTableDTOStatusEnum.Active,
        ) ?? null
      )
    },
    retry: false,
  })

  const subscriptionsQuery = useSubscriptionAvailed(typeof window !== 'undefined' && open)

  return {
    selectedBranchId,
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
