import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddBranchDialogProps {
  onAddBranch: (branch: BranchFormData) => void;
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: "Manager" | "Staff";
  email: string;
  address: string;
  birthday: string;
}

export interface BranchFormData {
  id: string;
  name: string;
  address: string;
  status: "Active" | "Closed";
  assignedStaff: StaffMember[];
  latitude: number;
  longitude: number;
  revenue: number; // Added revenue property
  expenses: number; // Added expenses property
  memberships: number; // Added memberships property
}

export function AddBranchDialog({ onAddBranch }: AddBranchDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    status: "Active",
  });

  const resetForm = () => {
    setFormData({ name: "", address: "", status: "Active" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fetchCoordinates = async (address: string) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            address
          )}&format=json`
        );
        const data = await response.json();
        if (data.length > 0) {
          return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          };
        }
        return { latitude: 0, longitude: 0 };
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        return { latitude: 0, longitude: 0 };
      }
    };

    const { latitude, longitude } = await fetchCoordinates(formData.address);

    const newBranch: BranchFormData = {
      id: crypto.randomUUID(),
      name: formData.name,
      address: formData.address,
      status: formData.status as "Active" | "Closed",
      assignedStaff: [],
      latitude,
      longitude,
      revenue: 0, // Initialize revenue
      expenses: 0, // Initialize expenses
      memberships: 0, // Initialize memberships
    };

    onAddBranch(newBranch);
    resetForm();
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 text-primary-foreground"
          variant="default"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Branch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>
              Fill in the details for the new branch. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter branch address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as "Active" | "Maintenance",
                      }))
                    }
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Close">Close</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="mt-6">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}