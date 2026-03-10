import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import type { BranchFormData } from '@/components/branch-components/branch/AddBranchDialog';
import { BranchDetailsDialog } from '@/components/branch-components/branch/BranchDetailsDialog';
import { MapDialog } from '@/components/branch-components/branch/MapDialog';
import { DeleteAdminConfirmDialog } from '@/components/common/DeleteAdminConfirm';
import { BranchList } from '@/components/branch-components/branch/BranchList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AssignStaffOverview } from '@/components/branch-components/staff/AssignStaffOverview';
import { useBranches } from '@/hooks/branch/useBranches';
import { useAuthSession } from '@/lib/auth/auth-session';

export const Route = createFileRoute('/dashboard/marketing/branch')({
  component: RouteComponent,
});

function RouteComponent() {
  const { actorId } = useAuthSession();
  const { branches, refetch, isLoading } = useBranches();
  const [activeTab, setActiveTab] = useState('branches');
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

  const selectedBranch = selectedBranchId ? branches.find((b: BranchFormData) => b.id === selectedBranchId) : null;

  const toggleDialog = (dialog: keyof typeof dialogState, value: boolean) => {
    setDialogState((prev) => ({ ...prev, [dialog]: value }));
  };

  const handleSaveBranch = async (updatedBranch: BranchFormData) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '');
      const url = `${base}/api/branch/${updatedBranch.id}`;
      const token = localStorage.getItem('auth_token');

      const fetchCoordinates = async (address: string) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
          );
          const data = await response.json();
          if (data.length > 0) {
            return { latitude: data[0].lat, longitude: data[0].lon };
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
          status: updatedBranch.status === 'INACTIVE' ? 'CLOSED' : 'ACTIVE',
          updatedById: actorId,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to update branch.');
      refetch();
      toggleDialog('detailsOpen', false);

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
      const token = localStorage.getItem('auth_token');
  
      // API CALL: This endpoint should be configured on the backend to 
      // also delete entries in the 'branch_personnel' table (Cascade)
      const response = await fetch(`${base}/api/branch/${branchToRemove.id}`, {
        method: 'DELETE',
        headers: { 
          ...(token ? { Authorization: `Bearer ${token}` } : {}) 
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete branch.');
      }
  
      // Refresh data and clean up UI state
      await refetch();
      setBranchToRemove(null);
      // Note: DeleteAdminConfirmDialog handles closing itself via onOpenChange
    } catch (error: any) {
      console.error(error);
      // Re-throw so the Dialog can catch it and show the error message in its UI
      throw error; 
    }
  };


  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-10 flex space-x-6">
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="staff">Staff Details</TabsTrigger>
        </TabsList>

        <TabsContent value="branches">
          {isLoading ? (
            <div className="flex justify-center p-10">
              <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading branches...</p>
            </div>
          ) : (
            <BranchList
              branches={branches}
              actorId={actorId ?? undefined}
              refetch={refetch}
              onSelectBranch={setSelectedBranchId}
              onToggleDialog={toggleDialog}
              onSetMapBranch={setMapBranch}
              onSetBranchToRemove={setBranchToRemove}
              onSetActiveBranchForStaff={(branch) => {
                setActiveBranchForStaff(branch);
                setActiveTab('staff');
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="staff">
          <AssignStaffOverview
            branches={branches}
            defaultBranchId={activeBranchForStaff?.id}
          />
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

      <MapDialog
        open={dialogState.mapDialogOpen}
        onOpenChange={(open) => toggleDialog('mapDialogOpen', open)}
        latitude={mapBranch?.latitude || '0'}
        longitude={mapBranch?.longitude || '0'}
        address={mapBranch?.address || ''}
      />

<DeleteAdminConfirmDialog
  open={dialogState.confirmDialogOpen}
  onOpenChange={(open: boolean) => toggleDialog('confirmDialogOpen', open)}
  onConfirm={handleRemoveBranch}
  title={`Delete Branch: ${branchToRemove?.name}`}
  description="WARNING: This will permanently delete this branch and all its staff assignments. This action requires admin password verification."
  confirmText="Permanently Delete"
/>
    </div>
  );
}