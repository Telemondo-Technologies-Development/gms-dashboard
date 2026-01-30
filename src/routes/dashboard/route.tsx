// src/routes/dashboard/route.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import Aside from '@/components/common/aside'
import Header from '@/components/common/header'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Aside />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 bg-surface-container-low">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
