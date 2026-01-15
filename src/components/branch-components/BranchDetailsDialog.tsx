import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react'; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface StaffMember {
  id: string;
  name: string;
  role: 'Manager' | 'Staff';
  email: string;
  phone: string;
  address: string;
  birthday: string;
}

export interface BranchFormData {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'Active' | 'Maintenance';
  assignedStaff: StaffMember[];
  latitude: number; 
  longitude: number;
}

interface BranchDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: BranchFormData | null;
  onSave: (updatedBranch: BranchFormData) => void; 
}

export function BranchDetailsDialog({
  open,
  onOpenChange,
  branch,
  onSave,
}: BranchDetailsDialogProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Maintenance'>('Active');

  useEffect(() => {
    if (!branch) return;

    setName(branch.name);
    setAddress(branch.address);
    setPhone(branch.phone || ''); 
    setStatus(branch.status);
  }, [branch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;

    const updatedBranch: BranchFormData = {
      ...branch,
      name,
      address,
      phone, 
      status,
    };

    onSave(updatedBranch);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Branch Details</DialogTitle>
            <DialogDescription>View and update branch information.</DialogDescription>
          </DialogHeader>

          {!branch ? (
            <div className="text-sm text-muted-foreground text-center py-4">No branch selected.</div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-background"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Maintenance')}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit" disabled={!branch} className="bg-black text-white hover:bg-zinc-800">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}