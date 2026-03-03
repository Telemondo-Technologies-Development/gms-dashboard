import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import { useBranchPersonnel } from '@/hooks/Staff/useBranchPersonnel';
import { useEmployees } from "@/hooks/users/useStaffEmployees"; 
import { Search } from 'lucide-react';

interface ListViewProps {
  branchId: string;
  branchName: string;
  onRedirect: () => void;
}

export function StaffListView({ branchId, branchName, onRedirect }: ListViewProps) {
  const [localSearch, setLocalSearch] = useState('');
  const { data: branchPersonnel, isLoading: loadingBP } = useBranchPersonnel(branchId);
  const { data: employeesResponse, isLoading: loadingEmp } = useEmployees();
  const isLoading = loadingBP || loadingEmp;

  const actorNameMap = useMemo(() => {
    const map = new Map<string, string>();
    const employeeList = (employeesResponse as any)?.data ?? employeesResponse ?? [];

    employeeList.forEach((emp: any) => {
      const mid = emp.middleName ? ` ${emp.middleName}` : '';
      const suf = emp.suffix ? ` ${emp.suffix}` : '';
      const fullName = `${emp.firstName ?? ''}${mid} ${emp.surname ?? ''}${suf}`.trim();
      map.set(emp.actorId, fullName);
    });
    return map;
  }, [employeesResponse]);

  const filteredPersonnel = useMemo(() => {
    const personnel = branchPersonnel ?? [];
    if (!localSearch.trim()) return personnel;

    return personnel.filter((p) => {
      const name = actorNameMap.get(p.actorId)?.toLowerCase() || '';
      return name.includes(localSearch.toLowerCase());
    });
  }, [branchPersonnel, actorNameMap, localSearch]);

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="p-6 border-b shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Staff: {branchName}</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Filter assigned staff..." 
            className="pl-9 bg-zinc-50/50"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="mt-2">
          <div className="border border-zinc-200 rounded-lg p-3 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <button 
                type="button"
                onClick={onRedirect}
                className="group flex flex-col items-start hover:opacity-80 transition-all text-left"
              >
                <span className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 uppercase">
                  Assigned Staff ({branchPersonnel?.length ?? 0})
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold group-hover:text-blue-500">
                  Switch to Details View →
                </span>
              </button>
            </div>

            {isLoading ? (
              <div className="text-center text-sm text-zinc-400 italic py-10 flex flex-col items-center gap-2">
                Loading assigned personnel...
              </div>
            ) : filteredPersonnel.length === 0 ? (
              <div className="text-center text-sm text-zinc-500 py-10 border-2 border-dashed rounded-md bg-zinc-50/30">
                {localSearch ? "No staff matches your search." : "No staff assigned yet."}
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPersonnel.map((personnel) => {
                  const fullName = actorNameMap.get(personnel.actorId);
                  const displayName = fullName && fullName !== "" 
                    ? fullName 
                    : `ID: ${personnel.actorId.slice(0, 8)}`;

                  return (
                    <div
                      key={personnel.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 truncate">{displayName}</p>
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${personnel.status === 'ACTIVE' ? 'bg-green-500' : 'bg-zinc-300'}`} />
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{personnel.status}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 px-10 h-11 text-white font-medium"
            onClick={onRedirect}
          >
            Manage Staff
          </Button>
        </div>
      </div>
    </div>
  );
}