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
  const { data: employees } = useEmployees();

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

        <div className="mt-4">
          {/* Placeholder for the list */}
          <div className="border border-zinc-200 rounded-lg p-4 text-center text-zinc-500">
            No items to display.
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