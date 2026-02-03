import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bell, Search, User2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiResponseListUserTableSchema, apiResponseUserTableSchema, type UserTable } from '@/types/user/userSchemas'
import { BranchPersonnelApi } from '@/api/generated/apis/BranchPersonnelApi'
import { BranchApi } from '@/api/generated/apis/BranchApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import type { BranchPersonnelTableDTO, BranchTableDTO } from '@/api/generated/models'
import { BranchPersonnelTableDTOStatusEnum } from '@/api/generated/models'
import { useAuthSession } from '@/lib/auth-session'

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
	const [searchOpen, setSearchOpen] = useState(false)
	const session = useAuthSession()

	const identity = useMemo(() => {
		if (typeof window === 'undefined') return null

		const token = session.token ?? undefined
		const storedEmail = session.email ?? undefined
		const storedUsername = session.username ?? undefined

		const claims = token ? tryDecodeJwtClaims(token) : null
		const claimEmail =
			getStringClaim(claims, 'email') ??
			getStringClaim(claims, 'preferred_username') ??
			getStringClaim(claims, 'upn')

		const resolvedEmail =
			(claimEmail && claimEmail.includes('@') ? claimEmail : undefined) ??
			(storedEmail && storedEmail.includes('@') ? storedEmail : undefined)

		const sub = getStringClaim(claims, 'sub')
		const userId = sub && looksLikeUuid(sub) ? sub : undefined

		return {
			token,
			email: resolvedEmail,
			username: storedUsername,
			actorId: session.actorId ?? undefined,
			userId,
		}
	}, [session.actorId, session.email, session.token, session.username])

	const storedBranches = session.branches

	const currentUserQuery = useQuery({
		queryKey: ['currentUser', identity?.userId ?? null, identity?.email ?? null, identity?.token ?? null],
		enabled: typeof window !== 'undefined' && !!identity && (!!identity.userId || !!identity.email),
		queryFn: async () => {
			if (!identity) return null
			if (identity.userId) {
				return await fetchUserById(identity.userId, identity.token ?? undefined)
			}
			if (identity.email) {
				return await fetchUserByEmail(identity.email, identity.token ?? undefined)
			}
			return null
		},
		retry: false,
	})

	// Fetch user's branch personnel record
	const branchPersonnelQuery = useQuery<BranchPersonnelTableDTO | null>({
		queryKey: [
			'branchPersonnel',
			identity?.actorId ?? null,
			currentUserQuery.data?.actorId ?? null,
			currentUserQuery.data?.id ?? null,
			identity?.token ?? null,
		],
		enabled: !!identity?.actorId || !!currentUserQuery.data?.actorId || !!currentUserQuery.data?.id,
		queryFn: async () => {
			const storedActorId = identity?.actorId
			const actorId = currentUserQuery.data?.actorId
			const userTableId = currentUserQuery.data?.id
			if (!storedActorId && !actorId && !userTableId) return null
			const branchPersonnelApi = getAuthenticatedApi(BranchPersonnelApi)
			const response = await branchPersonnelApi.getAllBranchPersonnel({
				pageable: { page: 0, size: 1000 },
			})
			if (!response.success) {
				throw new Error(response.message ?? 'Failed to fetch branch personnel.')
			}
			const items = response.data ?? []
			const matchIds = new Set(
				[storedActorId, actorId, userTableId].filter((v): v is string => typeof v === 'string' && v.length > 0),
			)
			const personnelRecord =
				items.find((record) => matchIds.has(record.actorId) && record.status === BranchPersonnelTableDTOStatusEnum.Active) ??
				null
			return personnelRecord
		},
		retry: false,
	})

	// Fetch branch details
	const branchQuery = useQuery<BranchTableDTO | null>({
		queryKey: ['branch', branchPersonnelQuery.data?.branchId ?? null, identity?.token ?? null],
		enabled: !!branchPersonnelQuery.data?.branchId,
		queryFn: async () => {
			const branchId = branchPersonnelQuery.data?.branchId
			if (!branchId) return null
			const branchApi = getAuthenticatedApi(BranchApi)
			const response = await branchApi.getBranch({ id: branchId })
			if (!response.success) {
				throw new Error(response.message ?? 'Failed to fetch branch details.')
			}
			return response.data ?? null
		},
		retry: false,
	})

	const displayEmail = currentUserQuery.data?.email ?? identity?.email ?? identity?.username ?? 'Account'
	const displayBranchName = branchQuery.data?.name ?? storedBranches[0]?.name ?? 'No Branch Assigned'
	const searchInput = (
		<div className="relative">
			<Input
				type="text"
				placeholder="Search..."
				className="pl-9 pr-10 py-2 h-9 w-full rounded-2xl bg-muted focus:bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
			/>
			<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 "
				aria-label="Close search"
				onClick={() => setSearchOpen(false)}
			>
				<X className="h-4 w-4" />
			</Button>	
		</div>
	)

	return (
		<header className="border-b px-4 shadow-sm shadow-accent-foreground/10 md:px-6 bg-surface-container">
			<div className="flex h-16 items-center justify-between">
				{/* Mobile layout */}
				<div className="flex w-full items-center md:hidden">
					<Button
						variant="ghost"
						size="icon"
						aria-label="Notifications"
						className="h-9 w-9 "
					>
						<Bell className="h-5 w-5" />
					</Button>
					<div className="flex flex-1 justify-center">
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center gap-2 h-9 px-3 py-1 "
							aria-label="Account"
						>
							<User2 className="h-5 w-5" />
							<span className="text-sm font-medium">
								{currentUserQuery.isLoading ? 'Loading…' : displayEmail}
							</span>
						</Button>
					</div>
					<Button
						variant="ghost"
						size="icon"
						aria-label={searchOpen ? 'Close search' : 'Open search'}
						className="h-9 w-9"
						onClick={() => setSearchOpen((v) => !v)}
					>
						{searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
					</Button>
				</div>

				{/* Tablet/Desktop layout */}
				<div className="hidden w-full items-center justify-between md:flex">
					<div className="flex items-center gap-2 ">
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center gap-2 h-9 px-3 py-1 "
							aria-label="Account"
						>
							<User2 className="h-5 w-5" />
							<span className="text-sm font-medium">
								{currentUserQuery.isLoading ? 'Loading…' : displayEmail}
							</span>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Notifications"
							className="h-9 w-9 "
						>
							<Bell className="h-5 w-5" />
						</Button>

						{/* Desktop search (always visible) */}
						<div className="hidden lg:block w-105">
							<div className="relative">
								<Input
									type="text"
									placeholder="Search..."
									className="pl-9 pr-3 py-2 h-9 w-full rounded-2xl bg-muted focus:bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
								/>
								<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
							</div>
						</div>

						{/* Tablet search (collapsible) */}
						<Button
							variant="ghost"
							size="icon"
							aria-label={searchOpen ? 'Close search' : 'Open search'}
							className="h-9 w-9 rounded-2xl lg:hidden"
							onClick={() => setSearchOpen((v) => !v)}
						>
							{searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
						</Button>
					</div>

					<div className="hidden md:flex flex-col items-end gap-0.5">
						<Label className="text-xs text-muted-foreground">
							{currentUserQuery.isLoading ? 'Loading...' : displayEmail}
						</Label>
						<Label className="text-sm font-semibold text-foreground">
							{branchQuery.isLoading ? 'Loading branch...' : displayBranchName}
						</Label>
					</div>
				</div>
			</div>

			{/* Collapsible search rows */}
			{searchOpen ? (
				<>
					{/* Mobile search */}
					<div className="pb-3 md:hidden">{searchInput}</div>
					{/* Tablet search */}
					<div className="hidden pb-3 md:block lg:hidden">{searchInput}</div>
				</>
			) : null}
		</header>
	)
}
