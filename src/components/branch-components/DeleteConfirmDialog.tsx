import React from 'react';
import { Button } from '../ui/button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  branchName: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  branchName,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-md z-50">
      <h3 className="text-lg font-semibold mb-4">Remove Branch?</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Are you sure you want to remove the branch "{branchName}"?
      </p>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm}>
          Remove
        </Button>
      </div>
    </div>
  );
};