import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface StaffDetailsCardProps {
  staff: {
    name: string;
    role: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
  };
}

export function StaffDetailsCard({ staff }: StaffDetailsCardProps) {
  const detailRows = [
    { icon: Mail, label: 'Email', value: staff.email },
    { icon: Phone, label: 'Phone', value: staff.phone },
    { icon: MapPin, label: 'Address', value: staff.address },
    { icon: Calendar, label: 'Birthday', value: staff.birthday },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6 border border-zinc-200">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-20 w-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold">
          {staff.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{staff.name}</h3>
          <p className="text-sm font-medium text-zinc-500">{staff.role}</p>
        </div>
      </div>

      <div className="space-y-4">
        {detailRows.map((row, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <row.icon size={20} className="text-zinc-400 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-zinc-400">{row.label}</p>
              <p className="text-sm font-medium text-zinc-900">{row.value || 'Not provided'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Birthday</Label>
              <Input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              />
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