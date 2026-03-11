import React from 'react';
import { Button } from '../../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../../ui/dialog'; 

interface UnassignStaffDialogProps {
  isOpen: boolean;
  staffName: string | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const UnassignStaffDialog: React.FC<UnassignStaffDialogProps> = ({
  isOpen,
  staffName,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 uppercase tracking-tight">
            Unassign Personnel
          </DialogTitle>
          <DialogDescription className="text-slate-500 pt-2">
            Are you sure you want to remove **{staffName || 'this staff member'}** from this branch? 
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-6 flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl font-bold uppercase text-[11px] tracking-widest"
          >
            Keep Assigned
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl font-bold uppercase text-[11px] tracking-widest bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Processing..." : "Confirm Removal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};