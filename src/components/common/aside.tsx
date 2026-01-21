import { useEffect, useMemo, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
	CreditCard,
	Dumbbell,
	Settings,
	Users,
	LogOut,
	BanknoteArrowDown,
	GitBranch,
	ChartCandlestick,
	LineChart,
	ChevronLeft,
	ChevronRight,
	Menu
} from 'lucide-react'
import { Button } from '../ui/button'

type NavItem = {
	label: string
	href: string
	icon: LucideIcon
}

type NavSection = {
	title: string
	items: NavItem[]
}

function NavLink({ href, icon: Icon, label, isActive, collapsed }: NavItem & { isActive: boolean; collapsed: boolean }) {
	return (
		<Link
			to={href}
			className={
				'flex items-center gap-2 rounded-2xl px-4 py-2 text-md transition-colors ' +
				(isActive
					? 'bg-accent text-accent-foreground shadow-lg shadow-accent-foreground/10'
					: 'hover:bg-accent hover:text-accent-foreground hover:shadow-lg shadow-accent-foreground/10')
			}
			aria-current={isActive ? 'page' : undefined}
		>
			<Icon className="h-4 w-4" />
			{collapsed ? <span className="sr-only">{label}</span> : <span>{label}</span>}
		</Link>
	)
}

function Section({ title, items, currentPath, collapsed }: NavSection & { currentPath: string; collapsed: boolean }) {
	return (
		<section className="space-y-2">
			{collapsed ? null : (
				<div className="px-2 text-sm font-medium text-muted-foreground ">{title}</div>
			)}
			<nav className="flex flex-col gap-1">
				{items.map((item) => (
					<NavLink
						key={`${title}:${item.label}`}
						{...item}
						isActive={currentPath === item.href}
						collapsed={collapsed}
					/>
				))}
			</nav>
		</section>
	)
}

export default function Aside() {
	const currentPath = useRouterState({
		select: (s) => s.location.pathname,
	})

	const [collapsed, setCollapsed] = useState(false)
	useEffect(() => {
		if (typeof window === 'undefined') return
		const mq = window.matchMedia('(min-width: 768px) and (max-width: 1023px)')
		const apply = () => setCollapsed(mq.matches)
		apply()
		mq.addEventListener('change', apply)
		return () => mq.removeEventListener('change', apply)
	}, [])

	const sections: NavSection[] = useMemo(() => [
		{
			title: "Marketing",
			items: [
                { label: "Membership", href: "/dashboard/marketing/membership", icon: Users },
				{ label: "Branch", href: "/dashboard/marketing/branch", icon: GitBranch  },
				{ label: "Assets", href: "/dashboard/marketing/assets", icon: ChartCandlestick   },
	
			],
		},
		{
			title: "Billing",
			items: [
				{ label: "Payment History", href: "/dashboard/billing/payment-history", icon: CreditCard },
			],
		},
		{
			title: "Admin",
			items: [
				{ label: "Users", href: "/dashboard/admin/users", icon: Users },
				{ label: "Expenses", href: "/dashboard/admin/expense", icon: BanknoteArrowDown  },
				{ label: "Analytics", href: "/dashboard/admin/analytics", icon: LineChart },
			],
		},
		{
			title: "System",
			items: [
				{ label: "Settings", href: "/dashboard/settings", icon: Settings },
			],
		},
	], [])

	const mobilePrimary = useMemo(() => {
		return [
			{ label: 'Membership', href: '/dashboard/marketing/membership', icon: Users },
			{ label: 'Payment', href: '/dashboard/billing/payment-history', icon: CreditCard },
			{ label: 'Branch', href: '/dashboard/marketing/branch', icon: GitBranch },
			{ label: 'Expenses', href: '/dashboard/admin/expense', icon: BanknoteArrowDown },
			{ label: 'Menu', href: '/dashboard/navigation', icon: Menu },
		] satisfies NavItem[]
	}, [])

	return (
		<>
			{/* Desktop/Tablet sidebar */}
			<aside
				className={
					'hidden h-full flex-col justify-between border-r bg-background p-4 md:flex ' +
					(collapsed ? 'w-20' : 'w-64')
				}
			>
				<div>
					<div className={collapsed ? 'mb-4 flex flex-col gap-2' : 'mb-4 flex items-center gap-2 px-2'}>
						<div className={collapsed ? 'flex items-center justify-between' : 'flex items-center gap-2'}>
							<div className="flex items-center gap-2">
								<Dumbbell className="h-6 w-6" />
								{collapsed ? null : <span className="text-md font-semibold">Gym Fitness</span>}
							</div>
							<button
								className="h-5 w-5 relative left-6.5 rounded-full border border-border bg-background flex items-center justify-center"
								aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
								onClick={() => setCollapsed((v) => !v)}
							>
								{collapsed ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <ChevronLeft className="h-4 w-4 text-muted-foreground" />}
							</button>
						</div>
					</div>

					<div className="space-y-6">
						{sections.map((section) => (
							<Section
								key={section.title}
								{...section}
								currentPath={currentPath}
								collapsed={collapsed}
							/>
						))}
					</div>
				</div>

				<div className="mt-8 flex flex-row items-center">
					<Button
						variant="destructive"
						size="lg"
						className={
							'w-full flex items-center gap-2 rounded-2xl ' +
							(collapsed ? 'justify-center px-2' : '')
						}
						onClick={() => {
							window.location.href = '/auth/login'
						}}
					>
						<LogOut className="h-4 w-4" />
						{collapsed ? <span className="sr-only">Logout</span> : 'Logout'}
					</Button>
				</div>
			</aside>

			{/* Mobile bottom nav */}
			<nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
				<div className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
					{mobilePrimary.map(({ href, icon: Icon, label }) => {
						const isActive = currentPath === href
						return (
							<Link
								key={href}
								to={href}
								className={
									'relative flex w-16 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition-colors ' +
									(isActive
										? 'text-foreground after:absolute after:top-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-primary'
										: 'text-muted-foreground hover:text-foreground')
								}
								aria-current={isActive ? 'page' : undefined}
							>
								<Icon className="h-5 w-5" />
								<span className="leading-none">{label}</span>
							</Link>
						)
					})}
				</div>
			</nav>
		</>
	)
}
