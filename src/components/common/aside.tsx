import type { LucideIcon } from "lucide-react"
import {
	CreditCard,
	Dumbbell,
	Settings,
	Users,
	LogOut,
	BanknoteArrowDown,
	GitBranch,
	ChartCandlestick,
} from "lucide-react"
import { Button } from "../ui/button"

type NavItem = {
	label: string
	href: string
	icon: LucideIcon
}

type NavSection = {
	title: string
	items: NavItem[]
}

function NavLink({ href, icon: Icon, label }: NavItem) {
	return (
		<a
			href={href}
			className="flex items-center gap-2 rounded-2xl px-4 py-2 text-md hover:bg-accent hover:text-accent-foreground hover:shadow-lg shadow-accent-foreground/10 transition-colors"
		>
			<Icon className="h-4 w-4" />
			<span>{label}</span>
		</a>
	)
}

function Section({ title, items }: NavSection) {
	return (
		<section className="space-y-2">
			<div className="px-2 text-sm font-medium text-muted-foreground ">
				{title}
			</div>
			<nav className="flex flex-col gap-1">
				{items.map((item) => (
					<NavLink key={`${title}:${item.label}`} {...item} />
				))}
			</nav>
		</section>
	)
}

export default function Aside() {
	const sections: NavSection[] = [
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
			],
		},
		{
			title: "System",
			items: [
				{ label: "Settings", href: "/dashboard/settings", icon: Settings },
			],
		},
	]

	return (
		<aside className="w-64 bg-background border-r p-4 flex flex-col h-full justify-between">
			<div>
				<div className="mb-4 flex items-center gap-2 px-2 text-md font-semibold ">
					<Dumbbell className="h-6 w-6" />
					<span>Gym Fitness</span>
				</div>
				<div className="space-y-6">
					{sections.map((section) => (
						<Section key={section.title} {...section} />
					))}
				</div>
			</div>
			<div className="mt-8 flex flex-row items-center ">
				<Button variant="destructive" size="lg" className="w-full flex items-center gap-2 rounded-2xl"
                onClick={() => {
                  window.location.href = '/auth/login';
                }}
                >
				    <LogOut className="h-4 w-4" />
						Logout
				</Button>                

			</div>
		</aside>
	)
}
