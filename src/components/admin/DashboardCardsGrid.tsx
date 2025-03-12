
import React from 'react';
import { Users, ShoppingBag, BarChart2, Sliders, RefreshCw } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import { Supplier } from '@/components/admin/SupplierList';

interface DashboardCardsGridProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onFetchSuppliers: () => void;
  onNavigateToBaselineConfig: () => void;
}

const DashboardCardsGrid: React.FC<DashboardCardsGridProps> = ({
  suppliers,
  isLoading,
  onFetchSuppliers,
  onNavigateToBaselineConfig
}) => {
  const pendingSupplierCount = suppliers.filter(s => s.status === 'Pending').length;
  
  return (
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
        buttonIcon={isLoading ? RefreshCw : Users}
        loading={isLoading}
        loadingText="Loading..."
        onClick={onFetchSuppliers}
      />

      <DashboardCard
        title="Product Catalog"
        description="Oversee all products"
        icon={ShoppingBag}
        value={128}
        subtitle="Total products"
        buttonText="View Catalog"
        onClick={() => {}}
      />

      <DashboardCard
        title="Platform Analytics"
        description="System performance metrics"
        icon={BarChart2}
        value="$12,450"
        subtitle="Monthly revenue"
        buttonText="View Analytics"
        onClick={() => {}}
      />

      <DashboardCard
        title="Baseline Config"
        description="Set ingredient standards"
        icon={Sliders}
        value={4}
        subtitle="Ingredient parameters"
        buttonText="Configure Baseline"
        onClick={onNavigateToBaselineConfig}
      />
    </div>
  );
};

export default DashboardCardsGrid;
