import { Configuration } from '@/api/generated/runtime'
import type { FetchAPI } from '@/api/generated/runtime'
import { readAuthSession } from '@/lib/auth/auth-session'

export const DUMMY_PAGEABLE = { page: 0, size: 1000 }

function getToken(): string | undefined {
  const token = readAuthSession().token ?? undefined
  if (typeof window !== 'undefined' && token) {
    if (localStorage.getItem('auth_token') !== token) {
      localStorage.setItem('auth_token', token)
    }
  }
  return token
}

function rewritePageable(urlStr: string): string {
  const url = new URL(urlStr, window.location.origin)
  const toDelete = [...url.searchParams.keys()].filter(
    (k) => k === 'pageable' || k.startsWith('pageable['),
  )
  if (toDelete.length === 0) return urlStr
  toDelete.forEach((k) => url.searchParams.delete(k))
  url.searchParams.set('page', '0')
  url.searchParams.set('size', '1000')
  return url.origin !== window.location.origin
    ? url.href
    : url.pathname + url.search
}

function makePageableFetch(): FetchAPI {
  return (input, init) => {
    const raw =
      typeof input === 'string' ? input
      : input instanceof URL    ? input.href
      : (input as Request).url

    const rewritten = rewritePageable(raw)
    const token     = getToken()
    const headers   = new Headers((init?.headers as HeadersInit) ?? {})

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return window.fetch(rewritten, { ...init, headers })
  }
}

/** Returns an API instance that uses the pageable-rewriting fetch. */
export function getPageableApi<T>(ApiClass: new (config: Configuration) => T): T {
  const basePath = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || '')
  return new ApiClass(
    new Configuration({
      basePath,
      accessToken: getToken(),
      fetchApi: makePageableFetch(),
    }),
  )
}