
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Supplier } from '@/components/admin/SupplierList';

export function useSupplierManagement(initialSuppliers: Supplier[]) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fetchedSuppliers, setFetchedSuppliers] = useState<Supplier[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [showSupplierManagement, setShowSupplierManagement] = useState(false);

  const handleManageSuppliers = () => {
    setIsLoadingSuppliers(true);
    
    setFetchedSuppliers(initialSuppliers);
    setShowSupplierManagement(true);
    
    toast({
      title: "Suppliers loaded",
      description: `Successfully loaded ${initialSuppliers.length} suppliers.`,
    });
    
    setIsLoadingSuppliers(false);
  };

  const handleAddSupplier = async (newSupplier: Omit<Supplier, 'id' | 'created_at'>) => {
    try {
      const now = new Date().toISOString();
      const mockId = crypto.randomUUID();
      
      const supplierWithId: Supplier = {
        ...newSupplier,
        id: mockId,
        created_at: now
      };
      
      setFetchedSuppliers(prev => [...prev, supplierWithId]);
      
      return supplierWithId;
    } catch (error) {
      console.error('Error adding supplier:', error);
      throw error;
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    try {
      setFetchedSuppliers(prev => prev.filter(s => s.id !== supplierId));
      
      toast({
        title: "Supplier deleted",
        description: "The supplier has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the supplier.",
        variant: "destructive"
      });
    }
  };

  const handleToggleSupplierStatus = async (supplier: Supplier) => {
    try {
      const newStatus = supplier.status === 'Pending' ? 'Approved' : 'Pending';
      
      setFetchedSuppliers(prev => 
        prev.map(s => s.id === supplier.id ? { ...s, status: newStatus as 'Pending' | 'Approved' | 'Rejected' } : s)
      );
      
      toast({
        title: `Supplier ${newStatus}`,
        description: `${supplier.company_name}'s status updated to ${newStatus}.`,
      });

      return true;
    } catch (error) {
      console.error('Error toggling supplier status:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the supplier status.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    fetchedSuppliers,
    isLoadingSuppliers,
    showSupplierManagement,
    setShowSupplierManagement,
    handleManageSuppliers,
    handleAddSupplier,
    handleDeleteSupplier,
    handleToggleSupplierStatus
  };
}
