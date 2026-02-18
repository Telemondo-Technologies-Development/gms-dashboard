import { Shield, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ListViewProps {
  branchName: string;
  staff: any[];
  onAddClick: () => void;
  onSelect: (member: any) => void;
}

export function StaffListView({ branchName, staff, onSelect }: ListViewProps) {
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
            placeholder="Search Employee..."
            className="w-full bg-transparent outline-none text-zinc-900 placeholder-zinc-400 border border-zinc-200 rounded-lg px-4"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-zinc-200">
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {staff.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-zinc-50 rounded-xl">
                <p className="text-sm text-zinc-400 italic">No staff assigned yet.</p>
              </div>
            ) : (
              staff.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelect(s)}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition-all group border border-transparent hover:border-zinc-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center relative shrink-0">
                      <span className="text-xs font-bold text-zinc-600">{s.name.charAt(0)}</span>

                      <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-zinc-100">
                        {s.role === 'Manager' ? (
                          <Shield className="h-2.5 w-2.5 text-emerald-600" />
                        ) : (
                          <User className="h-2.5 w-2.5 text-zinc-400" />
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-900 leading-none">{s.name}</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight mt-1">
                        {s.role}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-zinc-300 group-hover:text-black tracking-widest uppercase transition-colors">
                    Details
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}