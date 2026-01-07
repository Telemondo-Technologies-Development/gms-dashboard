import { Outlet } from '@tanstack/react-router'
import Aside from '@/components/common/aside'
import Header from '@/components/common/header'

export function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Aside />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
