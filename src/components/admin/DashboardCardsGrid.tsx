
import React, { useState } from 'react';
import { Users, Settings, RefreshCw } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import { Supplier } from '@/components/admin/SupplierList';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SupplierDropdownList from '@/components/admin/SupplierDropdownList';

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
  const pendingSupplierCount = suppliers.filter(s => s.status === 'Pending').length;
  
  const handleManageSuppliers = async () => {
    try {
      setIsLoadingSuppliers(true);
      
      // Trigger webhook to fetch suppliers
      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook-test/37825e51-69ed-4104-9def-af272b819973', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'manage_suppliers' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      
      const data = await response.json();
      console.log('Webhook response:', data);
      
      // Handle both single object and array responses
      const supplierArray = Array.isArray(data) ? data : [data];
      
      // Update suppliers with the fetched data
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
      
      // Fall back to existing suppliers if available
      if (suppliers.length > 0) {
        setFetchedSuppliers(suppliers);
        setShowSupplierList(true);
      } else {
        // If no suppliers, call the original fetch function
        onFetchSuppliers();
      }
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    try {
      // Update the local state by removing the deleted supplier
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
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        />

        <DashboardCard
          title="Baseline Configuration"
          description="Set quality standards"
          icon={Settings}
          value="Quality Standards"
          subtitle="Define passing thresholds"
          buttonText="Configure Standards"
          onClick={() => navigate('/admin-baseline-config')}
        />
      </div>
      
      {showSupplierList && (
        <SupplierDropdownList 
          suppliers={fetchedSuppliers} 
          onClose={() => setShowSupplierList(false)}
          onDelete={handleDeleteSupplier}
        />
      )}
    </>
  );
};

export default DashboardCardsGrid;
