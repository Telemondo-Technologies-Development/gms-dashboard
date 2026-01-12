import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

interface AddBranchDialogProps {
  onAddBranch: (branch: BranchFormData) => void;
}

export interface BranchFormData {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'Active' | 'Maintenance';
}

export function AddBranchDialog({ onAddBranch }: AddBranchDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    status: 'Active', 
  });

  const resetForm = () => {
    setFormData({ name: '', address: '', phone: '', status: 'Active' }); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBranch: BranchFormData = {
      id: crypto.randomUUID(),
      name: formData.name,
      address: formData.address,
        phone: formData.phone,
      status: formData.status as 'Active' | 'Maintenance',
    };
    onAddBranch(newBranch); 
    resetForm(); 
    setOpen(false);
  };

  return (
    <>
      <Button className="gap-2 text-primary-foreground" variant="default" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add New Branch
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              resetForm();
              setOpen(false);
            }}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative flex flex-col bg-background text-foreground rounded-lg shadow-lg max-w-none w-[95vw] md:w-[600px] h-auto overflow-hidden"
          >
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Add New Branch</h2>
                  <p className="text-sm text-muted-foreground">
                    Fill in the details for the new branch. Click save when you're done.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-auto p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Branch Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Branch Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter branch name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        placeholder="Enter branch address"
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <select
                        id="status"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        value={formData.status}
                        onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'Active' | 'Maintenance' }))}
                        required
                      >
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}