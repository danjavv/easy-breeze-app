
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { Supplier } from './SupplierList';
import { useToast } from '@/hooks/use-toast';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  if (!supplier) return null;
  
  const handleDelete = async () => {
    if (!supplier) return;
    
    setIsDeleting(true);
    
    try {
      // Send webhook with the supplier ID using POST method
      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook-test/f10f55eb-e794-4df9-a9b4-7e1fc2d3b537', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          supplierID: supplier.id 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete supplier');
      }
      
      const data = await response.json();
      console.log('Delete response:', data);
      
      if (data.message === 'deleted successfully') {
        toast({
          title: "Delete Successful",
          description: `Supplier ${supplier.company_name} has been deleted.`,
        });
        onConfirm();
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the supplier. Please try again.",
        variant: "destructive"
      });
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-4 mt-4">
      <div className="py-2">
        <p className="mb-2">
          You are about to delete the supplier account for{" "}
          <span className="font-semibold">{supplier.company_name}</span>.
        </p>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone.
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button 
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center"
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
