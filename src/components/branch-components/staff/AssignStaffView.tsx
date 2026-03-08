import React, { useState, useMemo } from 'react';
import { Search, Loader2, UserMinus, MoreHorizontal, UserCheck, RefreshCw, Briefcase } from 'lucide-react';
// 1. Switch to the specialized hook
import { useBranchEmployees, type BranchEmployeeItem } from '@/hooks/Staff/useBranchEmployees'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface AssignedStaffViewProps {
  currentBranchId: string;
}

export const AssignedStaffView: React.FC<AssignedStaffViewProps> = ({
  currentBranchId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Use the hook that provides professional IDs and names directly
  const { data: branchEmployees, isLoading, refetch } = useBranchEmployees(currentBranchId);

  // 3. Simplified filtering logic
  const filteredStaff = useMemo(() => {
    const list = branchEmployees ?? [];
    if (!searchQuery) return list;

    return list.filter((emp) => {
      const fullSearchString = `${emp.employeeFirstName} ${emp.employeeSurname} ${emp.employeeId}`.toLowerCase();
      return fullSearchString.includes(searchQuery.toLowerCase());
    });
  }, [branchEmployees, searchQuery]);

  return (
    <Card className="flex flex-col shadow-md border-muted/40 h-[650px] overflow-hidden">
      <CardHeader className="shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              Personnel Assignments
            </CardTitle>
            <CardDescription className="mt-1">
              Currently managing {filteredStaff.length} staff members.
            </CardDescription>
          </div>
          <Badge 
            variant="default" 
            className="px-3 py-1 text-sm bg-[#0062cc] hover:bg-[#0056b3] text-white border-none rounded-full"
          >
            Total: {filteredStaff.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b bg-muted/5 shrink-0 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or Employee ID..."
              className="pl-9 h-10 w-full bg-background/50 border-muted-foreground/20 focus-visible:ring-1"
            />
          </div>
          <div className="flex md:ml-auto">
             <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isLoading}
                className="h-10 w-10 shrink-0"
              >
                <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isLoading && "animate-spin")} />
              </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%] pl-4 md:pl-6">Staff Member</TableHead>
                <TableHead className="w-[25%]">Employee ID</TableHead>
                <TableHead className="w-[20%]">Role</TableHead>
                <TableHead className="w-[15%] text-right pr-4 md:pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Loading Personnel...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No staff found for this branch.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((staff: BranchEmployeeItem) => (
                  <TableRow key={staff.actorId} className="hover:bg-muted/40 transition-colors group border-b border-muted/40">
                    <TableCell className="pl-4 md:pl-6 py-4">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {/* Use professional names directly */}
                          {staff.employeeFirstName} {staff.employeeSurname}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                           <UserCheck className="h-3 w-3" /> {staff.employeeContactNo || 'No Contact'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {/* 4. Display the professional ID instead of the UUID */}
                      <span className="text-sm font-semibold text-primary/80">
                        {staff.employeeId}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {/* 5. Display the actual role name (e.g., Manager) */}
                      <Badge variant="outline" className="font-medium bg-muted/50">
                        <Briefcase className="mr-1 h-3 w-3" />
                        {staff.personnelRoleName}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-4 md:pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Staff Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer">
                            <UserMinus className="mr-2 h-4 w-4" />
                            Unassign Staff
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};