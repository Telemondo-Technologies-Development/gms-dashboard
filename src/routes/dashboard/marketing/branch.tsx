import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card } from '../../../components/ui/card';
import { AddBranchDialog } from '@/components/branch-components/AddBranchDialog';
import type { BranchFormData, StaffMember } from '@/components/branch-components/AddBranchDialog';
import { BranchDetailsDialog } from '@/components/branch-components/BranchDetailsDialog';
import { AssignStaffDialog } from '@/components/branch-components/staff/AssignStaffDialog';
import { MapDialog } from '@/components/branch-components/MapDialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { MapPin, MoreVertical } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export const Route = createFileRoute('/dashboard/marketing/branch')({
  component: RouteComponent,
});

function RouteComponent() {
  const [branches, setBranches] = useState<BranchFormData[]>([
    {
      id: '1',
      name: 'Matina Gym Fitness',
      address: '123 Matina GSIS Davao City Philippines',
      phone: '09171234567',
      status: 'Active',
      assignedStaff: [],
      longitude: 125.5929,
      latitude: 7.0618,
    },
    {
      id: '2',
      name: 'Panacan Gym Fitness',
      address: '123 Panacan Davao City Philippines',
      phone: '09179876543',
      status: 'Maintenance',
      assignedStaff: [],
      longitude: 125.6478,
      latitude: 7.1502,
    },
    {
      id: '3',
      name: 'Toril Gym Fitness',
      address: '123 Panacan Davao City Philippines',
      phone: '09179876543',
      status: 'Active',
      assignedStaff: [],
      longitude: 125.497874,
      latitude: 7.014951,
    },
  ]);

  // Group dialog states into a single object
  const [dialogState, setDialogState] = useState({
    detailsOpen: false,
    staffDialogOpen: false,
    mapDialogOpen: false,
    confirmDialogOpen: false,
  });

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [activeBranchForStaff, setActiveBranchForStaff] = useState<BranchFormData | null>(null);
  const [mapBranch, setMapBranch] = useState<BranchFormData | null>(null);
  const [branchToRemove, setBranchToRemove] = useState<BranchFormData | null>(null);

  const currentUserId = 'exampleUserId'; // Replace with actual logic to get the current user ID

  // Helper function to toggle dialog visibility
  const toggleDialog = (dialog: keyof typeof dialogState, value: boolean) => {
    setDialogState((prev) => ({ ...prev, [dialog]: value }));
  };

  const handleAddBranch = (branch: BranchFormData) => {
    const currentTimestamp = new Date().toISOString();
    const newBranch = {
      ...branch,
      created_by: currentUserId,
      updated_by: currentUserId,
      created_at: currentTimestamp,
      updated_at: currentTimestamp,
    };

    setBranches((prev) => [newBranch, ...prev]);

    // Send newBranch to the backend
    // Example: await api.createBranch(newBranch);
  };

  const handleSaveBranch = (updatedBranch: BranchFormData) => {
    const currentTimestamp = new Date().toISOString();
    const branchWithUpdatedBy = {
      ...updatedBranch,
      updated_by: currentUserId,
      updated_at: currentTimestamp,
    };

    setBranches((prev) =>
      prev.map((branch) => (branch.id === updatedBranch.id ? branchWithUpdatedBy : branch))
    );

    // Send branchWithUpdatedBy to the backend
    // Example: await api.updateBranch(branchWithUpdatedBy);
  };

  const handleRemoveBranch = () => {
    if (branchToRemove) {
      setBranches((prev) => prev.filter((branch) => branch.id !== branchToRemove.id));
      toggleDialog('confirmDialogOpen', false);
      setBranchToRemove(null);

      // Send delete request to the backend
      // Example: await api.deleteBranch(branchToRemove.id);
    }
  };

  const selectedBranch = selectedBranchId
    ? branches.find((branch) => branch.id === selectedBranchId) ?? null
    : null;

  function handleUpdateStaff(newStaff: StaffMember[]): void {
    if (activeBranchForStaff) {
      const updatedBranch = {
        ...activeBranchForStaff,
        assignedStaff: newStaff,
        updated_by: currentUserId,
        updated_at: new Date().toISOString(),
      };

      setBranches((prev) =>
        prev.map((branch) =>
          branch.id === activeBranchForStaff.id ? updatedBranch : branch
        )
      );

      setActiveBranchForStaff(updatedBranch);

      // Send updatedBranch to the backend
      // Example: await api.updateBranch(updatedBranch);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <AddBranchDialog onAddBranch={handleAddBranch} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card
            key={branch.id}
            className="p-6 border border-zinc-100 cursor-pointer hover:bg-muted/50 transition-all flex flex-col justify-between"
            onClick={() => {
              setSelectedBranchId(branch.id);
              toggleDialog('detailsOpen', true);
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${
                    branch.status === 'Active'
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-yellow-600 bg-yellow-50'
                  }`}
                >
                  {branch.status}
                </span>
                <h3 className="text-lg font-semibold mt-3 text-black">{branch.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <MapPin size={14} />
                  <a
                    href="#"
                    className="text-sm text-blue-500 underline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMapBranch(branch);
                      toggleDialog('mapDialogOpen', true);
                    }}
                  >
                    {branch.address}
                  </a>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-black transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setBranchToRemove(branch);
                      toggleDialog('confirmDialogOpen', true);
                    }}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-6 flex justify-end">
              <span
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-black transition-all border-b border-transparent hover:border-black pb-0.5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveBranchForStaff(branch);
                  toggleDialog('staffDialogOpen', true);
                }}
              >
                Assigned Staff
              </span>
            </div>
          </Card>
        ))}
      </div>

      <BranchDetailsDialog
        open={dialogState.detailsOpen}
        onOpenChange={(open) => toggleDialog('detailsOpen', open)}
        branch={selectedBranch}
        onSave={handleSaveBranch}
      />

      <AssignStaffDialog
        open={dialogState.staffDialogOpen}
        onOpenChange={(open) => toggleDialog('staffDialogOpen', open)}
        branchName={activeBranchForStaff?.name || ''}
        staff={activeBranchForStaff?.assignedStaff || []}
        onUpdateStaff={handleUpdateStaff}
      />

      <MapDialog
        open={dialogState.mapDialogOpen}
        onOpenChange={(open) => toggleDialog('mapDialogOpen', open)}
        latitude={mapBranch?.latitude || 0}
        longitude={mapBranch?.longitude || 0}
        address={mapBranch?.address || ''}
      />

      {dialogState.confirmDialogOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-md z-50">
          <h3 className="text-lg font-semibold mb-4">Remove Branch?</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to remove the branch "{branchToRemove?.name}"?
          </p>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => toggleDialog('confirmDialogOpen', false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRemoveBranch}
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}