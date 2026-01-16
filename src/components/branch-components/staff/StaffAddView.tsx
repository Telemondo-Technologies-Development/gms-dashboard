import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


interface StaffAddViewProps {
  open: boolean;
  onClose: () => void;
  onSave: (staff: {
    id: string;
    name: string;
    role: 'Manager' | 'Staff';
    email: string;
    phone: string;
    address: string;
    birthday: string;
  }) => void;
  onBack: () => void;
}

export function StaffAddView({ open, onClose, onSave, onBack }: StaffAddViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Staff' as 'Manager' | 'Staff',
    email: '',
    phone: '',
    address: '',
    birthday: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'Staff',
      email: '',
      phone: '',
      address: '',
      birthday: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Name and Email are required!');
      return;
    }

    onSave({
      id: crypto.randomUUID(),
      ...formData,
    });

    resetForm();
    onBack();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Position</Label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Manager' | 'Staff' })}
                className="w-full h-10 px-3 border border-zinc-300 rounded-md text-sm"
              >
                <option value="Staff">Staff</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Phone Number</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+63 900 000 0000"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Home Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street, City, Province"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Birthday</Label>
              <Input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function onBack() {
  throw new Error('Function not implemented.');
}
