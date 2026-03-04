import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
      .map((emp: any) => {
        const mid = emp.middleName ? ` ${emp.middleName}` : '';
        const suf = emp.suffix ? ` ${emp.suffix}` : '';
        return {
          id: emp.actorId,
          name: `${emp.firstName ?? ''}${mid} ${emp.surname ?? ''}${suf}`.trim() || 'Unnamed Employee',
        };
      })
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
    } catch (error) {
      console.error("Assignment failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight text-zinc-900">
            Deploy Personnel
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
              Select Staff Member
            </Label>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-100 focus:ring-[#0062cc]">
                <SelectValue placeholder={loadingEmployees ? "Loading staff..." : "Select personnel"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-zinc-100">
                <div className="flex items-center px-3 pb-2 pt-1 border-b border-zinc-50">
                  <Search className="h-3.5 w-3.5 text-zinc-400 mr-2" />
                  <Input 
                    placeholder="Search by name..." 
                    className="h-8 border-none bg-transparent text-xs focus-visible:ring-0 px-0 shadow-none"
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto p-1">
                  {availableStaff.length > 0 ? (
                    availableStaff.map((staff: any) => (
                      <SelectItem key={staff.id} value={staff.id} className="rounded-lg py-2.5 text-sm">
                        {staff.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-zinc-500 italic">
                      No matching staff found
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
              Functional Role (Designation)
            </Label>
            <Input 
              placeholder="e.g. Branch Manager, Coach" 
              className="h-12 rounded-xl bg-zinc-50 border-zinc-100 focus:ring-[#0062cc]"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
              Target Branch Location
            </Label>
            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
              <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-100 focus:ring-[#0062cc]">
                <SelectValue placeholder="Select destination branch" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id} className="rounded-lg py-2.5 text-sm">
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest text-zinc-500 hover:bg-zinc-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedStaffId || !selectedBranchId || !role || isSubmitting}
            className="bg-[#0062cc] hover:bg-[#0056b3] text-white rounded-xl px-8 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : "Confirm Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}