import { useEffect, useMemo, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
	CreditCard,
	Settings,
	Users,
	LogOut,
	BanknoteArrowDown,
	GitBranch,
	ChartCandlestick,
	LineChart,
	ChevronRight,
	Menu,
	PanelRightOpen,
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

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
			className={cn(
				'flex items-center rounded-lg p-2 text-md transition-colors whitespace-nowrap',
				collapsed ? 'justify-center' : 'justify-start',
				isActive
					? 'bg-accent shadow-lg shadow-accent-foreground/10 text-primary'
					: 'hover:bg-accent hover:text-primary hover:shadow-lg shadow-accent-foreground/10'
			)}
			aria-current={isActive ? 'page' : undefined}
		>
			<Icon className="h-4 w-4 shrink-0s" />
			<span
				className={cn(
					'transition-all duration-300 ease-in-out overflow-hidden hover:text-primary',
					collapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-2'
				)}
			>
				{label}
			</span>
		</Link>
	)
}

function Section({ title, items, currentPath, collapsed }: NavSection & { currentPath: string; collapsed: boolean }) {
	return (
		<section className="space-y-2">
			<div
				className={cn(
					'px-2 text-xs font-medium transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap text-muted-foreground',
					collapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'
				)}
			>
				{title}
			</div>
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
				{ label: "Tracking", href: "/dashboard/admin/tracking", icon: LineChart },
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
				className={cn(
					'hidden h-full flex-col justify-between border-r bg-surface-container p-4 md:flex transition-[width] duration-300 ease-in-out ',
					collapsed ? 'w-20' : 'w-64'
				)}
			>
				<div>
					<div className={collapsed ? 'mb-4 flex flex-col gap-2' : 'mb-4 flex items-center justify-between px-2'}>
						<div className={collapsed ? 'flex items-center justify-center w-full' : 'flex items-center justify-between w-full'}>
							<div className="flex items-center">
								<span
									className={cn(
										'text-xl font-semibold whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden text-primary',
										collapsed ? 'w-0 opacity-0 px-0' : 'w-auto opacity-100'
									)}
								>
									Dashboard
								</span>
							</div>
							<Button
								className="h-8 w-8  border border-border bg-background flex items-center justify-center shrink-0 hover:bg-accent hover:text-accent-foreground transition-colors"
								aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
								onClick={() => setCollapsed((v) => !v)}
							>
								{collapsed ? (
									<ChevronRight className="h-4 w-4 text-muted-foreground" />
								) : (
									<PanelRightOpen className="h-4 w-4 text-muted-foreground" />
								)}
							</Button>
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
							'w-full flex items-center rounded-2xl whitespace-nowrap ' +
							(collapsed ? 'justify-center px-2' : '')
						}
						onClick={() => {
							window.location.href = '/auth/login'
						}}
					>
						<LogOut className="h-4 w-4 shrink-0" />
						<span
							className={cn(
								'transition-all duration-300 ease-in-out overflow-hidden',
								collapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-2'
							)}
						>
							Logout
						</span>
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
										? 'text-primary'
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
