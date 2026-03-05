import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Check } from "lucide-react";
import { useEmployees } from "@/hooks/users/useStaffEmployees";

const PRESET_ROLES = [
  "Branch Manager",
  "Head Coach",
  "Fitness Instructor",
  "Front Desk / Reception",
];

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectStaff = (staff: any) => {
    setSelectedStaffId(staff.id);
    setStaffSearch(staff.name);
    setShowSuggestions(false);
  };

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
      {/* Changed overflow-hidden to overflow-visible to prevent dropdown clipping */}
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col overflow-visible p-0 border border-slate-200 shadow-xl rounded-lg bg-white">
        
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-slate-50">
          <DialogTitle className="text-xl font-bold text-slate-900">Deploy Personnel</DialogTitle>
          <DialogDescription className="text-slate-900 text-[13px] mt-1">
            Assign staff members to specific branches and define their functional roles.
          </DialogDescription>
        </DialogHeader>
        
        {/* Container set to overflow-visible so dropdowns aren't trapped */}
        <div className="flex-1 overflow-visible px-6 py-6 space-y-5">
          
          {/* STAFF AUTOCOMPLETE */}
          <div className="space-y-1.5 relative z-50" ref={suggestionRef}>
            <Label className="text-[13px] font-semibold text-slate-700">Select Staff Member *</Label>
            <div className="relative">
              <Input 
                placeholder="Type name to search staff..."
                className="h-10 pr-10 rounded-md border-slate-200 bg-white"
                value={staffSearch}
                onChange={(e) => {
                  setStaffSearch(e.target.value);
                  setSelectedStaffId(""); 
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>

            {showSuggestions && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-[180px] overflow-y-auto">
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

          {/* ROLE DROPDOWN - Forced to open at bottom */}
          <div className="space-y-1.5 relative z-40">
            <Label className="text-[13px] font-semibold text-slate-700">Functional Role *</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-10 rounded-md border-slate-200 bg-white">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                sideOffset={4} 
                className="w-[var(--radix-select-trigger-width)] max-h-[200px]"
              >
                {PRESET_ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="cursor-pointer">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BRANCH DROPDOWN - Forced to open at bottom */}
          <div className="space-y-1.5 relative z-30">
            <Label className="text-[13px] font-semibold text-slate-700">Target Branch Location *</Label>
            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
              <SelectTrigger className="h-10 rounded-md border-slate-200 bg-white">
                <SelectValue placeholder="Select destination branch" />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                sideOffset={4} 
                className="w-[var(--radix-select-trigger-width)] max-h-[200px]"
              >
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
            disabled={!selectedStaffId || !selectedBranchId || !role || isSubmitting}
            className="bg-[#0052cc] hover:bg-[#0041a3] text-white h-9"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Deployment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}