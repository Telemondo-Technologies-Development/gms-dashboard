import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useEmployees } from "@/hooks/users/useStaffEmployees";

interface AssignPersonnelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: any[];
  onSuccess: () => void;
}

export function AssignPersonnelDialog({ open, onOpenChange, branches, onSuccess }: AssignPersonnelDialogProps) {
  const { data: employeesResponse, isLoading: loadingEmployees } = useEmployees();

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");

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

  const handleSave = async () => {
    if (!selectedStaffId || !selectedBranchId || !role) return;
    setIsSubmitting(true);
    try { 
      onSuccess();
      setSelectedStaffId("");
      setSelectedBranchId("");
      setRole("");
      setStaffSearch("");
      onOpenChange(false);
    } catch (error) {
      console.error("Assignment failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Modal Container: Standard rounded-lg corners */}
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col overflow-hidden p-0 border border-slate-200 shadow-xl rounded-lg bg-white">
        
        {/* Header: Clean font, no breadcrumbs/all-caps as per Asset modal */}
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-slate-50">
          <DialogTitle className="text-xl font-bold text-slate-900">
            Deploy Personnel
          </DialogTitle>
          <DialogDescription className="text-slate-900 text-[13px] mt-1">
            Assign staff members to specific branches and define their functional roles.
          </DialogDescription>
        </DialogHeader>
        
        {/* Body: Proportional spacing and standard input rounding */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-slate-700">
              Select Staff Member *
            </Label>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger className="h-10 rounded-md border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 text-slate-900">
                <SelectValue placeholder={loadingEmployees ? "Loading staff..." : "Choose personnel"} />
              </SelectTrigger>
              <SelectContent className="rounded-md shadow-lg border-slate-200">
                <div className="flex items-center px-3 py-2 border-b border-slate-100">
                  <Search className="h-4 w-4 text-slate-400 mr-2" />
                  <Input 
                    placeholder="Search by name..." 
                    className="h-8 border-none bg-transparent text-sm focus-visible:ring-0 px-0 shadow-none"
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto p-1">
                  {availableStaff.length > 0 ? (
                    availableStaff.map((staff: any) => (
                      <SelectItem key={staff.id} value={staff.id} className="rounded-sm py-2 text-sm text-slate-700">
                        {staff.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400 font-medium italic">
                      No matching staff found
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-slate-700">
              Functional Role (Designation) *
            </Label>
            <Input 
              placeholder="e.g. Branch Manager" 
              className="h-10 rounded-md border-slate-200 focus:ring-1 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-slate-700">
              Target Branch Location *
            </Label>
            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
              <SelectTrigger className="h-10 rounded-md border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 text-slate-900">
                <SelectValue placeholder="Select destination branch" />
              </SelectTrigger>
              {/* Add position="popper" and sideOffset={4} here */}
              <SelectContent 
                position="popper" 
                sideOffset={4} 
                className="rounded-md border-slate-200 p-1 w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)]"
              >
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id} className="rounded-sm py-2 text-sm">
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer: Compact height and standard button weight */}
        <DialogFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/30">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="rounded-md px-4 h-9 text-sm font-medium border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedStaffId || !selectedBranchId || !role || isSubmitting}
            className="bg-[#0052cc] hover:bg-[#0041a3] text-white h-9 rounded-md px-4 text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : "Confirm Deployment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}