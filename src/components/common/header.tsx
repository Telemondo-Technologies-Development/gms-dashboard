import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bell, Search, User2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'	
import { apiResponseListUserTableSchema, apiResponseUserTableSchema, type UserTable } from '@/types/user/userSchemas'

type JwtClaims = Record<string, unknown>

function tryDecodeJwtClaims(token: string): JwtClaims | null {
	if (!token) return null
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
		if (parsed && typeof parsed === 'object') return parsed as JwtClaims
		return null
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

export default function Header() {
	const identity = useMemo(() => {
		if (typeof window === 'undefined') return null

		const token = window.localStorage.getItem('auth_token') ?? undefined
		const storedEmail = window.localStorage.getItem('auth_email') ?? undefined

		const claims = token ? tryDecodeJwtClaims(token) : null
		const claimEmail =
			getStringClaim(claims, 'email') ??
			getStringClaim(claims, 'preferred_username') ??
			getStringClaim(claims, 'upn')

		const sub = getStringClaim(claims, 'sub')
		const userId = sub && looksLikeUuid(sub) ? sub : undefined

		return {
			token,
			email: claimEmail ?? storedEmail,
			userId,
		}
	}, [])

	const currentUserQuery = useQuery({
		queryKey: ['currentUser', identity?.userId ?? null, identity?.email ?? null],
		enabled: typeof window !== 'undefined' && !!identity && (!!identity.userId || !!identity.email),
		queryFn: async () => {
			if (!identity) return null
			if (identity.userId) {
				return await fetchUserById(identity.userId, identity.token)
			}
			if (identity.email) {
				return await fetchUserByEmail(identity.email, identity.token)
			}
			return null
		},
		retry: false,
	})

	const displayEmail = currentUserQuery.data?.email ?? identity?.email ?? 'Account'
	return (
		<header className="h-16 border-b flex items-center px-6 shadow-sm shadow-accent-foreground/10 ">
			<div className="flex items-center gap-4 w-full justify-evenly h-full ">
				<div className=" flex items-start gap-2 justify-start  w-full">
                    <Button
						variant="ghost"
						size="sm"
						className="flex items-center gap-2 h-9 px-3 py-1 rounded-2xl "
						aria-label="Edit profile"
					>
						<User2 className="h-5 w-5 hover:text-accent-foreground" />
						<span className="text-sm font-medium hover:text-accent-foreground text-center">
							{currentUserQuery.isLoading ? 'Loading…' : displayEmail}
						</span>
					</Button>
                    <Button variant="ghost" size="icon" aria-label="Notifications" className="h-9 w-9 rounded-2xl">
						<Bell className="h-5 w-5" />
					</Button>
					<div className="relative">
						<Input
							type="text"
							placeholder="Search..."
							className="pl-9 pr-3 py-2 h-9 w-100 rounded-2xl bg-muted focus:bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					</div>
				</div>
			</div>
			<div className="mr-auto flex items-center justify-end gap-4  w-full">
				<div>
					<Label>Branch: Panacan Davao City</Label>
				</div>
			</div>
		</header>
	)
}
