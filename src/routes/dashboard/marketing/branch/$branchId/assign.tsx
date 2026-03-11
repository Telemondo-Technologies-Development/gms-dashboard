import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/marketing/branch/$branchId/assign')({
  component: RouteComponent,
});

function RouteComponent() {
  const { branchId } = Route.useParams();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Assign Staff</h2>
        <p className="text-zinc-500">Managing staff for branch: {branchId}</p>
      </div>
    </div>
  );
}