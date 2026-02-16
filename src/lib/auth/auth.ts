/**
 * Unified Auth Module
 * 
 * Centralized authentication and authorization using Zustand for global state management.
 * 
 * Architecture:
 * - auth-session.ts: Main Zustand store with persist middleware for token, user identity, and branches
 * - auth-permissions.ts: JWT claims parsing and admin role detection
 * - auth-branches.ts: Branch data validation (Zod schemas)
 * - jwt-utils.ts: Low-level JWT decoding utilities
 * 
 * Usage:
 * ```ts
 * import { useAuthSession, isAdminToken } from '@/lib/auth'
 * 
 * function MyComponent() {
 *   const session = useAuthSession()
 *   const isAdmin = isAdminToken(session.token)
 *   
 *   return <div>Welcome {session.email}</div>
 * }
 * ```
 */

// Re-export session management (Zustand store)
export {
  useAuthSession,
  useAuthStore,
  setAuthSession,
  clearAuthSession,
  readAuthSession,
  readPersistedAuthToken,
  type AuthSession,
} from './auth-session'

// Re-export permissions utilities
export {
  claimsHasAdmin,
  isAdminToken,
  isAdminSession,
  rolesHaveAdmin,
  extractRoleCandidates,
  type JwtClaims,
} from './auth-permissions'

// Re-export branch utilities
export { normalizeBranches } from './auth-branches'

// Re-export JWT utilities
export {
  tryDecodeJwtClaims,
  getStringClaim,
  looksLikeUuid,
} from './jwt-utils'
