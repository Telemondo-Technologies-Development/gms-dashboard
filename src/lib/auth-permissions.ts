export type JwtClaimsLike = Record<string, unknown>

function base64UrlDecodeToString(input: string): string | null {
  try {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    if (typeof atob !== 'function') return null
    return atob(padded)
  } catch {
    return null
  }
}

export function decodeJwtClaims(token: string): JwtClaimsLike | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const payload = parts[1]
  if (!payload) return null

  const json = base64UrlDecodeToString(payload)
  if (!json) return null

  try {
    const parsed: unknown = JSON.parse(json)
    return parsed && typeof parsed === 'object' ? (parsed as JwtClaimsLike) : null
  } catch {
    return null
  }
}

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

export function claimsHasAdmin(claims: JwtClaimsLike | null): boolean {
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
  const claims = decodeJwtClaims(token)
  return claimsHasAdmin(claims)
}
