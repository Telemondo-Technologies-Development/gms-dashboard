// src/routes/dashboard/route.tsx
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import Aside from '@/components/common/aside'
import Header from '@/components/common/header'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isDashboardRoot = pathname === '/dashboard' || pathname === '/dashboard/'

  return (
    <div className="flex h-screen">
      <Aside />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          {isDashboardRoot ? (
            <div className="space-y-2">
              <div className="text-xl font-semibold">Dashboard</div>
              <div className="text-sm text-muted-foreground">
                Pick a section from the sidebar.
              </div>
            </div>
          ) : null}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
