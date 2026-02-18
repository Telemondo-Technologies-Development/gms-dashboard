import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEmployees } from '@/hooks/users/useEmployees';
import { useMemo, useState } from 'react';

interface ListViewProps {
  branchName: string;
  staff: any[];
  onAddClick: () => void;
  onSelect: (member: any) => void;
}

export function StaffListView({ branchName}: ListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { data: employees, isLoading: loadingEmployees } = useEmployees();

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim() || !isSearching) return [];
    return (employees ?? []).filter((employee) => {
      const name = `${employee.firstName} ${employee.surname}`.toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    }).slice(0, 5);
  }, [searchTerm, employees, isSearching]);

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
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearching(true);
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

        <div className="bg-white rounded-lg shadow-md p-6 border border-zinc-200 mt-6">
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {loadingEmployees ? (
              <div className="py-12 text-center">
                <p className="text-sm text-zinc-400 italic">Loading employees...</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-zinc-50 rounded-xl">
                <p className="text-sm text-zinc-400 italic">No employees found.</p>
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition-all group border border-transparent hover:border-zinc-200"
                  onMouseDown={() => setSearchTerm(`${employee.firstName} ${employee.surname}`)}
                >
                  <p className="text-sm font-semibold text-zinc-900 leading-none">
                    {employee.firstName} {employee.surname}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 px-6 py-2">
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
}