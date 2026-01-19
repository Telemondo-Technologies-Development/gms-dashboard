import React from 'react';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MapPin, MoreVertical } from 'lucide-react';

interface BranchListProps {
  branches: {
    id: string;
    name: string;
    address: string;
    status: string;
  }[];
  onSelectBranch: (id: string) => void;
  onToggleDialog: (dialog: 'detailsOpen' | 'staffDialogOpen' | 'mapDialogOpen' | 'confirmDialogOpen', value: boolean) => void;
  onSetMapBranch: (branch: any) => void;
  onSetBranchToRemove: (branch: any) => void;
  onSetActiveBranchForStaff: (branch: any) => void;
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
    <Card className="p-8 py-26 border border-zinc-100">
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
                      onSetMapBranch(branch);
                      onToggleDialog('mapDialogOpen', true);
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
                      onSetBranchToRemove(branch);
                      onToggleDialog('confirmDialogOpen', true);
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
                  onSetActiveBranchForStaff(branch);
                  onToggleDialog('staffDialogOpen', true);
                }}
              >
                Assigned Staff
              </span>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};