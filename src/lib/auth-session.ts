import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

type AuthStore = AuthSession & {
  setAuthSession: (data: Partial<Pick<AuthSession, 'token' | 'email' | 'username' | 'actorId' | 'branches'>>) => void
  clearAuthSession: () => void
}

const initialState: AuthSession = {
  token: null,
  email: null,
  username: null,
  actorId: null,
  branches: [],
  primaryBranchId: null,
  primaryBranchName: null,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setAuthSession: (data) =>
        set((state) => {
          const branches = 'branches' in data && Array.isArray(data.branches) ? normalizeBranches(data.branches) : state.branches
          const primary = branches[0] ?? null

          return {
            token: 'token' in data ? (data.token?.trim() || null) : state.token,
            email: 'email' in data ? (data.email?.trim() || null) : state.email,
            username: 'username' in data ? (data.username?.trim() || null) : state.username,
            actorId: 'actorId' in data ? (data.actorId?.trim() || null) : state.actorId,
            branches,
            primaryBranchId: primary?.id ?? null,
            primaryBranchName: primary?.name ?? null,
          }
        }),
      clearAuthSession: () => set(initialState),
    }),
    {
      name: 'auth-session',
    }
  )
)

export function useAuthSession(): AuthSession {
  const token = useAuthStore((state) => state.token)
  const email = useAuthStore((state) => state.email)
  const username = useAuthStore((state) => state.username)
  const actorId = useAuthStore((state) => state.actorId)
  const branches = useAuthStore((state) => state.branches)
  const primaryBranchId = useAuthStore((state) => state.primaryBranchId)
  const primaryBranchName = useAuthStore((state) => state.primaryBranchName)

  return {
    token,
    email,
    username,
    actorId,
    branches,
    primaryBranchId,
    primaryBranchName,
  }
}

export function setAuthSession(data: Partial<Pick<AuthSession, 'token' | 'email' | 'username' | 'actorId' | 'branches'>>): void {
  useAuthStore.getState().setAuthSession(data)
}

export function clearAuthSession(): void {
  useAuthStore.getState().clearAuthSession()
}

export function readAuthSession(): AuthSession {
  const state = useAuthStore.getState()
  return {
    token: state.token,
    email: state.email,
    username: state.username,
    actorId: state.actorId,
    branches: state.branches,
    primaryBranchId: state.primaryBranchId,
    primaryBranchName: state.primaryBranchName,
  }
}

export function readPersistedAuthToken(): string | null {
  if (typeof window === 'undefined') return null

  // Zustand persist stores JSON like: { state: { token: ... }, version: ... }
  try {
    const raw = window.localStorage.getItem('auth-session')
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)

    if (
      parsed &&
      typeof parsed === 'object' &&
      'state' in parsed &&
      (parsed as { state?: unknown }).state &&
      typeof (parsed as { state: { token?: unknown } }).state === 'object'
    ) {
      const token = (parsed as { state: { token?: unknown } }).state.token
      return typeof token === 'string' && token.trim().length > 0 ? token : null
    }
  } catch {
    // ignore
  }

  return null
}

export function useBranchId(): string | null {
  return useAuthStore((state) => state.primaryBranchId)
}
