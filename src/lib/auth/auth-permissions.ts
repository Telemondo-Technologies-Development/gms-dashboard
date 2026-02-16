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
    return value.flatMap((item) => toStringArray(item))
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const direct = [record.name, record.role, record.authority, record.value]
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.trim())
      .filter(Boolean)

    if (direct.length > 0) return direct

    const nested = [record.roles, record.permissions, record.scope, record.scp]
      .flatMap((v) => toStringArray(v))
    return nested
  }
  return []
}

function collectNestedRoleCandidates(claims: JwtClaims): string[] {
  const candidates: string[] = []

  const push = (value: unknown) => {
    candidates.push(...toStringArray(value))
  }

  push(claims.role)
  push(claims.roles)
  push(claims.authority)
  push(claims.authorities)
  push(claims.permissions)
  push(claims.permission)
  push(claims.scope)
  push(claims.scp)

  const realmAccess = claims.realm_access
  if (realmAccess && typeof realmAccess === 'object') {
    push((realmAccess as Record<string, unknown>).roles)
  }

  const resourceAccess = claims.resource_access
  if (resourceAccess && typeof resourceAccess === 'object') {
    for (const value of Object.values(resourceAccess as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        push((value as Record<string, unknown>).roles)
      }
    }
  }

  return candidates
}

function collectRoleCandidatesFromRecord(record: Record<string, unknown>): string[] {
  const candidates: string[] = []

  const push = (value: unknown) => {
    candidates.push(...toStringArray(value))
  }

  push(record.role)
  push(record.roles)
  push(record.authority)
  push(record.authorities)
  push(record.permissions)
  push(record.permission)
  push(record.scope)
  push(record.scp)

  const realmAccess = record.realm_access
  if (realmAccess && typeof realmAccess === 'object') {
    push((realmAccess as Record<string, unknown>).roles)
  }

  const resourceAccess = record.resource_access
  if (resourceAccess && typeof resourceAccess === 'object') {
    for (const value of Object.values(resourceAccess as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        push((value as Record<string, unknown>).roles)
      }
    }
  }

  return candidates
}

function normalizeCandidates(candidates: string[]): string[] {
  return Array.from(new Set(candidates.map((item) => item.trim()).filter(Boolean)))
}

export function extractRoleCandidates(source: unknown): string[] {
  if (!source || typeof source !== 'object') return []
  return normalizeCandidates(collectRoleCandidatesFromRecord(source as Record<string, unknown>))
}

export function rolesHaveAdmin(roles: readonly string[] | null | undefined): boolean {
  if (!roles || roles.length === 0) return false

  return roles.some((item) => {
    const v = item.toLowerCase()
    return (
      v === 'admin' ||
      v === 'role_admin' ||
      v === 'superadmin' ||
      v === 'super_admin' ||
      v === 'role_super_admin' ||
      v === 'superuser' ||
      v.endsWith(':admin') ||
      v.includes('admin') ||
      v.includes('super')
    )
  })
}

export function claimsHasAdmin(claims: JwtClaims | null): boolean {
  if (!claims) return false
  return rolesHaveAdmin(collectNestedRoleCandidates(claims))
}

export function isAdminToken(token: string | null | undefined): boolean {
  if (!token) return false
  const claims = tryDecodeJwtClaims(token)
  return claimsHasAdmin(claims)
}

export function isAdminSession(session: {
  token: string | null | undefined
  roles?: readonly string[] | null
}): boolean {
  if (isAdminToken(session.token)) return true
  return rolesHaveAdmin(session.roles)
}

export function getRoleBasedDashboardPath(
  token: string | null | undefined,
  roles?: readonly string[] | null,
): string {
  if (isAdminSession({ token, roles })) return '/dashboard/admin/users'
  return '/dashboard/marketing/membership'
}
