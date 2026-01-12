import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card } from '../../../components/ui/card';
import { AddBranchDialog } from '@/components/branch-components/AddBranchDialog';
import type { BranchFormData } from '@/components/branch-components/AddBranchDialog';
import { BranchDetailsDialog } from '@/components/branch-components/BranchDetailsDialog';
import { MapPin, MoreVertical } from 'lucide-react';

export const Route = createFileRoute('/dashboard/marketing/branch')({
  component: RouteComponent,
});

function RouteComponent() {
  const [branches, setBranches] = useState<BranchFormData[]>([
    {
      id: '1',
      name: 'Matina Gym Fitness',
      address: '123 Matina GSIS Davao City Philippines',
      status: 'Active', 
    },
    {
      id: '2',
      name: 'Panacan Gym Fitness',
      address: '123 Panacan Davao City Philippines',
      status: 'Maintenance', 
    },
  ]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const handleAddBranch = (branch: BranchFormData) => {
    setBranches((prev) => [branch, ...prev]);
  };

  const handleSaveBranch = (updatedBranch: BranchFormData) => {
    setBranches((prev) =>
      prev.map((branch) => (branch.id === updatedBranch.id ? updatedBranch : branch))
    );
  };

  const selectedBranch = selectedBranchId
    ? branches.find((branch) => branch.id === selectedBranchId) ?? null
    : null;

  return (
    <div className="text-zinc-900 bg-white min-h-screen">
      <div className="flex">
        <main className="flex-1 p-8 md:p-12">
          <header className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-black">Branches</h1>
              <p className="text-zinc-500 mt-2">Manage your locations and staff access.</p>
            </div>
            <AddBranchDialog onAddBranch={handleAddBranch} />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <Card
                key={branch.id}
                className="p-6 shadow-md rounded-xl border border-zinc-100 cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSelectedBranchId(branch.id);
                  setDetailsOpen(true);
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                      branch.status === 'Active'
                        ? 'text-emerald-600 bg-emerald-50'
                        : branch.status === 'Maintenance'
                        ? 'text-yellow-600 bg-yellow-50'
                        : 'text-zinc-400 bg-zinc-100'
                      } px-2 py-1 rounded`}
                    >
                      {branch.status}
                    </span>
                    <h3 className="text-xl font-semibold mt-3 text-black">{branch.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-zinc-500">
                      <MapPin size={14} />
                      <p className="text-sm">{branch.address}</p>
                    </div>
                  </div>
                  <button className="text-zinc-400 hover:text-black transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <BranchDetailsDialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setSelectedBranchId(null);
        }}
        branch={selectedBranch}
        onSave={handleSaveBranch}
      />
    </div>
  );
}