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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';


export const Route = createFileRoute('/dashboard/marketing/branch')({
  component: RouteComponent,
});

const fetchBranchesFromApi = async () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const base = import.meta.env.DEV ? '' : (apiBaseUrl || '');
  const url = `${base}/api/branch`;

  const token = localStorage.getItem('auth_token');
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch branches.');
  }

  const result = await response.json();

 
  if (!Array.isArray(result.data)) {
    throw new Error('Invalid response format: Expected an array of branches.');
  }

  return result.data; 
};

function RouteComponent() {
  const { data: branches = [], isFetching, refetch } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranchesFromApi,
  });

 
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

  const handleAddBranch = async (branch: BranchFormData) => {
    const currentTimestamp = new Date().toISOString();
    const newBranch = {
      ...branch,
      created_by: currentUserId,
      updated_by: currentUserId,
      created_at: currentTimestamp,
      updated_at: currentTimestamp,
    };
  
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '');
      const url = `${base}/api/branch`;
  
      const token = localStorage.getItem('auth_token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newBranch),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add branch.');
      }
  
      const savedBranch = await response.json();
      refetch(); // Refetch branches after adding
    } catch (error) {
      console.error(error);
      alert('Failed to add branch. Please try again.');
    }
  };

  const handleSaveBranch = async (updatedBranch: BranchFormData) => {
    const currentTimestamp = new Date().toISOString();
    const branchWithUpdatedBy = {
      ...updatedBranch,
      updated_by: currentUserId,
      updated_at: currentTimestamp,
    };
  
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '');
      const url = `${base}/api/branch/${updatedBranch.id}`;
  
      const token = localStorage.getItem('auth_token');
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(branchWithUpdatedBy),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update branch.');
      }
  
      refetch(); // Refetch branches after updating
    } catch (error) {
      console.error(error);
      alert('Failed to update branch. Please try again.');
    }
  };

const handleRemoveBranch = async () => {
  if (branchToRemove) {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '');
      const url = `${base}/api/branch/${branchToRemove.id}`;

      const token = localStorage.getItem('auth_token');
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete branch.');
      }

      refetch(); // Refetch branches after deleting
      toggleDialog('confirmDialogOpen', false);
      setBranchToRemove(null);
    } catch (error) {
      console.error(error);
      alert('Failed to delete branch. Please try again.');
    }
  }
};

  interface Branch {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    assignedStaff?: StaffMember[];
  }

  const selectedBranch: Branch | null = selectedBranchId
    ? branches.find((branch: Branch) => branch.id === selectedBranchId) ?? null
    : null;

  function handleUpdateStaff(newStaff: StaffMember[]): void {
    if (activeBranchForStaff) {
      const updatedBranch = {
        ...activeBranchForStaff,
        assignedStaff: newStaff,
        updated_by: currentUserId,
        updated_at: new Date().toISOString(),
      };

      refetch(); // Refetch branches from the backend to ensure data consistency

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
        branch={selectedBranch ? { ...selectedBranch, phone: '', status: 'Active', revenue: 0, expenses: 0, memberships: 0, assignedStaff: selectedBranch.assignedStaff || [] } : null}
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