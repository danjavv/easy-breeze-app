
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Supplier } from './SupplierList';

interface DeleteConfirmationProps {
  supplier: Supplier | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  supplier,
  onConfirm,
  onCancel,
}) => {
  if (!supplier) return null;
  
  return (
    <>
      <div className="py-4">
        <p className="mb-2">
          This will permanently delete the supplier account for{" "}
          <span className="font-semibold">{supplier.company_name}</span>.
        </p>
        <p>This action cannot be undone.</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="destructive"
          onClick={onConfirm}
          className="flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </>
  );
};

export default DeleteConfirmation;
