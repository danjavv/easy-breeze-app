import React, { useState } from 'react';
import { Users, Settings, RefreshCw, Database, FileText, Beaker, PieChart, Download, FileDown, Loader2 } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import { Supplier } from '@/components/admin/SupplierList';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SupplierDropdownList from '@/components/admin/SupplierDropdownList';
import { supabase } from '@/integrations/supabase/client';
import SupplierManagementDialog from './SupplierManagementDialog';
import { useSupplierManagement } from '@/hooks/use-supplier-management';
import { useIngredientManagement } from '@/hooks/use-ingredient-management';
import { useSubmissionsManagement } from '@/hooks/use-submissions-management';
import { Ingredient, Model } from '@/pages/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardsGridProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onFetchSuppliers: () => void;
  models: Model[];
  ingredients: Ingredient[];
  isLoadingModels: boolean;
  isLoadingIngredients: boolean;
  onLoadModels: () => Promise<void>;
  onLoadIngredients: () => Promise<void>;
  onManageSuppliers: () => void;
  isLoadingSuppliers: boolean;
}

const DashboardCardsGrid: React.FC<DashboardCardsGridProps> = ({
  suppliers,
  isLoading,
  onFetchSuppliers,
  models,
  ingredients,
  isLoadingModels,
  isLoadingIngredients,
  onLoadModels,
  onLoadIngredients,
  onManageSuppliers,
  isLoadingSuppliers
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSupplierList, setShowSupplierList] = useState(false);
  const pendingSupplierCount = suppliers.filter(s => s.status === 'Pending').length;
  
  // Use our custom hooks
  const {
    fetchedSuppliers,
    isLoadingSuppliers: isLoadingHookSuppliers,
    showSupplierManagement,
    setShowSupplierManagement,
    handleManageSuppliers,
    handleAddSupplier,
    handleDeleteSupplier,
    handleToggleSupplierStatus
  } = useSupplierManagement(suppliers);
  
  const {
    ingredients: hookIngredients,
    isLoadingIngredients: isLoadingHookIngredients,
    handleFetchIngredients
  } = useIngredientManagement();
  
  const {
    submissions,
    isLoadingSubmissions,
    handleViewAllSubmissions
  } = useSubmissionsManagement();

  return (
    <>
      {/* Loading buttons outside card sections */}
      <div className="flex justify-end space-x-4 mb-6">
        <Button 
          variant="outline"
          onClick={onLoadIngredients}
          disabled={isLoadingIngredients}
          className="flex items-center"
        >
          {isLoadingIngredients ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isLoadingIngredients ? 'Loading Detergents...' : 'Load Detergents'}
        </Button>
        
        <Button 
          variant="outline"
          onClick={onLoadModels}
          disabled={isLoadingModels}
          className="flex items-center"
        >
          {isLoadingModels ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Database className="mr-2 h-4 w-4" />
          )}
          {isLoadingModels ? 'Loading Models...' : 'Load Models'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Suppliers</div>
            <p className="text-xs text-muted-foreground">
              Manage supplier accounts and permissions
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={onManageSuppliers}
              disabled={isLoadingSuppliers}
            >
              {isLoadingSuppliers ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Users className="mr-2 h-4 w-4" />
              )}
              Manage Suppliers
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Database</div>
            <p className="text-xs text-muted-foreground">
              View and manage database records
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {}}
            >
              <Database className="mr-2 h-4 w-4" />
              View Database
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Data</CardTitle>
            <FileDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Export</div>
            <p className="text-xs text-muted-foreground">
              Export data in various formats
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {}}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        <DashboardCard
          title="Detergent Configuration"
          description="Set quality standards"
          icon={Beaker}
          value={ingredients.length || 0}
          subtitle={ingredients.length ? `${ingredients.length} detergents loaded` : "No detergents loaded"}
          buttonText="Configure Detergents"
          buttonIcon={Settings}
          onClick={() => navigate('/admin-baseline-config')}
          gradient="bg-gradient-to-br from-green-50 to-teal-50"
          accentColor="border-l-teal-400"
        />

        <DashboardCard
          title="Ingredient Models"
          description="Manage ingredient models"
          icon={Database}
          value={models.length || 0}
          subtitle={models.length ? `${models.length} models loaded` : "No models loaded"}
          buttonText="Manage Models"
          buttonIcon={Settings}
          onClick={() => navigate('/admin-ingredient-models')}
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
      
      {/* Add buttons to navigate to model-ingredient assignment page */}
      <div className="flex justify-end space-x-4 mb-8">
        <button 
          onClick={() => navigate('/admin-ingredient-models')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Manage Model Assignments
        </button>
      </div>
      
      {/* Supplier Management Dialog with Tabs */}
      <SupplierManagementDialog 
        open={showSupplierManagement}
        onOpenChange={setShowSupplierManagement}
        suppliers={fetchedSuppliers}
        onDelete={handleDeleteSupplier}
        onAddSupplier={handleAddSupplier}
      />
      
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
