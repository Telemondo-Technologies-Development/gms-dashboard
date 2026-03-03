import React from 'react';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MapPin, MoreVertical, Users } from 'lucide-react'; 

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

interface BranchListProps {
  branches: Branch[];
  onSelectBranch: (id: string) => void;
  onToggleDialog: (dialog: 'detailsOpen' | 'staffDialogOpen' | 'mapDialogOpen' | 'confirmDialogOpen', value: boolean) => void;
  onSetMapBranch: (branch: Branch) => void;
  onSetBranchToRemove: (branch: Branch) => void;
  onSetActiveBranchForStaff: (branch: Branch) => void;
}

export const BranchList: React.FC<BranchListProps> = ({
  branches,
  onSelectBranch,
  onToggleDialog,
  onSetMapBranch,
  onSetBranchToRemove,
  onSetActiveBranchForStaff,
}) => {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card
            key={branch.id}
            className="p-6 border border-zinc-100 cursor-pointer hover:bg-muted/50 transition-all flex flex-col justify-between"
            onClick={() => {
              onSelectBranch(branch.id);
              onToggleDialog('detailsOpen', true);
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${
                    branch.status === 'ACTIVE'
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-yellow-600 bg-yellow-50'
                  }`}
                >
                  {branch.status}
                </span>
                <h3 className="text-lg font-semibold mt-3 text-black">{branch.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <MapPin size={14} />
                  <button
                    className="text-sm text-blue-500 hover:underline text-left"
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
                    className="text-destructive focus:text-destructive"
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

            <div className="mt-6 flex justify-end">
              <button
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0062cc] hover:text-[#0056b3] transition-all group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetActiveBranchForStaff(branch);
                }}
              >
                <Users size={14} className="group-hover:scale-110 transition-transform" />
                <span>Assigned Staff</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
  );
};