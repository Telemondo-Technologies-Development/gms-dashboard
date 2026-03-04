import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, PlusCircle, Search, MapPin, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AssignedStaffView } from './AssignStaffView';
import { AssignPersonnelDialog } from './AssignPersonnelDialog'; 

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

  const currentBranch = useMemo(() => {
    return branches.find(b => b.id === selectedBranchId);
  }, [branches, selectedBranchId]);

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

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:w-[67%]">
          <AssignedStaffView 
            branches={branches}
            currentBranchId={selectedBranchId}
            onBranchChange={setSelectedBranchId}
          />
        </div>

        <div className="w-full xl:w-[33%] space-y-6">
          <Card className="p-6 border-zinc-200 shadow-sm bg-white rounded-2xl h-fit">
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

            <ScrollArea className="h-[435px] pr-4">
              <div className="space-y-3">
                {filteredBranches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                      selectedBranchId === branch.id 
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl translate-x-1' 
                      : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${selectedBranchId === branch.id ? 'bg-white/10' : 'bg-zinc-50'}`}>
                        <Building2 size={18} className={selectedBranchId === branch.id ? 'text-white' : 'text-zinc-400'} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black tracking-tight truncate uppercase">{branch.name}</p>
                        <p className={`text-[10px] font-bold ${selectedBranchId === branch.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {branch.assignedStaff?.length || 0} Staff Members
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
            
            <div className="grid grid-cols-1 gap-2 mt-6">
              <Button 
                onClick={() => setIsAssignDialogOpen(true)}
                className="w-full h-12 bg-[#0062cc] hover:bg-[#0056b3] text-white rounded-xl font-bold text-xs uppercase tracking-widest gap-2"
              >
                <PlusCircle size={16} />
                Assign New Personnel
              </Button>
            </div>
          </Card>

          {currentBranch && (
            <Card className="p-6 border-zinc-200 bg-white rounded-2xl shadow-sm border-l-4 border-l-[#0062cc]">
               <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">Location Details</h4>
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <MapPin className="h-4 w-4 text-zinc-400 mt-1 shrink-0" />
                   <p className="text-xs font-bold text-zinc-700 leading-relaxed">{currentBranch.address}</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <Users className="h-4 w-4 text-zinc-400 shrink-0" />
                   <p className="text-xs font-bold text-zinc-700 uppercase">
                     Operational: <span className="text-emerald-600 font-black">{currentBranch.status}</span>
                   </p>
                 </div>
               </div>
            </Card>
          )}
        </div>
      </div>
      <AssignPersonnelDialog 
        open={isAssignDialogOpen} 
        onOpenChange={setIsAssignDialogOpen}
        branches={branches}
        onSuccess={() => {
          setIsAssignDialogOpen(false);
        }}
      />
    </div>
  );
};