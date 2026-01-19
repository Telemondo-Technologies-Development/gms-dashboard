import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { StaffListView } from './StaffListView';
import { StaffAddView } from './StaffAddView';
import { StaffDetailsView } from './StaffDetailsView';



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
  onUpdateStaff: (newStaff: StaffMember[]) => void;
}

export function AssignStaffDialog({
  open,
  onOpenChange,
  branchName,
  staff,
  onUpdateStaff,
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
            branchName={branchName}
            staff={staff}
            onAddClick={() => setView('add')}
            onSelect={(member: StaffMember) => {
              setSelectedMember(member);
              setView('details');
            }}
          />
        )}

        {view === 'add' && (
          <StaffAddView
            open={open}
            onClose={() => {
              onOpenChange(false);
              handleBack();
            }}
            onSave={(newMember: StaffMember) => {
              onUpdateStaff([...staff, newMember]);
              setView('list');
            }}
            onBack={handleBack}
          />
        )}

        {view === 'details' && selectedMember && (
          <StaffDetailsView
            member={selectedMember}
            onBack={handleBack}
            onRemove={(id: string) => {
              onUpdateStaff(staff.filter((member) => member.id !== id));
              handleBack();
            }}
            onRoleChange={handleRoleChange} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}