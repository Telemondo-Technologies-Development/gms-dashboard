import React from 'react';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MapPin, MoreVertical, Users } from 'lucide-react'; 
import { AddBranchDialog, type BranchFormData } from './AddBranchDialog';

interface Branch {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string;
  branchPersonnel?: any;
  assignedStaff?: any;
}

interface BranchListProps {
  branches: Branch[];
  actorId: string | undefined;
  refetch: () => void;
  onSelectBranch: (id: string) => void;
  onToggleDialog: (dialog: any, value: boolean) => void;
  onSetMapBranch: (branch: any) => void;
  onSetBranchToRemove: (branch: any) => void;
  onSetActiveBranchForStaff: (branch: any) => void;
}

export const BranchList: React.FC<BranchListProps> = ({
  branches,
  actorId,
  refetch,
  onSelectBranch,
  onToggleDialog,
  onSetMapBranch,
  onSetBranchToRemove,
  onSetActiveBranchForStaff,
}) => {

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

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center px-1">
        <AddBranchDialog onAddBranch={handleAddBranch} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {branches.map((branch) => {
          return (
            <Card
              key={branch.id}
              className="p-6 border border-zinc-100 cursor-pointer hover:bg-muted/50 transition-all flex flex-col justify-between group/card shadow-sm"
              onClick={() => {
                onSelectBranch(branch.id);
                onToggleDialog('detailsOpen', true);
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                    branch.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50' : 'text-yellow-600 bg-yellow-50'
                  }`}>
                    {branch.status}
                  </span>
                  <h3 className="text-lg font-bold mt-3 text-slate-900 leading-tight">{branch.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                    <MapPin size={12} className="shrink-0" />
                    <button
                      className="text-sm text-blue-500 hover:underline text-left truncate max-w-[200px]"
                      onClick={(e) => {
                        e.preventDefault(); 
                        e.stopPropagation();
                        onSetMapBranch(branch);
                        onToggleDialog('mapDialogOpen', true);
                      }}
                    >
                      {branch.address}
                    </button>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="p-2 -mr-2 text-muted-foreground hover:text-black transition-colors rounded-full hover:bg-zinc-100" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetBranchToRemove(branch);
                        onToggleDialog('confirmDialogOpen', true);
                      }}
                    >
                      Remove Branch
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-6 flex justify-end border-t border-slate-50 pt-4">
                <button
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0062cc] hover:text-[#0056b3] transition-all group/btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetActiveBranchForStaff(branch);
                  }}
                >
                  <Users size={16} className="group-hover/btn:scale-110 transition-transform" />
                  <span>Assigned Staff</span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};