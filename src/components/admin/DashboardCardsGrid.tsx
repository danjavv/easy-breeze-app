import React, { useState } from 'react';
import { Users, Settings, RefreshCw, Database, FileText, Beaker, PieChart } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import { Supplier } from '@/components/admin/SupplierList';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SupplierDropdownList from '@/components/admin/SupplierDropdownList';
import { supabase } from '@/integrations/supabase/client';
import SupplierManagementTabs from './SupplierManagementTabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSupplierManagement } from '@/hooks/use-supplier-management';
import { useIngredientManagement } from '@/hooks/use-ingredient-management';
import { useSubmissionsManagement } from '@/hooks/use-submissions-management';

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
  const pendingSupplierCount = suppliers.filter(s => s.status === 'Pending').length;
  
  // Use our custom hooks
  const {
    fetchedSuppliers,
    isLoadingSuppliers,
    showSupplierManagement,
    setShowSupplierManagement,
    handleManageSuppliers,
    handleAddSupplier,
    handleDeleteSupplier
  } = useSupplierManagement(suppliers);
  
  const {
    ingredients,
    isLoadingIngredients,
    handleFetchIngredients
  } = useIngredientManagement();
  
  const {
    submissions,
    isLoadingSubmissions,
    handleViewAllSubmissions
  } = useSubmissionsManagement();

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
      
      {/* Supplier Management Dialog with Tabs */}
      <Dialog open={showSupplierManagement} onOpenChange={setShowSupplierManagement}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Supplier Management</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden py-4">
            <SupplierManagementTabs 
              suppliers={fetchedSuppliers}
              onClose={() => setShowSupplierManagement(false)}
              onDelete={handleDeleteSupplier}
              onAddSupplier={handleAddSupplier}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Keep the existing SupplierDropdownList component for backward compatibility */}
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
