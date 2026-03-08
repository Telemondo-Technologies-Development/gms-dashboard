import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, PlusCircle, Search, MapPin, Globe } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AssignedStaffView } from './AssignStaffView';
import { AssignPersonnelDialog } from './AssignPersonnelDialog'; 

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface AssignStaffOverviewProps {
  branches: any[];
  defaultBranchId?: string;
}

export const AssignStaffOverview: React.FC<AssignStaffOverviewProps> = ({ 
  branches, 
  defaultBranchId 
}) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(defaultBranchId || branches[0]?.id || '');
  const [branchSearch, setBranchSearch] = useState('');

  useEffect(() => {
    if (defaultBranchId) {
      setSelectedBranchId(defaultBranchId);
    }
  }, [defaultBranchId]);

  const filteredBranches = useMemo(() => {
    return branches.filter(branch => 
      branch.name.toLowerCase().includes(branchSearch.toLowerCase())
    );
  }, [branches, branchSearch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Branch Deployments</h2>
          <p className="text-zinc-500 font-medium">Coordinate and monitor staff assignments across your locations.</p>
        </div>
        <div className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm">
           <div className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center">
             <Building2 className="text-white h-5 w-5" />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase text-zinc-400 leading-none mb-1">Total Branches</p>
             <p className="text-xl font-bold leading-none">{branches.length}</p>
           </div>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        <div className="w-full xl:w-[65%]">
          <AssignedStaffView 
            currentBranchId={selectedBranchId}
          />
        </div>
        <div className="w-full xl:w-[35%]">
          <Card className="p-6 border-zinc-200 shadow-sm bg-white rounded-2xl h-[650px] flex flex-col">
            <div className="shrink-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Branch Switcher</h3>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-zinc-400">Control Panel</Badge>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input 
                  placeholder="Find location..." 
                  className="flex h-11 w-full rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-xs pl-9 outline-none focus:ring-1 focus:ring-zinc-200"
                  value={branchSearch}
                  onChange={(e) => setBranchSearch(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1 pr-4 min-h-0">
              <div className="space-y-3">
                {filteredBranches.map((branch) => {
                  const isSelected = selectedBranchId === branch.id;
                  const statusUpper = branch.status?.toUpperCase();
                  const isActive = statusUpper === 'ACTIVE';
                  const isClosed = statusUpper === 'CLOSED' || statusUpper === 'CLOSE';

                  return (
                    <button
                      key={branch.id}
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={cn(
                        "w-full flex flex-col p-4 rounded-2xl border transition-all text-left group",
                        isSelected 
                          ? 'bg-zinc-50 border-[#0062cc] shadow-sm' 
                          : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300'
                      )}
                    >
                      <div className="flex items-center gap-3 w-full mb-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          isSelected ? 'bg-[#0062cc]/10' : 'bg-zinc-50'
                        )}>
                          <Building2 size={18} className={isSelected ? 'text-[#0062cc]' : 'text-zinc-400'} />
                        </div>
                        <div className="min-w-0">
                          <p className={cn(
                            "text-sm font-black tracking-tight truncate uppercase leading-tight",
                            isSelected ? "text-zinc-900" : "text-zinc-700"
                          )}>
                            {branch.name}
                          </p>
                          <p className="text-[11px] font-bold text-zinc-500">
                            {branch.assignedStaff?.length || 0} Staff Members
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-100 space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin size={12} className="text-zinc-400" />
                          <p className="text-[10px] font-medium leading-tight text-zinc-500 truncate">
                            {branch.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe size={12} className="text-zinc-400" />
                          <p className="text-[10px] font-black uppercase text-zinc-700">
                            Status: <span className={cn(
                              isActive ? "text-emerald-500" : isClosed ? "text-red-500" : "text-zinc-400"
                            )}>
                              {branch.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
            
            <div className="mt-6 shrink-0">
              <Button 
                onClick={() => setIsAssignDialogOpen(true)}
                className="w-full h-12 bg-[#0062cc] hover:bg-[#0056b3] text-white rounded-xl font-bold text-xs uppercase tracking-widest gap-2"
              >
                <PlusCircle size={16} />
                Assign New Personnel
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      <AssignPersonnelDialog 
        open={isAssignDialogOpen} 
        onOpenChange={setIsAssignDialogOpen}
        branches={branches}
        onSuccess={() => setIsAssignDialogOpen(false)}
      />
    </div>
  );
};