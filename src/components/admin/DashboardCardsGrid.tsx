import React, { useState } from 'react';
import { Users, Settings, RefreshCw, Database, FileText, Beaker, PieChart } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import { Supplier } from '@/components/admin/SupplierList';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SupplierDropdownList from '@/components/admin/SupplierDropdownList';
import { supabase } from '@/integrations/supabase/client';

interface Ingredient {
  id: string;
  name: string;
  purity?: number | null;
  detergency?: number | null;
  foaming?: number | null;
  biodegrability?: number | null;
}

interface Submission {
  submissionid: string;
  submission_label: string | null;
  created_at: string;
  supplierid: string;
  total_batches: number | null;
  passed_batches: number | null;
  failed_batches: number | null;
}

interface DashboardCardsGridProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onFetchSuppliers: () => void;
}

const DashboardCardsGrid: React.FC<DashboardCardsGridProps> = ({
  suppliers,
  isLoading,
  onFetchSuppliers,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSupplierList, setShowSupplierList] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [fetchedSuppliers, setFetchedSuppliers] = useState<Supplier[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const pendingSupplierCount = suppliers.filter(s => s.status === 'Pending').length;
  
  const handleManageSuppliers = async () => {
    try {
      setIsLoadingSuppliers(true);
      
      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook-test/37825e51-69ed-4104-9def-af272b819973', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      
      const data = await response.json();
      console.log('Webhook response:', data);
      
      const supplierArray = Array.isArray(data) ? data : [data];
      
      setFetchedSuppliers(supplierArray);
      setShowSupplierList(true);
      
      toast({
        title: "Suppliers loaded",
        description: `Successfully loaded ${supplierArray.length} suppliers.`,
      });
    } catch (error) {
      console.error('Error triggering webhook:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the server. Proceeding with supplier management.",
        variant: "destructive"
      });
      
      if (suppliers.length > 0) {
        setFetchedSuppliers(suppliers);
        setShowSupplierList(true);
      } else {
        onFetchSuppliers();
      }
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  const handleFetchIngredients = async () => {
    try {
      setIsLoadingIngredients(true);
      
      const { data, error } = await supabase
        .from('ingredients')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      console.log('Ingredients data:', data);
      
      const ingredientsArray = Array.isArray(data) ? data : [data];
      
      setIngredients(ingredientsArray);
      navigate('/admin-ingredient-models', { state: { ingredients: ingredientsArray } });
      
      toast({
        title: "Ingredients loaded",
        description: `Successfully loaded ${ingredientsArray.length} ingredients.`,
      });
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ingredients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingIngredients(false);
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
    } catch (error) {
      console.error('Error toggling supplier status:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the supplier status.",
        variant: "destructive"
      });
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

  const handleViewAllSubmissions = async () => {
    try {
      setIsLoadingSubmissions(true);
      
      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook-test/be46fb03-6f2d-4f9e-8963-f7aba3eb4101', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Webhook submissions response:', data);
      
      const submissionsArray = Array.isArray(data) ? data : [data];
      
      navigate('/admin-all-submissions', { 
        state: { 
          submissions: submissionsArray, 
          fromWebhook: true 
        } 
      });
      
      toast({
        title: "Submissions loaded",
        description: `Successfully loaded submissions from webhook.`,
      });
    } catch (error) {
      console.error('Error fetching submissions from webhook:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions from webhook. Falling back to direct database access.",
        variant: "destructive"
      });
      
      navigate('/admin-all-submissions');
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Suppliers"
          description="Manage supplier accounts"
          icon={Users}
          value={suppliers.length || 0}
          subtitle="Active suppliers"
          extraInfo={`${pendingSupplierCount || 0} Pending approval`}
          extraInfoColor="text-amber-500"
          buttonText="Manage Suppliers"
          buttonIcon={isLoadingSuppliers ? RefreshCw : Users}
          loading={isLoadingSuppliers}
          loadingText="Loading..."
          onClick={handleManageSuppliers}
          gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
          accentColor="border-l-indigo-400"
        />

        <DashboardCard
          title="Detergent Configuration"
          description="Set quality standards"
          icon={Beaker}
          value=""
          subtitle="Define passing thresholds"
          buttonText="Detergent Configuration"
          onClick={() => navigate('/admin-baseline-config')}
          gradient="bg-gradient-to-br from-green-50 to-teal-50"
          accentColor="border-l-teal-400"
        />

        <DashboardCard
          title="Ingredient Models"
          description="Manage ingredient models"
          icon={Database}
          value={ingredients.length || 0}
          subtitle="Available ingredients"
          buttonText="Manage Models"
          buttonIcon={isLoadingIngredients ? RefreshCw : Database}
          loading={isLoadingIngredients}
          loadingText="Loading..."
          onClick={handleFetchIngredients}
          gradient="bg-gradient-to-br from-purple-50 to-pink-50"
          accentColor="border-l-purple-400"
        />

        <DashboardCard
          title="All Submissions"
          description="View all supplier submissions"
          icon={FileText}
          value={submissions.length || 0}
          subtitle="Total submissions"
          buttonText="View Submissions"
          buttonIcon={isLoadingSubmissions ? RefreshCw : FileText}
          loading={isLoadingSubmissions}
          loadingText="Loading..."
          onClick={handleViewAllSubmissions}
          gradient="bg-gradient-to-br from-amber-50 to-orange-50"
          accentColor="border-l-amber-400"
        />
      </div>
      
      {showSupplierList && (
        <SupplierDropdownList 
          suppliers={fetchedSuppliers} 
          onClose={() => setShowSupplierList(false)}
          onDelete={handleDeleteSupplier}
          onToggleStatus={handleToggleSupplierStatus}
        />
      )}
    </>
  );
};

export default DashboardCardsGrid;
