
import React from 'react';
import { Users, Settings, RefreshCw } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import { Supplier } from '@/components/admin/SupplierList';
import { useNavigate } from 'react-router-dom';

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
  const pendingSupplierCount = suppliers.filter(s => s.status === 'Pending').length;
  
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
        onClick={onFetchSuppliers}
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
