// src/routes/dashboard/route.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import Aside from '@/components/common/aside'
import Header from '@/components/common/header'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Aside />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-auto p-6 pb-24 md:pb-6 bg-surface-container-low">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
