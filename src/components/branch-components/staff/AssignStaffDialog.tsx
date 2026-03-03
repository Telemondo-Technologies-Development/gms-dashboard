import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { StaffListView } from './StaffListView';



export interface StaffMember {
  id: string;
  name: string;
  role: 'Manager' | 'Staff';
  email: string;
  phone: string;
  address: string;
  birthday: string;
}

interface AssignStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchName: string;
  staff: StaffMember[];
  branchId: string;
  onUpdateStaff: (newStaff: StaffMember[]) => void;
}

export function AssignStaffDialog({
  open,
  onOpenChange,
  branchName,
  staff,
  onUpdateStaff,
  branchId,
}: AssignStaffDialogProps) {
  const [view, setView] = useState<'list' | 'add' | 'details'>('list');
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

  const handleRoleChange = (id: string, role: 'Manager' | 'Staff') => {
    const updatedStaff = staff.map((member) =>
      member.id === id ? { ...member, role } : member
    );
    onUpdateStaff(updatedStaff);

    if (selectedMember?.id === id) {
      setSelectedMember((prev) => (prev ? { ...prev, role } : null));
    }
  };

  const handleBack = () => {
    setView('list');
    setSelectedMember(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) setView('list');
      }}
    >
      <DialogContent className="sm:max-w-[450px] max-h-[85vh] p-0 flex flex-col overflow-hidden border-none shadow-2xl bg-white">
        {view === 'list' && (
          <StaffListView
            branchId={branchId}
            branchName={branchName}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}