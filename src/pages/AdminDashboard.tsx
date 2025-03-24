import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Supplier } from '@/components/admin/SupplierList';
import { fetchSupplierData } from '@/services/supplierService';
import { fetchFromWebhook, processWebhookIngredients, processWebhookModels } from '@/utils/webhookUtils';
import { useData } from '@/contexts/DataContext';

// Refactored Components
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardTitle from '@/components/admin/DashboardTitle';
import DashboardCardsGrid from '@/components/admin/DashboardCardsGrid';
import SupplierDialogs from '@/components/admin/SupplierDialogs';
import ModelAssignmentSection from '@/components/admin/ModelAssignmentSection';
import SupplierAssignmentSection from '@/components/admin/SupplierAssignmentSection';

// Define interfaces for models and ingredients
export interface Ingredient {
  id: string;
  name: string;
  detergency?: number;
  foaming?: number;
  biodegradability?: number;
  purity?: number;
}

export interface Model {
  id: string;
  name: string;
  threshold_detergency?: number;
  threshold_foaming?: number;
  threshold_biodegradability?: number;
  threshold_purity?: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { models, ingredients, suppliers, setModels, setIngredients, setSuppliers, isLoading, error, fetchData } = useData();

  const [fetchedSuppliers, setFetchedSuppliers] = useState<Supplier[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [showSupplierManagement, setShowSupplierManagement] = useState(false);
  const [isSupplierListOpen, setIsSupplierListOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const handleManageSuppliers = () => {
    setIsLoadingSuppliers(true);
    
    setFetchedSuppliers(suppliers);
    setShowSupplierManagement(true);
    
    toast({
      title: "Suppliers loaded",
      description: `Successfully loaded ${suppliers.length} suppliers.`,
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

  const handleApproveSupplier = async (supplierId: string) => {
    try {
      setFetchedSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === supplierId
            ? { ...supplier, status: 'Approved' }
            : supplier
        )
      );
      
      toast({
        title: "Supplier approved",
        description: "The supplier has been approved successfully.",
      });
    } catch (error) {
      console.error('Error approving supplier:', error);
      toast({
        title: "Approval Failed",
        description: "There was an error approving the supplier.",
        variant: "destructive"
      });
    }
  };

  const handleRejectSupplier = async (supplierId: string) => {
    try {
      setFetchedSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === supplierId
            ? { ...supplier, status: 'Rejected' }
            : supplier
        )
      );
      
      toast({
        title: "Supplier rejected",
        description: "The supplier has been rejected successfully.",
      });
    } catch (error) {
      console.error('Error rejecting supplier:', error);
      toast({
        title: "Rejection Failed",
        description: "There was an error rejecting the supplier.",
        variant: "destructive"
      });
    }
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierDialogOpen(true);
  };

  const handleDeleteClick = (supplier: Supplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (supplierToDelete) {
      await handleDeleteSupplier(supplierToDelete.id);
      setIsDeleteDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  const handleRetryFetch = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} onSignOut={signOut} />
      
      <main className="container mx-auto px-4 py-8">
        <DashboardTitle title="Admin Dashboard" />
        
        <DashboardCardsGrid
          onManageSuppliers={handleManageSuppliers}
          isLoadingSuppliers={isLoadingSuppliers}
        />
        
        <SupplierDialogs
          suppliers={fetchedSuppliers}
          isLoading={isLoadingSuppliers}
          error={error}
          isMockData={false}
          isSupplierListOpen={showSupplierManagement}
          setIsSupplierListOpen={setShowSupplierManagement}
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
          onDeleteSupplier={handleDeleteClick}
          onDeleteConfirm={handleDeleteConfirm}
          onRetryFetch={handleRetryFetch}
        />

        <ModelAssignmentSection />
        <SupplierAssignmentSection />
      </main>
    </div>
  );
};

export default AdminDashboard;
