import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, PlusCircle, Search, MapPin, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AssignedStaffView } from './AssignStaffView';

interface AssignStaffOverviewProps {
  branches: any[];
  defaultBranchId?: string;
}

export const AssignStaffOverview: React.FC<AssignStaffOverviewProps> = ({ branches }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');
  const [branchSearch, setBranchSearch] = useState('');

  const currentBranch = branches.find(b => b.id === selectedBranchId);

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(branchSearch.toLowerCase())
  );

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
              <Input 
                placeholder="Find location..." 
                className="pl-9 h-11 text-xs bg-zinc-50 border-zinc-100 rounded-xl"
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
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest gap-2">
                <PlusCircle size={16} />
                Assign New Personnel
              </Button>
            </div>
          </Card>

          {currentBranch && (
            <Card className="p-6 border-zinc-200 bg-white rounded-2xl shadow-sm border-l-4 border-l-zinc-900">
               <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">Location Details</h4>
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <MapPin className="h-4 w-4 text-zinc-400 mt-1 shrink-0" />
                   <p className="text-xs font-bold text-zinc-700 leading-relaxed">{currentBranch.address}</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <Users className="h-4 w-4 text-zinc-400 shrink-0" />
                   <p className="text-xs font-bold text-zinc-700 uppercase">Operational: <span className="text-emerald-600">Active</span></p>
                 </div>
               </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};