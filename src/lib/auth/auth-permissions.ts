/**
 * Features:
 * - Admin role detection from various JWT claim formats
 * - Supports multiple claim keys (role, roles, authority, permissions, etc.)
 * - Handles string, array, and comma-separated role formats
 */

import { tryDecodeJwtClaims, type JwtClaims } from './jwt-utils'

export type { JwtClaims }

function toStringArray(value: unknown): string[] {
  if (!value) return []
  if (typeof value === 'string') {
    // common formats: "ADMIN", "ROLE_ADMIN", "admin user", "admin,user"
    return value
      .split(/[\s,]+/)
      .map((v) => v.trim())
      .filter(Boolean)
  }
  if (Array.isArray(value)) {
    return value
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}

export function claimsHasAdmin(claims: JwtClaims | null): boolean {
  if (!claims) return false

  const candidates = [
    ...toStringArray(claims.role),
    ...toStringArray(claims.roles),
    ...toStringArray(claims.authority),
    ...toStringArray(claims.authorities),
    ...toStringArray(claims.permissions),
    ...toStringArray(claims.permission),
    ...toStringArray(claims.scope),
    ...toStringArray(claims.scp),
  ]

  return candidates.some((item) => {
    const v = item.toLowerCase()
    return v === 'admin' || v === 'role_admin' || v.endsWith(':admin') || v.includes('admin')
  })
}

export function isAdminToken(token: string | null | undefined): boolean {
  if (!token) return false
  const claims = tryDecodeJwtClaims(token)
  return claimsHasAdmin(claims)
}
