import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/membership')({
  component: MembershipRoute,
})

function MembershipRoute() {
  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Membership</div>
      <Outlet />
    </div>
  )
}
