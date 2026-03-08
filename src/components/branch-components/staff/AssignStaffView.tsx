import React, { useState, useMemo } from 'react';
import { Search, Loader2, UserMinus, MoreHorizontal, UserCheck, RefreshCw } from 'lucide-react';
import { useBranchPersonnel } from '@/hooks/Staff/useBranchPersonnel';
import { useEmployees } from "@/hooks/users/useStaffEmployees";
import type { BranchPersonnelTableDTO } from '@/api/generated/models';
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

interface StaffWithName extends BranchPersonnelTableDTO {
  fullName: string;
}

interface AssignedStaffViewProps {
  branches: any[];
  currentBranchId: string;
  onBranchChange: (id: string) => void;
}

export const AssignedStaffView: React.FC<AssignedStaffViewProps> = ({
  currentBranchId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: branchPersonnel, isLoading: loadingBP, refetch } = useBranchPersonnel(currentBranchId);
  const { data: employeesResponse, isLoading: loadingEmp } = useEmployees();
  const isLoading = loadingBP || loadingEmp;

  const actorNameMap = useMemo(() => {
    const map = new Map<string, string>();
    const employeeList = Array.isArray(employeesResponse) 
      ? employeesResponse 
      : (employeesResponse as any)?.data ?? [];

    employeeList.forEach((emp: any) => {
      if (emp.actorId) {
        const fullName = `${emp.firstName ?? ''} ${emp.surname ?? ''}`.trim();
        map.set(emp.actorId, fullName || 'Unnamed Employee');
      }
    });
    return map;
  }, [employeesResponse]);

  const filteredStaff = useMemo(() => {
    const personnelList = Array.isArray(branchPersonnel) 
      ? branchPersonnel 
      : (branchPersonnel as any)?.data ?? [];

    return personnelList
      .map((p: BranchPersonnelTableDTO) => {
        const nameFromMap = actorNameMap.get(p.actorId);
        return {
          ...p,
          fullName: nameFromMap || `Staff (${p.actorId?.slice(0, 8) || 'Unknown'})`,
        } as StaffWithName;
      })
      .filter((p: StaffWithName) => 
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [branchPersonnel, actorNameMap, searchQuery]);

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
              placeholder="Search by staff name..."
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
                <TableHead className="w-[50%] md:w-[40%] pl-4 md:pl-6">Staff Name</TableHead>
                <TableHead className="hidden md:table-cell w-[25%]">Employee ID</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
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
                    No staff found for this branch or search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((staff: StaffWithName) => (
                  <TableRow key={staff.id || staff.actorId} className="hover:bg-muted/40 transition-colors group border-b border-muted/40">
                    <TableCell className="pl-4 md:pl-6 py-4 align-top">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {staff.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                           <UserCheck className="h-3 w-3" /> Assigned Personnel
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-4 align-top">
                      <span className="text-sm font-mono text-muted-foreground">
                        {staff.actorId ? `${staff.actorId.slice(0, 12)}...` : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 align-top">
                      <Badge className={cn(
                        "font-semibold uppercase text-[10px] tracking-tighter",
                        staff.status === 'ACTIVE' ? "bg-green-500 hover:bg-green-600" : "bg-zinc-400"
                      )}>
                        {staff.status || 'UNKNOWN'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 align-top text-right pr-4 md:pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Staff Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
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

        {filteredStaff.length > 0 && (
          <div className="shrink-0 border-t bg-muted/5">
            <div className="flex items-center justify-between p-4 text-foreground">
              <div className="text-sm text-muted-foreground">
                Showing {filteredStaff.length} assigned personnel
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs">Previous</Button>
                <Button variant="outline" size="sm" disabled className="h-8 px-3 text-xs">Next</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};