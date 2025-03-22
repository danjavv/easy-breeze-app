
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SupplierManagementTabs from './SupplierManagementTabs';
import { Supplier } from './SupplierList';

interface SupplierManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  onDelete: (supplierId: string) => void;
  onAddSupplier: (newSupplier: Omit<Supplier, 'id' | 'created_at'>) => void;
}

const SupplierManagementDialog: React.FC<SupplierManagementDialogProps> = ({
  open,
  onOpenChange,
  suppliers,
  onDelete,
  onAddSupplier
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Supplier Management</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden py-4">
          <SupplierManagementTabs 
            suppliers={suppliers}
            onClose={() => onOpenChange(false)}
            onDelete={onDelete}
            onAddSupplier={onAddSupplier}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierManagementDialog;
