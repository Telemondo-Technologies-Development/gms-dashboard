import { useState, useMemo, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Check } from "lucide-react";

// Hooks
import { useEmployees } from "@/hooks/users/useStaffEmployees";
import { useAssignBranchPersonnel } from '@/hooks/Staff/useAssignBranchPersonnel';
import { useAuthSession } from '@/lib/auth/auth-session';
import { usePersonnelRoles } from '@/hooks/Staff/usePersonnelRoles';

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface AssignPersonnelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: any[];
  onSuccess: () => void;
  initialBranchId?: string; 
}

export function AssignPersonnelDialog({ 
  open, 
  onOpenChange, 
  branches, 
  onSuccess, 
  initialBranchId 
}: AssignPersonnelDialogProps) {
  const { actorId } = useAuthSession();
  const { data: employeesResponse } = useEmployees();
  const { data: rolesResponse, isLoading: isLoadingRoles } = usePersonnelRoles();
  const { mutateAsync: assignPersonnel } = useAssignBranchPersonnel();

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [roleId, setRoleId] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSelectedBranchId(initialBranchId ?? "");
      setStaffSearch("");
      setSelectedStaffId("");
      setRoleId("");
      setShowSuggestions(false);
    }
  }, [open, initialBranchId]);

  const availableStaff = useMemo(() => {
    const list = (employeesResponse as any)?.data ?? employeesResponse ?? [];
    return list
      .map((emp: any) => ({
        id: emp.actorId,
        name: `${emp.firstName ?? ''} ${emp.surname ?? ''}`.trim() || 'Unnamed Employee',
      }))
      .filter((staff: any) => 
        staff.name.toLowerCase().includes(staffSearch.toLowerCase())
      );
  }, [employeesResponse, staffSearch]);

  const availableRoles = useMemo(() => {
    const list = (rolesResponse as any)?.data ?? rolesResponse ?? [];
    return list.map((r: any) => ({
      id: r.id,
      name: r.name
    }));
  }, [rolesResponse]);

  const handleSelectStaff = (staff: any) => {
    setSelectedStaffId(staff.id);
    setStaffSearch(staff.name);
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    if (!selectedStaffId || !selectedBranchId || !roleId) return;
    
    setIsSubmitting(true);
    try { 
      await assignPersonnel({
        actorId: selectedStaffId,
        branchId: selectedBranchId,
        createdById: actorId ?? '',
        personnelRoleId: roleId,
        status: 'ACTIVE' as any
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Assignment failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col overflow-visible p-0 border border-slate-200 shadow-xl rounded-lg bg-white">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-slate-50">
          <DialogTitle className="text-xl font-bold text-slate-900">Deploy Personnel</DialogTitle>
          <DialogDescription className="text-slate-900 text-[13px] mt-1">
            Assign staff members to specific branches and define their functional roles.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-visible px-6 py-6 space-y-5">
          <div className="space-y-1.5 relative z-50" ref={suggestionRef}>
            <Label className="text-[13px] font-semibold text-slate-700">Select Staff Member *</Label>
            <div className="relative">
              <Input 
                placeholder="Type name to search staff..."
                className="h-10 pr-10 rounded-md border-slate-200 bg-white"
                value={staffSearch}
                onChange={(e) => {
                  const val = e.target.value;
                  setStaffSearch(val);
                  setSelectedStaffId(""); 
                  setShowSuggestions(val.trim().length > 0);
                }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            {showSuggestions && (
              <div className="absolute top-full left-0 z-[60] w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-[180px] overflow-y-auto">
                {availableStaff.length > 0 ? (
                  availableStaff.map((staff: any) => (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 text-slate-700"
                      onClick={() => handleSelectStaff(staff)}
                    >
                      <span>{staff.name}</span>
                      {selectedStaffId === staff.id && <Check className="h-4 w-4 text-blue-600" />}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-slate-400 italic">No staff found</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5 relative z-40">
            <Label className="text-[13px] font-semibold text-slate-700">Functional Role *</Label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger className="h-10 rounded-md border-slate-200 bg-white">
                <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"} />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="w-[var(--radix-select-trigger-width)] max-h-[200px]">
                {availableRoles.map((r: any) => (
                  <SelectItem key={r.id} value={r.id} className="cursor-pointer">
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 relative z-30">
            <Label className="text-[13px] font-semibold text-slate-700">Target Branch Location *</Label>
            <Select 
                value={selectedBranchId} 
                onValueChange={setSelectedBranchId}
                disabled={!!initialBranchId} 
            >
              <SelectTrigger className={cn(
                  "h-10 rounded-md border-slate-200 bg-white transition-colors",
                  initialBranchId && "bg-slate-50 cursor-not-allowed opacity-100"
              )}>
                <SelectValue placeholder="Select destination branch" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="w-[var(--radix-select-trigger-width)] max-h-[200px]">
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id} className="cursor-pointer">
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9">Cancel</Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedStaffId || !selectedBranchId || !roleId || isSubmitting}
            className="bg-[#0052cc] hover:bg-[#0041a3] text-white h-9"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Deployment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}