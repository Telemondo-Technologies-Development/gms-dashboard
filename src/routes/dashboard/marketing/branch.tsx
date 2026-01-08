import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/marketing/branch')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/marketing/branch"!</div>
}
