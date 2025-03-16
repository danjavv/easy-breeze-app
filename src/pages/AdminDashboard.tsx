
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Supplier } from '@/components/admin/SupplierList';
import { fetchSupplierData } from '@/services/supplierService';

// Refactored Components
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardTitle from '@/components/admin/DashboardTitle';
import DashboardCardsGrid from '@/components/admin/DashboardCardsGrid';
import SupplierDialogs from '@/components/admin/SupplierDialogs';

const AdminDashboard = () => {
  const { setUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isSupplierListOpen, setIsSupplierListOpen] = useState(false);
  const [isMockData, setIsMockData] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchSuppliers = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setIsMockData(false);
    
    try {
      const result = await fetchSupplierData();
      
      // Set all suppliers to Pending status
      const pendingSuppliers = result.suppliers.map(supplier => ({
        ...supplier,
        status: 'Pending' as const
      }));
      
      setSuppliers(pendingSuppliers);
      setIsMockData(result.isMockData);
      setError(result.error);
      setIsSupplierListOpen(true);
      
      toast({
        title: "Suppliers loaded",
        description: `All suppliers set to Pending status.`,
      });
      
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    setUserRole(null);
    navigate('/auth');
  };

  const handleApproveSupplier = (supplierId: string) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === supplierId 
          ? { ...supplier, status: 'Approved' as const } 
          : supplier
      )
    );
    
    toast({
      title: "Supplier approved",
      description: `Supplier ${suppliers.find(s => s.id === supplierId)?.company_name} has been approved successfully.`,
    });
    setIsSupplierDialogOpen(false);
  };

  const handleRejectSupplier = (supplierId: string) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === supplierId 
          ? { ...supplier, status: 'Rejected' as const } 
          : supplier
      )
    );
    
    toast({
      title: "Supplier rejected",
      description: `Supplier ${suppliers.find(s => s.id === supplierId)?.company_name} has been rejected.`,
      variant: "destructive"
    });
    setIsSupplierDialogOpen(false);
  };

  const openDeleteConfirmation = (supplier: Supplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSupplier = () => {
    if (!supplierToDelete) return;
    
    setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierToDelete.id));
    
    toast({
      title: "Supplier deleted",
      description: `Supplier ${supplierToDelete.company_name} has been deleted successfully.`,
      variant: "destructive"
    });
    
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const goToBaselineConfig = () => {
    navigate('/admin-baseline-config');
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminHeader onSignOut={handleSignOut} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardTitle />
        
        <DashboardCardsGrid 
          suppliers={suppliers}
          isLoading={isLoading}
          onFetchSuppliers={fetchSuppliers}
        />
      </main>

      <SupplierDialogs
        suppliers={suppliers}
        isLoading={isLoading}
        error={error}
        isMockData={isMockData}
        isSupplierListOpen={isSupplierListOpen}
        setIsSupplierListOpen={setIsSupplierListOpen}
        isSupplierDialogOpen={isSupplierDialogOpen}
        setIsSupplierDialogOpen={setIsSupplierDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        supplierToDelete={supplierToDelete}
        setSupplierToDelete={setSupplierToDelete}
        onApproveSupplier={handleApproveSupplier}
        onRejectSupplier={handleRejectSupplier}
        onDeleteSupplier={openDeleteConfirmation}
        onDeleteConfirm={handleDeleteSupplier}
        onRetryFetch={fetchSuppliers}
      />
    </div>
  );
};

export default AdminDashboard;
