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
import { useBranches } from '@/hooks/branch/useBranches';
import { useAuthSession } from '@/lib/auth/auth-session';

export const Route = createFileRoute('/dashboard/marketing/branch')({
  component: RouteComponent,
});


interface Branch {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string;
  assignedStaff?: any[]; 
}

function RouteComponent() {
  const { actorId } = useAuthSession(); 

  const { branches, refetch, isLoading } = useBranches();

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

  const toggleDialog = (dialog: keyof typeof dialogState, value: boolean) => {
    setDialogState((prev) => ({ ...prev, [dialog]: value }));
  };

  // 3. API Handlers
  const handleAddBranch = async (branch: BranchFormData) => {
    const currentTimestamp = new Date().toISOString();
    const newBranch = {
      ...branch,
      status: branch.status === 'INACTIVE' ? 'CLOSED' : 'ACTIVE', 
      createdById: actorId,
      updatedById: actorId,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
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
  
      if (!response.ok) throw new Error('Failed to add branch.');
      refetch(); 
    } catch (error) {
      console.error(error);
      alert('Failed to add branch.');
    }
  };

  const handleSaveBranch = async (updatedBranch: BranchFormData) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '');
      const url = `${base}/api/branch/${updatedBranch.id}`;
      const token = localStorage.getItem('auth_token');

      // Fetch new coordinates based on the updated address
      const fetchCoordinates = async (address: string) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              address
            )}&format=json`
          );
          const data = await response.json();
          if (data.length > 0) {
            return {
              latitude: data[0].lat,
              longitude: data[0].lon,
            };
          }
          return { latitude: '0', longitude: '0' };
        } catch (error) {
          console.error('Error fetching coordinates:', error);
          return { latitude: '0', longitude: '0' };
        }
      };

      const { latitude, longitude } = await fetchCoordinates(updatedBranch.address);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...updatedBranch,
          latitude,
          longitude,
          status: updatedBranch.status === 'INACTIVE' ? 'CLOSED' : 'ACTIVE', // Map status for backend
          updatedById: actorId,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to update branch.');
      refetch(); // Refresh branch data
      toggleDialog('detailsOpen', false); // Close the dialog

      // Update the map dialog with new coordinates
      if (mapBranch && mapBranch.id === updatedBranch.id) {
        setMapBranch({ ...updatedBranch, latitude, longitude });
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update branch.');
    }
  };

  const handleRemoveBranch = async () => {
    if (!branchToRemove) return;
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '');
      const url = `${base}/api/branch/${branchToRemove.id}`;
      const token = localStorage.getItem('auth_token');

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (!response.ok) throw new Error('Failed to delete branch.');
      refetch(); 
      toggleDialog('confirmDialogOpen', false);
      setBranchToRemove(null);
    } catch (error) {
      console.error(error);
      alert('Failed to delete branch.');
    }
  };

  const selectedBranch: Branch | null = selectedBranchId
    ? branches.find((b: Branch) => b.id === selectedBranchId) ?? null
    : null;

  if (selectedBranch && selectedBranch.status === 'INACTIVE') {
    selectedBranch.status = 'ACTIVE'; 
  } else if (selectedBranch && selectedBranch.status === 'INACTIVE') {
    selectedBranch.status = 'INACTIVE'; 
  }

  function handleUpdateStaff(newStaff: StaffMember[]): void {
    console.log("Updating staff for branch:", activeBranchForStaff?.name, newStaff);
    refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <AddBranchDialog onAddBranch={handleAddBranch} />
      </div> 

      <Tabs defaultValue='branches'>
        <TabsList className="mb-10 flex space-x-6">
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="multiBranchDashboard">Multi-Branch Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="branches">
          {isLoading ? (
            <div className="flex justify-center p-10"><p>Loading branches...</p></div>
          ) : branches.length > 0 ? (
            <BranchList 
              branches={branches} 
              onSelectBranch={setSelectedBranchId}
              onToggleDialog={toggleDialog}
              onSetMapBranch={setMapBranch}
              onSetBranchToRemove={setBranchToRemove}
              onSetActiveBranchForStaff={setActiveBranchForStaff}
            />
          ) : (
            <div className="p-8 border rounded-md text-center text-muted-foreground">
              No branches found. Click "Add Branch" to get started.
            </div>
          )}
        </TabsContent>

        <TabsContent value="multiBranchDashboard">
          <MultiBranchOverview branches={branches} />
        </TabsContent>
      </Tabs>
  
      <BranchDetailsDialog
        open={dialogState.detailsOpen}
        onOpenChange={(open) => toggleDialog('detailsOpen', open)}
        branch={selectedBranch ? { 
          ...selectedBranch, 
          status: selectedBranch.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE', 
          revenue: 0, 
          expenses: 0, 
          memberships: 0, 
          assignedStaff: selectedBranch.assignedStaff || [] 
        } : null}
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
        latitude={mapBranch?.latitude || '0'} 
        longitude={mapBranch?.longitude || '0'} 
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