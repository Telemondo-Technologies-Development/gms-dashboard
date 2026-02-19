import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEmployees } from '@/hooks/users/useEmployees';
import { useMemo, useState } from 'react';
import { useBranchPersonnel } from '@/hooks/Staff/useBranchPersonnel';
import { useBranchEmployees } from '@/hooks/Staff/useBranchEmployees';
import { useAuthSession } from '@/lib/auth/auth-session';
import { useAssignBranchPersonnel } from '@/hooks/Staff/useAssignBranchPersonnel';
import { useUpdateBranchPersonnel } from '@/hooks/Staff/useUpdateBranchPersonnel';
import { useDeleteBranchPersonnel } from '@/hooks/Staff/useDeleteBranchPersonnel';
import { useAllBranchPersonnel } from '@/hooks/Staff/useAllBranchPersonnel';
import type { BranchPersonnelPutDTOStatusEnum } from '@/api/generated/models/BranchPersonnelPutDTO';

interface ListViewProps {
  branchId: string;
  branchName: string;
  staff: any[];
  onAddClick: () => void;
  onSelect: (member: any) => void;
}

export function StaffListView({ branchId, branchName }: ListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  const { data: employees } = useEmployees();
  const { data: branchPersonnel, isLoading: loadingBranchPersonnel } = useBranchPersonnel(branchId);
  const { data: branchEmployees, isLoading: loadingEmployees } = useBranchEmployees(branchId);
  const { data: allPersonnel } = useAllBranchPersonnel();

  const { actorId: currentActorId } = useAuthSession();

  const assign = useAssignBranchPersonnel();
  const update = useUpdateBranchPersonnel();
  const remove = useDeleteBranchPersonnel();

  const STATUS_OPTIONS: BranchPersonnelPutDTOStatusEnum[] = [
    'ACTIVE',
    'MOVED',
    'TERMINATED',
    'RESIGNED',
    'UNDECIDED',
  ];

  const loadingAssigned = loadingBranchPersonnel || loadingEmployees;

  const actorNameById = useMemo(() => {
    return new Map(
      (branchEmployees ?? []).map((e) => {
        const mid = e.employee?.middleName ? ` ${e.employee.middleName}` : '';
        const suf = e.employee?.suffix ? ` ${e.employee.suffix}` : '';
        const fullName = `${e.employee?.firstName ?? ''}${mid} ${e.employee?.surname ?? ''}${suf}`.trim();
        return [e.actorId, fullName] as const;
      })
    );
  }, [branchEmployees]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim() || !isSearching) return [];
    return (employees ?? [])
      .filter((employee) => {
        const name = `${employee.firstName} ${employee.surname}`.toLowerCase();
        return name.includes(searchTerm.toLowerCase());
      })
      .slice(0, 5);
  }, [searchTerm, employees, isSearching]);

  const actorIdToAssign = selectedEmployee?.actorId ?? selectedEmployee?.id ?? '';

  const alreadyAssigned = useMemo(() => {
    if (!actorIdToAssign) return false;
    return (branchPersonnel ?? []).some((p) => p.actorId === actorIdToAssign);
  }, [branchPersonnel, actorIdToAssign]);

  const handleAssign = async () => {
    if (!actorIdToAssign || !currentActorId || !branchId) return;

    // Find existing ACTIVE assignment anywhere
    const existingActive = (allPersonnel ?? []).find(
      (p) => p.actorId === actorIdToAssign && p.status === 'ACTIVE'
    );

    // Already ACTIVE in THIS branch → do nothing
    if (existingActive && existingActive.branchId === branchId) return;

    // ACTIVE in ANOTHER branch → mark old as MOVED first
    if (existingActive && existingActive.branchId !== branchId) {
      await update.mutateAsync({
        id: existingActive.id,
        actorId: existingActive.actorId,
        branchId: existingActive.branchId,
        updatedById: currentActorId,
        status: 'MOVED',
      });
    }

    // Create new ACTIVE assignment in this branch
    await assign.mutateAsync({
      actorId: actorIdToAssign,
      branchId,
      createdById: currentActorId,
      status: 'ACTIVE',
    });

    setSearchTerm('');
    setSelectedEmployee(null);
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="p-6 border-b shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Staff: {branchName}</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2 relative">
          <Label htmlFor="searchEmployee">Search Employee</Label>
          <Input
            id="searchEmployee"
            placeholder="Search Employee to Assign..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearching(true);
              setSelectedEmployee(null);
            }}
            onFocus={() => {
              if (searchTerm.length > 0) setIsSearching(true);
            }}
            onBlur={() => {
              setTimeout(() => setIsSearching(false), 200);
            }}
            className="w-full bg-transparent outline-none text-zinc-900 placeholder-zinc-400 border border-zinc-200 rounded-lg px-4"
          />

          {isSearching && filteredEmployees.length > 0 && (
            <div className="absolute z-50 w-full top-[70px] bg-popover border rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSelectedEmployee(employee);
                    setSearchTerm(`${employee.firstName} ${employee.surname}`);
                    setIsSearching(false);
                  }}
                >
                  {employee.firstName} {employee.surname}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="border border-zinc-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-zinc-900">Assigned Personnel</p>
              <p className="text-xs text-zinc-500">{(branchPersonnel ?? []).length} total</p>
            </div>

            {loadingAssigned ? (
              <div className="text-center text-sm text-zinc-400 italic py-4">Loading personnel...</div>
            ) : (branchPersonnel ?? []).length === 0 ? (
              <div className="text-center text-sm text-zinc-500 py-4">No Personnel Available.</div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {(branchPersonnel ?? []).map((personnel) => {
                  const displayName =
                    actorNameById.get(personnel.actorId) ??
                    (personnel.actorId
                      ? `${personnel.actorId.slice(0, 8)}...${personnel.actorId.slice(-4)}`
                      : 'Unknown');

                  return (
                    <div
                      key={personnel.id}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{displayName}</p>
                        <p className="text-xs text-zinc-500">{personnel.status}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          className="border border-zinc-200 rounded-md px-2 py-1 text-xs bg-white"
                          value={personnel.status}
                          onChange={(e) => {
                            update.mutate({
                              id: personnel.id,
                              actorId: personnel.actorId,
                              branchId,
                              updatedById: currentActorId || '',
                              status: e.target.value as BranchPersonnelPutDTOStatusEnum,
                            });
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <Button
                          type="button"
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          onClick={() => remove.mutate({ id: personnel.id, branchId })}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
            disabled={
              !selectedEmployee ||
              alreadyAssigned ||
              assign.isPending ||
              update.isPending ||
              !currentActorId ||
              !branchId
            }
            onClick={() => {
              void handleAssign();
            }}
          >
            {alreadyAssigned ? 'Already Assigned' : assign.isPending || update.isPending ? 'Assigning...' : 'Assign'}
          </Button>
        </div>
      </div>
    </div>
  );
}
