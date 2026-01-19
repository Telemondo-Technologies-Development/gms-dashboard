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
      assignedStaff: [
        { id: '1', name: 'John Doe', role: 'Manager', email: 'john.doe@example.com', phone: '09171234567', address: '123 Matina St.', birthday: '1985-01-01' },
        { id: '2', name: 'Jane Smith', role: 'Staff', email: 'jane.smith@example.com', phone: '09179876543', address: '456 Matina St.', birthday: '1990-02-02' },
        { id: '3', name: 'Alice Johnson', role: 'Staff', email: 'alice.johnson@example.com', phone: '09179876544', address: '789 Matina St.', birthday: '1995-03-03' },
        { id: '4', name: 'Bob Brown', role: 'Staff', email: 'bob.brown@example.com', phone: '09179876545', address: '101 Matina St.', birthday: '1992-04-04' },
        { id: '5', name: 'Charlie White', role: 'Staff', email: 'charlie.white@example.com', phone: '09179876546', address: '202 Matina St.', birthday: '1998-05-05' },
      ],
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
      assignedStaff: [
        { id: '6', name: 'Michael Green', role: 'Manager', email: 'michael.green@example.com', phone: '09179876547', address: '123 Panacan St.', birthday: '1985-01-01' },
        { id: '7', name: 'Sarah Blue', role: 'Staff', email: 'sarah.blue@example.com', phone: '09179876548', address: '456 Panacan St.', birthday: '1990-02-02' },
        { id: '8', name: 'Tom Black', role: 'Staff', email: 'tom.black@example.com', phone: '09179876549', address: '789 Panacan St.', birthday: '1995-03-03' },
        { id: '9', name: 'Emma Yellow', role: 'Staff', email: 'emma.yellow@example.com', phone: '09179876550', address: '101 Panacan St.', birthday: '1992-04-04' },
        { id: '10', name: 'Chris Red', role: 'Staff', email: 'chris.red@example.com', phone: '09179876551', address: '202 Panacan St.', birthday: '1998-05-05' },
      ],
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
      assignedStaff: [
        { id: '11', name: 'Anna Purple', role: 'Manager', email: 'anna.purple@example.com', phone: '09179876552', address: '123 Toril St.', birthday: '1985-01-01' },
        { id: '12', name: 'James Orange', role: 'Staff', email: 'james.orange@example.com', phone: '09179876553', address: '456 Toril St.', birthday: '1990-02-02' },
        { id: '13', name: 'Sophia Pink', role: 'Staff', email: 'sophia.pink@example.com', phone: '09179876554', address: '789 Toril St.', birthday: '1995-03-03' },
        { id: '14', name: 'Liam Gray', role: 'Staff', email: 'liam.gray@example.com', phone: '09179876555', address: '101 Toril St.', birthday: '1992-04-04' },
        { id: '15', name: 'Olivia White', role: 'Staff', email: 'olivia.white@example.com', phone: '09179876556', address: '202 Toril St.', birthday: '1998-05-05' },
      ],
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