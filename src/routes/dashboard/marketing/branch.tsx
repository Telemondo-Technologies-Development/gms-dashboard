import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AddBranchDialog } from '@/components/branch-components/branch/AddBranchDialog';
import type { BranchFormData, StaffMember } from '@/components/branch-components/branch/AddBranchDialog';
import { BranchDetailsDialog } from '@/components/branch-components/branch/BranchDetailsDialog';
import { AssignStaffDialog } from '@/components/branch-components/staff/AssignStaffDialog';
import { MapDialog } from '@/components/branch-components/branch/MapDialog';
import { DeleteConfirmDialog } from '../../../components/branch-components/DeleteConfirmDialog';

import { MultiBranchOverview } from '@/components/branch-components/branch/MultiBranchOverview';
import { BranchList } from '@/components/branch-components/branch/BranchList';

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
      revenue: 50000,
      expenses: 20000,
      memberships: 150,
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
      revenue: 30000, 
      expenses: 19000, 
      memberships: 100, 
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
      revenue: 40000, 
      expenses: 18000, 
      memberships: 120,
    },
  ]);

 
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

  const currentUserId = 'exampleUserId'; 

  
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
      <BranchList
        branches={branches}
        onSelectBranch={setSelectedBranchId}
        onToggleDialog={toggleDialog}
        onSetMapBranch={setMapBranch}
        onSetBranchToRemove={setBranchToRemove}
        onSetActiveBranchForStaff={setActiveBranchForStaff}
      />
      <MultiBranchOverview branches={branches} />

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

      <DeleteConfirmDialog
        isOpen={dialogState.confirmDialogOpen}
        branchName={branchToRemove?.name || null}
        onCancel={() => toggleDialog('confirmDialogOpen', false)}
        onConfirm={handleRemoveBranch}
      />
    </div>
  );
}