import { createFileRoute, Link } from '@tanstack/react-router'
import { BanknoteArrowDown, ChartCandlestick, CreditCard, GitBranch, LineChart, Settings, Users } from 'lucide-react'
import type React from 'react'

import { Button } from '@/components/ui/button'

type MenuItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

type MenuSection = {
  title: string
  items: MenuItem[]
}

export const Route = createFileRoute('/dashboard/navigation')({
  component: DashboardMenu,
})

function DashboardMenu() {
  const sections: MenuSection[] = [
    {
      title: 'Marketing',
      items: [
        { label: 'Membership', href: '/dashboard/marketing/membership', icon: Users },
        { label: 'Branch', href: '/dashboard/marketing/branch', icon: GitBranch },
        { label: 'Assets', href: '/dashboard/marketing/assets', icon: ChartCandlestick },
      ],
    },
    {
      title: 'Billing',
      items: [{ label: 'Payment History', href: '/dashboard/billing/payment-history', icon: CreditCard }],
    },
    {
      title: 'Admin',
      items: [
        { label: 'Users', href: '/dashboard/admin/users', icon: Users },
        { label: 'Expenses', href: '/dashboard/admin/expense', icon: BanknoteArrowDown },
        { label: 'Analytics', href: '/dashboard/admin/analytics', icon: LineChart },
      ],
    },
    {
      title: 'System',
      items: [{ label: 'Settings', href: '/dashboard/settings', icon: Settings }],
    },
  ]

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="hidden md:block">
        <p className="text-sm text-muted-foreground">Menu is designed for mobile.</p>
      </div>

      <div className="md:hidden space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Menu</h1>
        <p className="text-sm text-muted-foreground">All routes</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">{section.title}</div>
            <div className="grid grid-cols-2 gap-3">
              {section.items.map(({ href, label, icon: Icon }) => (
                <Button
                  key={href}
                  asChild
                  variant="outline"
                  className="h-20 flex-col items-start justify-center gap-2 rounded-2xl"
                >
                  <Link to={href}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Button
        variant="destructive"
        className="w-full rounded-2xl"
        onClick={() => {
          window.location.href = '/auth/login'
        }}
      >
        Logout
      </Button>
      </div>
    </div>
  )
}
