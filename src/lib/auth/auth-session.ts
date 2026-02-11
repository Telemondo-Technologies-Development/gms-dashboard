/**
 * Authentication Session Store (Zustand + Persist)
 * 
 * Global authentication state management using Zustand with localStorage persistence.
 * Stores JWT token, user identity (email, username, actorId), and branch assignments.

 * - Persisted under 'auth-session' key in localStorage
 * - Branch data is validated via normalizeBranches (Zod schemas)
 * - Primary branch is auto-selected as first branch in list
 * 
 * @see user-store.ts for employee/branch UI state
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BranchListDTO } from '@/api/generated/models'
import { normalizeBranches } from '@/lib/auth/auth-branches'

export type AuthSession = {
  token: string | null
  email: string | null
  username: string | null
  actorId: string | null
  assignedBranches: BranchListDTO[] // All branches user can access
}

type AuthStore = AuthSession & {
  setAuthSession: (data: Partial<Pick<AuthSession, 'token' | 'email' | 'username' | 'actorId' | 'assignedBranches'>>) => void
  clearAuthSession: () => void
}

const initialState: AuthSession = {
  token: null,
  email: null,
  username: null,
  actorId: null,
  assignedBranches: [],
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setAuthSession: (data) =>
        set((state) => {
          const assignedBranches = 'assignedBranches' in data && Array.isArray(data.assignedBranches) 
            ? normalizeBranches(data.assignedBranches) 
            : state.assignedBranches

          return {
            token: 'token' in data ? (data.token?.trim() || null) : state.token,
            email: 'email' in data ? (data.email?.trim() || null) : state.email,
            username: 'username' in data ? (data.username?.trim() || null) : state.username,
            actorId: 'actorId' in data ? (data.actorId?.trim() || null) : state.actorId,
            assignedBranches,
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
  const assignedBranches = useAuthStore((state) => state.assignedBranches)

  return {
    token,
    email,
    username,
    actorId,
    assignedBranches,
  }
}

export function setAuthSession(data: Partial<Pick<AuthSession, 'token' | 'email' | 'username' | 'actorId' | 'assignedBranches'>>): void {
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
    assignedBranches: state.assignedBranches,
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


