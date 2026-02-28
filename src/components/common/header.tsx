import { useEffect, useState } from 'react'
import { useCurrentUser } from '@/hooks/users/useCurrentUser'
import { useEmployeeDisplayName } from '@/hooks/users/useEmployeeDisplayName'
import { Bell, Search, User2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthSession } from '@/lib/auth/auth-session'
import { useUserStore } from '@/lib/auth/user-store'

export default function Header() {
	const [searchOpen, setSearchOpen] = useState(false)
	const session = useAuthSession()
	const { identity, currentUser, isLoading } = useCurrentUser()
	const { setEmployee, setSelectedBranch, employeeFullName, selectedBranchName } = useUserStore()

	// prefer actorId from identity, then currentUser, then session
	const resolvedActorId = identity?.actorId ?? currentUser?.actorId ?? session.actorId
	const resolvedUserId = currentUser?.id ?? null
	const resolvedEmail = (currentUser?.email ?? identity?.email ?? '').trim().toLowerCase()

	const {
		displayName: resolvedEmployeeName,
		employee: currentEmployee,
		isLoading: isEmployeeLoading,
	} = useEmployeeDisplayName({
		ids: [resolvedActorId, resolvedUserId],
		email: resolvedEmail,
	})

	// Update Zustand store whenever currentEmployee changes
	useEffect(() => {
		if (currentEmployee) {
			setEmployee({
				id: currentEmployee.id ?? null,
				firstName: currentEmployee.firstName ?? null,
				surname: currentEmployee.surname ?? null,
				actorId: currentEmployee.actorId ?? null,
			})
		}
	}, [currentEmployee, setEmployee])

	// Set selected branch from session's assigned branches (auto-select first branch)
	useEffect(() => {
		const firstBranch = session.assignedBranches[0]
		if (firstBranch && !selectedBranchName) {
			setSelectedBranch({
				id: firstBranch.id ?? null,
				name: firstBranch.name ?? null,
			})
		}
	}, [session.assignedBranches, selectedBranchName, setSelectedBranch])

	// Prefer employee-table name for display
	const displayName = resolvedEmployeeName || employeeFullName || identity?.username || 'Account'
	const isDisplayLoading = isLoading || isEmployeeLoading
	const displayBranchName = selectedBranchName || session.assignedBranches[0]?.name || 'No Branch Assigned'
	const searchInput = (
		<div className="relative">
			<Input
				type="text"
				placeholder="Search..."
				className="pl-9 pr-10 py-2 h-9 w-full rounded-md bg-muted focus:bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
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
							{isDisplayLoading ? 'Loading…' : displayName}
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
							variant="outline"
							size="sm"
							className="flex items-center gap-2 h-9 px-3 py-1 "
							aria-label="Account"
						>
							<User2 className="h-5 w-5" />
							<span className="text-sm font-medium">
						{isDisplayLoading ? 'Loading…' : displayName}
							</span>
						</Button>
						<Button
							variant="outline"
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
									className="pl-9 pr-3 py-2 h-9 w-full rounded-md bg-muted focus:bg-surface border border-input focus:outline-none focus:ring-2 focus:ring-ring"
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
						<Label className="text-sm font-semibold text-foreground">
							Branch: {displayBranchName}
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
