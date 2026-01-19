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
import { fakeBranchesData } from '@/components/branch-components/fakeBranchData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


export const Route = createFileRoute('/dashboard/marketing/branch')({
  component: RouteComponent,
});

function RouteComponent() {
  const [branches, setBranches] = useState<BranchFormData[]>(fakeBranchesData);

 
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
        <Tabs defaultValue='branches' >
          <TabsList className="mb-10 flex space-x-6">
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="multiBranchDashboard">MultiBranchDashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="branches">
            <div>
              <BranchList
                branches={branches}
                onSelectBranch={setSelectedBranchId}
                onToggleDialog={toggleDialog}
                onSetMapBranch={setMapBranch}
                onSetBranchToRemove={setBranchToRemove}
                onSetActiveBranchForStaff={setActiveBranchForStaff}
              />
            </div>
          </TabsContent>
          <TabsContent value="multiBranchDashboard">
            <MultiBranchOverview branches={branches} />
          </TabsContent>
        </Tabs>
  
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