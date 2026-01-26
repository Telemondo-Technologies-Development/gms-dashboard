import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/tracking')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/tracking"!</div>
}
