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
  threshold_biodegrability?: number;
  threshold_purity?: number;
}

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setModels, setIngredients } = useData();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isSupplierListOpen, setIsSupplierListOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Local state variables for UI display
  const [localModels, setLocalModels] = useState<Model[]>([]);
  const [localIngredients, setLocalIngredients] = useState<Ingredient[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchSupplierData();
      setSuppliers(result.suppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('Failed to fetch suppliers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
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
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const goToBaselineConfig = () => {
    navigate('/admin-baseline-config');
  };

  const loadModels = async () => {
    if (isLoadingModels) return;
    
    setIsLoadingModels(true);
    try {
      const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook/416b3513-de98-441c-b482-c2e9cfb1f329';
      const webhookData = await fetchFromWebhook(webhookUrl);
      const formattedModels = processWebhookModels(webhookData);
      
      if (formattedModels.length > 0) {
        // Update both local state and context
        setLocalModels(formattedModels);
        setModels(formattedModels);
        
        toast({
          title: "Models loaded",
          description: `Successfully loaded ${formattedModels.length} models.`,
        });
      } else {
        toast({
          title: "No models found",
          description: "Could not retrieve any model data.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading models:', error);
      toast({
        title: "Error loading models",
        description: "An unexpected error occurred while loading models.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingModels(false);
    }
  };

  const loadIngredients = async () => {
    if (isLoadingIngredients) return;
    
    setIsLoadingIngredients(true);
    try {
      const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook/b65a9a50-5a55-462a-a29b-7f6572aa2dcc';
      const webhookData = await fetchFromWebhook(webhookUrl);
      const formattedIngredients = processWebhookIngredients(webhookData);
      
      if (formattedIngredients.length > 0) {
        // Update both local state and context
        setLocalIngredients(formattedIngredients);
        setIngredients(formattedIngredients);
        
        toast({
          title: "Detergents loaded",
          description: `Successfully loaded ${formattedIngredients.length} detergents.`,
        });
      } else {
        toast({
          title: "No detergents found",
          description: "Could not retrieve any detergent data.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading detergents:', error);
      toast({
        title: "Error loading detergents",
        description: "An unexpected error occurred while loading detergents.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingIngredients(false);
    }
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
          models={localModels}
          ingredients={localIngredients}
          isLoadingModels={isLoadingModels}
          isLoadingIngredients={isLoadingIngredients}
          onLoadModels={loadModels}
          onLoadIngredients={loadIngredients}
        />
      </main>

      <SupplierDialogs
        suppliers={suppliers}
        isLoading={isLoading}
        error={error}
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
        onDeleteSupplier={handleDeleteSupplier}
        onDeleteConfirm={handleDeleteSupplier}
        onRetryFetch={fetchSuppliers}
      />
    </div>
  );
};

export default AdminDashboard;
