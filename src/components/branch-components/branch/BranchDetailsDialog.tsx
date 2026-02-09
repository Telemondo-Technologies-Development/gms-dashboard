import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  phone: string;
  role: 'Manager' | 'Staff';
  email: string;
  address: string;
  birthday: string;
}

export interface BranchFormData {
  id: string;
  name: string;
  address: string;
  status: 'Active' | 'Closed';
  assignedStaff: StaffMember[];
  latitude: number; 
  longitude: number;
  revenue: number; 
  expenses: number; 
  memberships: number;
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
  const [status, setStatus] = useState<'Active' | 'Closed'>('Active');

  useEffect(() => {
    if (!branch) return;

    setName(branch.name);
    setAddress(branch.address);
    setStatus(branch.status);
  }, [branch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;

    const updatedBranch: BranchFormData = {
      ...branch,
      name,
      address,
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
              <div className="space-y-4 border border-border p-4 rounded-2xl">
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
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-background"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Closed')}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Close</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit" disabled={!branch} className="">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}