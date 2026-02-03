import { useSyncExternalStore } from 'react'
import type { BranchListDTO } from '@/api/generated/models'
import { normalizeBranches } from '@/lib/auth-branches'

export type AuthSession = {
  token: string | null
  email: string | null
  username: string | null
  actorId: string | null
  branches: BranchListDTO[]
  primaryBranchId: string | null
  primaryBranchName: string | null
}

const AUTH_KEYS = {
  token: 'auth_token',
  email: 'auth_email',
  username: 'auth_username',
  actorId: 'auth_actor_id',
  branches: 'auth_branches',
} as const

type AuthStorageKey = (typeof AUTH_KEYS)[keyof typeof AUTH_KEYS]

const emitter = new EventTarget()
const EVENT_NAME = 'auth-session-changed'

function emitChange(): void {
  emitter.dispatchEvent(new Event(EVENT_NAME))
}

function safeGetItem(key: AuthStorageKey): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: AuthStorageKey, value: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

function safeRemoveItem(key: AuthStorageKey): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

function readBranches(): BranchListDTO[] {
  const raw = safeGetItem(AUTH_KEYS.branches)
  if (!raw) return []
  try {
    const json: unknown = JSON.parse(raw)
    return normalizeBranches(json)
  } catch {
    return []
  }
}

const SERVER_SNAPSHOT: AuthSession = {
  token: null,
  email: null,
  username: null,
  actorId: null,
  branches: [],
  primaryBranchId: null,
  primaryBranchName: null,
}

let cachedKey: string | null = null
let cachedSession: AuthSession = SERVER_SNAPSHOT

function snapshotKeyFromStorage(): string {
  const token = safeGetItem(AUTH_KEYS.token) ?? ''
  const email = safeGetItem(AUTH_KEYS.email) ?? ''
  const username = safeGetItem(AUTH_KEYS.username) ?? ''
  const actorId = safeGetItem(AUTH_KEYS.actorId) ?? ''
  const branchesJson = safeGetItem(AUTH_KEYS.branches) ?? ''
  return `${token}\n${email}\n${username}\n${actorId}\n${branchesJson}`
}

export function readAuthSession(): AuthSession {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT

  const key = snapshotKeyFromStorage()
  if (cachedKey === key) return cachedSession

  const tokenRaw = safeGetItem(AUTH_KEYS.token)
  const emailRaw = safeGetItem(AUTH_KEYS.email)
  const usernameRaw = safeGetItem(AUTH_KEYS.username)
  const actorIdRaw = safeGetItem(AUTH_KEYS.actorId)

  const branches = readBranches()
  const primary = branches[0] ?? null

  cachedSession = {
    token: tokenRaw && tokenRaw.trim() ? tokenRaw : null,
    email: emailRaw && emailRaw.trim() ? emailRaw : null,
    username: usernameRaw && usernameRaw.trim() ? usernameRaw : null,
    actorId: actorIdRaw && actorIdRaw.trim() ? actorIdRaw : null,
    branches,
    primaryBranchId: primary?.id ?? null,
    primaryBranchName: primary?.name ?? null,
  }
  cachedKey = key
  return cachedSession
}

export function setAuthSession(next: Partial<Pick<AuthSession, 'token' | 'email' | 'username' | 'actorId' | 'branches'>>): void {
  if ('token' in next) {
    const value = next.token
    if (typeof value === 'string' && value.trim()) {
      safeSetItem(AUTH_KEYS.token, value.trim())
    } else {
      safeRemoveItem(AUTH_KEYS.token)
    }
  }

  if ('email' in next) {
    const value = next.email
    if (typeof value === 'string' && value.trim()) {
      safeSetItem(AUTH_KEYS.email, value.trim())
    } else {
      safeRemoveItem(AUTH_KEYS.email)
    }
  }

  if ('username' in next) {
    const value = next.username
    if (typeof value === 'string' && value.trim()) {
      safeSetItem(AUTH_KEYS.username, value.trim())
    } else {
      safeRemoveItem(AUTH_KEYS.username)
    }
  }

  if ('actorId' in next) {
    const value = next.actorId
    if (typeof value === 'string' && value.trim()) {
      safeSetItem(AUTH_KEYS.actorId, value.trim())
    } else {
      safeRemoveItem(AUTH_KEYS.actorId)
    }
  }

  if ('branches' in next) {
    const branches = Array.isArray(next.branches) ? next.branches : []
    safeSetItem(AUTH_KEYS.branches, JSON.stringify(branches))
  }

  emitChange()
}

export function clearAuthSession(): void {
  safeRemoveItem(AUTH_KEYS.token)
  safeRemoveItem(AUTH_KEYS.email)
  safeRemoveItem(AUTH_KEYS.username)
  safeRemoveItem(AUTH_KEYS.actorId)
  safeRemoveItem(AUTH_KEYS.branches)
  emitChange()
}

export function subscribeAuthSession(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange()
  emitter.addEventListener(EVENT_NAME, handler)

  // Cross-tab updates.
  if (typeof window !== 'undefined') {
    const onStorage = (event: StorageEvent) => {
      if (!event.key) {
        onStoreChange()
        return
      }

      if (
        event.key === AUTH_KEYS.token ||
        event.key === AUTH_KEYS.email ||
        event.key === AUTH_KEYS.username ||
        event.key === AUTH_KEYS.actorId ||
        event.key === AUTH_KEYS.branches
      ) {
        onStoreChange()
      }
    }

    window.addEventListener('storage', onStorage)
    return () => {
      emitter.removeEventListener(EVENT_NAME, handler)
      window.removeEventListener('storage', onStorage)
    }
  }

  return () => {
    emitter.removeEventListener(EVENT_NAME, handler)
  }
}

export function useAuthSession(): AuthSession {
  return useSyncExternalStore(subscribeAuthSession, readAuthSession, readAuthSession)
}

export function useBranchId(): string | null {
  return useAuthSession().primaryBranchId
}
