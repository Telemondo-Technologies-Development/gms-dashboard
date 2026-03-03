import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { useBranchPersonnel } from '@/hooks/Staff/useBranchPersonnel';
import { useBranchEmployees } from '@/hooks/Staff/useBranchEmployees';

interface StaffMember {
  id: string;
  name: string;
  role: 'Manager' | 'Staff';
  email: string;
  phone: string;
  address: string;
  birthday: string;
}

interface ListViewProps {
  branchId: string;
  branchName: string;
  staff: StaffMember[];
  onAddClick: () => void;
  onSelect: (member: StaffMember) => void;
}

export function StaffListView({ branchId, branchName, staff, onAddClick, onSelect }: ListViewProps) {
  const { data: branchPersonnel, isLoading: loadingBranchPersonnel } = useBranchPersonnel(branchId);
  const { data: branchEmployees, isLoading: loadingEmployees } = useBranchEmployees(branchId);

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

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="p-6 border-b shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Staff: {branchName}</h2>
      </div>

      <div className="p-6 space-y-6">
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
                      className="flex items-center justify-between gap-3 p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200 cursor-pointer"
                      onClick={() => onSelect({ id: personnel.id, name: displayName, role: 'Staff', email: '', phone: '', address: '', birthday: '' })}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{displayName}</p>
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
            onClick={() => {
              onAddClick();
            }}
          >
            Manage
          </Button>
        </div>
      </div>
    </div>
  );
}
