import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ArrowLeft } from 'lucide-react';

interface StaffAddViewProps {
  onBack: () => void;
  onSave: (member: {
    id: string;
    name: string;
    role: 'Manager' | 'Staff';
    email: string;
    phone: string;
    address: string;
    birthday: string;
  }) => void;
}

export function StaffAddView({ onBack, onSave }: StaffAddViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Staff' as 'Manager' | 'Staff',
    email: '',
    phone: '',
    address: '',
    birthday: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) return;

    onSave({
      id: crypto.randomUUID(),
      ...formData
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex items-center gap-3 p-6 border-b shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold tracking-tight text-zinc-900">New Staff Member</h2>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Full Name</Label>
          <Input 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            placeholder="John Doe" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Position</Label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value as any})}
              className="w-full h-10 rounded-md border border-zinc-200 bg-background px-3 text-sm focus:outline-none"
            >
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Birthday</Label>
            <Input type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email Address</Label>
          <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Phone Number</Label>
          <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+63 900 000 0000" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Home Address</Label>
          <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Street, City, Province" />
        </div>
      </div>

      <div className="p-6 border-t bg-white shrink-0">
        <Button onClick={handleSubmit} className="w-full h-11 gap-2 bg-black text-white hover:bg-zinc-800 transition-all">
          <Plus size={16} /> Save Staff Member
        </Button>
      </div>
    </div>
  );
}