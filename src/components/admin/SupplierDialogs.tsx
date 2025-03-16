
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import SupplierList, { Supplier } from '@/components/admin/SupplierList';
import SupplierDetails from '@/components/admin/SupplierDetails';
import DeleteConfirmation from '@/components/admin/DeleteConfirmation';

interface SupplierDialogsProps {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
  isMockData: boolean;
  isSupplierListOpen: boolean;
  setIsSupplierListOpen: (open: boolean) => void;
  isSupplierDialogOpen: boolean;
  setIsSupplierDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (supplier: Supplier | null) => void;
  supplierToDelete: Supplier | null;
  setSupplierToDelete: (supplier: Supplier | null) => void;
  onApproveSupplier: (supplierId: string) => void;
  onRejectSupplier: (supplierId: string) => void;
  onDeleteSupplier: (supplier: Supplier, e: React.MouseEvent) => void;
  onDeleteConfirm: () => void;
  onRetryFetch: () => void;
}

const SupplierDialogs: React.FC<SupplierDialogsProps> = ({
  suppliers,
  isLoading,
  error,
  isMockData,
  isSupplierListOpen,
  setIsSupplierListOpen,
  isSupplierDialogOpen,
  setIsSupplierDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedSupplier,
  setSelectedSupplier,
  supplierToDelete,
  setSupplierToDelete,
  onApproveSupplier,
  onRejectSupplier,
  onDeleteSupplier,
  onDeleteConfirm,
  onRetryFetch
}) => {
  
  const openSupplierDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierDialogOpen(true);
  };
  
  return (
    <>
      {/* Supplier List Dialog */}
      <Dialog open={isSupplierListOpen} onOpenChange={setIsSupplierListOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Supplier Management
              {isMockData && <span className="ml-2 text-xs text-amber-500">(Sample Data)</span>}
            </DialogTitle>
            <DialogDescription>
              {isMockData 
                ? "Displaying sample data as the supplier service is currently unavailable"
                : "View and manage all registered suppliers"}
            </DialogDescription>
          </DialogHeader>
          
          <SupplierList
            suppliers={suppliers}
            isLoading={isLoading}
            error={error}
            isMockData={isMockData}
            onViewSupplier={openSupplierDetails}
            onDeleteSupplier={onDeleteSupplier}
            onRetry={onRetryFetch}
          />
          
          <DialogFooter className="flex items-center justify-between mt-4">
            {isMockData && (
              <p className="text-xs text-muted-foreground">
                Note: Actions on sample data will only be persisted for this session
              </p>
            )}
            <Button onClick={() => setIsSupplierListOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supplier Details Dialog */}
      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              {selectedSupplier ? `Review information for ${selectedSupplier.company_name}` : 'Supplier details'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSupplier && (
            <SupplierDetails
              supplier={selectedSupplier}
              onApprove={onApproveSupplier}
              onReject={onRejectSupplier}
              onDelete={() => {
                setIsSupplierDialogOpen(false);
                setSupplierToDelete(selectedSupplier);
                setIsDeleteDialogOpen(true);
              }}
              onClose={() => setIsSupplierDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the supplier account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <DeleteConfirmation
            supplier={supplierToDelete}
            onConfirm={() => {
              onDeleteConfirm();
              setIsDeleteDialogOpen(false);
            }}
            onCancel={() => {
              setIsDeleteDialogOpen(false);
              setSupplierToDelete(null);
            }}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SupplierDialogs;
