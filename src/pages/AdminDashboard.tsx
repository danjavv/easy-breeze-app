import { useState, useEffect } from 'react';
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
  const { 
    models: contextModels, 
    ingredients: contextIngredients, 
    suppliers: contextSuppliers,
    setModels, 
    setIngredients,
    setSuppliers 
  } = useData();
  
  // Initialize local state from context
  const [localModels, setLocalModels] = useState<Model[]>(contextModels);
  const [localIngredients, setLocalIngredients] = useState<Ingredient[]>(contextIngredients);
  const [localSuppliers, setLocalSuppliers] = useState<Supplier[]>(contextSuppliers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isSupplierListOpen, setIsSupplierListOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);

  // Update local state when context changes
  useEffect(() => {
    setLocalModels(contextModels);
  }, [contextModels]);

  useEffect(() => {
    setLocalIngredients(contextIngredients);
  }, [contextIngredients]);

  useEffect(() => {
    setLocalSuppliers(contextSuppliers);
  }, [contextSuppliers]);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchSupplierData();
      setSuppliers(result.suppliers);
      setLocalSuppliers(result.suppliers);
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
    const updatedSuppliers = localSuppliers.map(supplier => 
      supplier.id === supplierId 
        ? { ...supplier, status: 'Approved' as const } 
        : supplier
    );
    setSuppliers(updatedSuppliers);
    setLocalSuppliers(updatedSuppliers);
    
    const supplierName = localSuppliers.find(s => s.id === supplierId)?.company_name;
    toast({
      title: "Supplier approved",
      description: `Supplier ${supplierName} has been approved successfully.`,
    });
    setIsSupplierDialogOpen(false);
  };

  const handleRejectSupplier = (supplierId: string) => {
    const updatedSuppliers = localSuppliers.map(supplier => 
      supplier.id === supplierId 
        ? { ...supplier, status: 'Rejected' as const } 
        : supplier
    );
    setSuppliers(updatedSuppliers);
    setLocalSuppliers(updatedSuppliers);
    
    const supplierName = localSuppliers.find(s => s.id === supplierId)?.company_name;
    toast({
      title: "Supplier rejected",
      description: `Supplier ${supplierName} has been rejected.`,
      variant: "destructive",
    });
    setIsSupplierDialogOpen(false);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    const updatedSuppliers = localSuppliers.filter(supplier => supplier.id !== supplierId);
    setSuppliers(updatedSuppliers);
    setLocalSuppliers(updatedSuppliers);
    
    const supplierName = localSuppliers.find(s => s.id === supplierId)?.company_name;
    toast({
      title: "Supplier deleted",
      description: `Supplier ${supplierName} has been deleted.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
  };

  const openDeleteConfirmation = (supplier: Supplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSupplierConfirm = () => {
    if (!supplierToDelete) return;
    
    handleDeleteSupplier(supplierToDelete.id);
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
      const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook-test/b65a9a50-5a55-462a-a29b-7f6572aa2dcc';
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
          suppliers={localSuppliers}
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
        suppliers={localSuppliers}
        isLoading={isLoading}
        error={error}
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        isSupplierDialogOpen={isSupplierDialogOpen}
        setIsSupplierDialogOpen={setIsSupplierDialogOpen}
        isSupplierListOpen={isSupplierListOpen}
        setIsSupplierListOpen={setIsSupplierListOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        supplierToDelete={supplierToDelete}
        setSupplierToDelete={setSupplierToDelete}
        onApproveSupplier={handleApproveSupplier}
        onRejectSupplier={handleRejectSupplier}
        onDeleteSupplier={(supplier, e) => {
          e.preventDefault();
          setSupplierToDelete(supplier);
          setIsDeleteDialogOpen(true);
        }}
        onDeleteConfirm={handleDeleteSupplierConfirm}
        onRetryFetch={fetchSuppliers}
      />
    </div>
  );
};

export default AdminDashboard;
