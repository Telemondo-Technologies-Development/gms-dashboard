import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ArrowLeft, Mail, Shield, MapPin, Phone, Calendar, User } from 'lucide-react';

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

export function AssignStaffDialog({ open, onOpenChange, branchName, staff, onUpdateStaff }: AssignStaffDialogProps) {
  const [view, setView] = useState<'list' | 'add' | 'details'>('list');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Staff' as 'Manager' | 'Staff',
    email: '',
    phone: '',
    address: '',
    birthday: ''
  });

  const handleAddStaff = () => {
    if (!formData.name || !formData.email) return;

    const newMember: StaffMember = {
      id: crypto.randomUUID(),
      ...formData
    };

    onUpdateStaff([...staff, newMember]);
    setFormData({ name: '', role: 'Staff', email: '', phone: '', address: '', birthday: '' });
    setView('list');
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if (!val) setView('list'); }}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto border-none shadow-2xl">  
        {view === 'list' && (
          <div className="flex flex-col max-h-[70vh]"> 
            <DialogHeader className="border-b pb-4 shrink-0">
              <DialogTitle className="text-xl tracking-tight font-bold text-zinc-900">
                Staff: {branchName}
              </DialogTitle>
            </DialogHeader>

            <div className="pt-6 shrink-0 px-1">
              <Button 
                onClick={() => setView('add')}
                variant="outline" 
                className="w-full h-16 border-dashed border-2 text-zinc-500 hover:text-black hover:border-zinc-900 gap-2 transition-all bg-zinc-50/50"
              >
                <Plus size={18} />
                <span className="font-bold uppercase text-[10px] tracking-widest">Add New Staff Member</span>
              </Button>
            </div>

            <div className="mt-6 overflow-y-auto pr-2 space-y-2 flex-1 custom-scrollbar min-h-[200px]">
              {staff.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-zinc-50 rounded-xl">
                  <p className="text-sm text-zinc-400 italic">No staff assigned yet.</p>
                </div>
              ) : (
                staff.map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => { setSelectedStaff(s); setView('details'); }}
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition-all group border border-transparent hover:border-zinc-200"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar with Role Badge */}
                      <div className="h-10 w-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center relative shrink-0">
                        <span className="text-xs font-bold text-zinc-600">{s.name.charAt(0)}</span>
                        
                        {/* The Badge: Positioned at the bottom right of the circle */}
                        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-zinc-100">
                          {s.role === 'Manager' ? (
                            <Shield className="h-2.5 w-2.5 text-emerald-600" />
                          ) : (
                            <User className="h-2.5 w-2.5 text-zinc-400" />
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 leading-none">{s.name}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight mt-1">
                          {s.role}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 group-hover:text-black tracking-widest uppercase transition-colors">
                      Details →
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {view === 'add' && (
          <div className="space-y-6">
            <header className="flex items-center gap-3">
              <button onClick={() => setView('list')} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-bold tracking-tight text-zinc-900">New Staff Member</h2>
            </header>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Full Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className="h-10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Position</Label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                    className="w-full h-10 rounded-md border border-zinc-200 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Birthday</Label>
                  <Input type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} className="h-10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email Address</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="h-10" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Phone Number</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+63 900 000 0000" className="h-10" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Home Address</Label>
                <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Street, City, Province" className="h-10" />
              </div>

              <Button onClick={handleAddStaff} className="w-full h-11 gap-2 bg-black text-white hover:bg-zinc-800 transition-all mt-2">
                <Plus size={16} /> Save Staff Member
              </Button>
            </div>
          </div>
        )}

        {/* VIEW 3: STAFF DETAILS POP-OUT */}
        {view === 'details' && selectedStaff && (
          <div className="space-y-8">
            <header className="flex items-center justify-between">
              <button onClick={() => setView('list')} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <ArrowLeft size={20} />
              </button>
              <button 
                onClick={() => { onUpdateStaff(staff.filter(m => m.id !== selectedStaff.id)); setView('list'); }}
                className="text-[10px] font-bold uppercase text-red-400 hover:text-red-600 transition-colors"
              >
                Remove Profile
              </button>
            </header>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-20 w-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold">
                {selectedStaff.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{selectedStaff.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{selectedStaff.role}</span>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-6 space-y-5 border border-zinc-100">
               <div className="flex items-start gap-4">
                  <Mail size={16} className="text-zinc-400 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Email</p>
                    <p className="text-sm font-medium text-zinc-900">{selectedStaff.email}</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <Phone size={16} className="text-zinc-400 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Phone</p>
                    <p className="text-sm font-medium text-zinc-900">{selectedStaff.phone}</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <MapPin size={16} className="text-zinc-400 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Address</p>
                    <p className="text-sm font-medium text-zinc-900">{selectedStaff.address}</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <Calendar size={16} className="text-zinc-400 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Birthday</p>
                    <p className="text-sm font-medium text-zinc-900">{selectedStaff.birthday}</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}