
import React from 'react';
import { Users, Settings, RefreshCw } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import { Supplier } from '@/components/admin/SupplierList';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const pendingSupplierCount = suppliers.filter(s => s.status === 'Pending').length;
  
  const handleManageSuppliers = async () => {
    try {
      // Trigger webhook before fetching suppliers
      await fetch('https://danjaved008.app.n8n.cloud/webhook-test/37825e51-69ed-4104-9def-af272b819973', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'manage_suppliers' }),
      });
      
      // Now fetch suppliers
      onFetchSuppliers();
    } catch (error) {
      console.error('Error triggering webhook:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the server. Proceeding with supplier management.",
        variant: "destructive"
      });
      
      // Still fetch suppliers even if webhook fails
      onFetchSuppliers();
    }
  };
  
  return (
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
        buttonIcon={isLoading ? RefreshCw : Users}
        loading={isLoading}
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
  );
};

export default DashboardCardsGrid;
