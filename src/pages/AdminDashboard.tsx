
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Users, ShoppingBag, BarChart2, Settings, Search, Sliders, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import DashboardCard from '@/components/admin/DashboardCard';
import SupplierList, { Supplier } from '@/components/admin/SupplierList';
import SupplierDetails from '@/components/admin/SupplierDetails';
import DeleteConfirmation from '@/components/admin/DeleteConfirmation';

const defaultSuppliers: Supplier[] = [
  {
    "id": "2ba035af-e4ad-4a7b-aaca-cd318b7c8647",
    "company_name": "LOL",
    "email": "lol@gmail.com",
    "notification_email": "lol@gmail.com",
    "password_hash": "LOL",
    "status": "Approved",
    "created_at": "2025-03-07T15:25:50.84047"
  },
  {
    "id": "32a5f1d3-003b-4955-8a81-9f90406136a9",
    "company_name": "ABC",
    "email": "abc@gmail.com",
    "notification_email": "abc@gmail.com",
    "password_hash": "ABCDE",
    "status": "Approved",
    "created_at": "2025-03-07T15:18:47.899904"
  },
  {
    "id": "439ba9f0-6184-49cf-97e1-4d872a0799da",
    "company_name": "Reliance",
    "email": "reliance@gmail.com",
    "notification_email": "reliance@gmail.com",
    "password_hash": "ABCDE",
    "status": "Approved",
    "created_at": "2025-03-07T16:54:27.934076"
  },
  {
    "id": "43bf87df-c7b7-407f-9680-7e8a330e9b44",
    "company_name": "AMC",
    "email": "amc@gmail.com",
    "notification_email": "amc@gmail.com",
    "password_hash": "AMCDE",
    "status": "Approved",
    "created_at": "2025-03-07T16:47:29.680506"
  },
  {
    "id": "5c144d9f-a1be-4d66-97c6-dcb978a26bb4",
    "company_name": "Compannyyy",
    "email": "company@company.com",
    "notification_email": "company@company.com",
    "password_hash": "COMPANY",
    "status": "Approved",
    "created_at": "2025-03-07T20:02:03.891065"
  },
  {
    "id": "0d4c60e2-56b4-49a3-bb0f-7d4c3378c641",
    "company_name": "Reliance",
    "email": "reliance@outlook.com",
    "notification_email": "reliance@outlook.com",
    "password_hash": "ABCXX",
    "status": "Approved",
    "created_at": "2025-03-10T08:40:36.54133"
  },
  {
    "id": "97afef35-53fd-4bc5-8f37-806a9a53c4cc",
    "company_name": "RANDOM",
    "email": "random@gmail.com",
    "notification_email": "random@gmail.com",
    "password_hash": "RANDOM",
    "status": "Approved",
    "created_at": "2025-03-10T09:23:43.308399"
  },
  {
    "id": "506dbd69-177a-4f0b-b210-ae9b7259d1da",
    "company_name": "Danish",
    "email": "danjaved007@gmail.com",
    "notification_email": "danjaved007@gmail.com",
    "password_hash": "DANISH",
    "status": "Approved",
    "created_at": "2025-03-10T09:51:09.384387"
  },
  {
    "id": "36a7d8c8-3230-40af-b2fe-87c8d911c8c5",
    "company_name": "ABCDE",
    "email": "abcde@gmail.com",
    "notification_email": "abcde@gmail.com",
    "password_hash": "ABCDE",
    "status": "Approved",
    "created_at": "2025-03-10T12:49:11.829208"
  }
];

const AdminDashboard = () => {
  const { setUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isSupplierListOpen, setIsSupplierListOpen] = useState(false);
  const [isMockData, setIsMockData] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchSuppliers = async () => {
    // Don't fetch if already loading
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setIsMockData(false);
    
    try {
      const webhookUrl = "https://danjavv.app.n8n.cloud/webhook/37825e51-69ed-4104-9def-af272b819973";
      
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      const formattedData = data.map((supplier: any) => ({
        ...supplier,
        status: supplier.status as 'Pending' | 'Approved' | 'Rejected'
      }));
      
      setSuppliers(formattedData);
      setIsSupplierListOpen(true);
      
      toast({
        title: "Suppliers loaded",
        description: `Successfully loaded ${formattedData.length} suppliers.`,
        variant: "default"
      });
      
    } catch (err: any) {
      console.error('Error fetching suppliers:', err);
      setSuppliers(defaultSuppliers);
      setIsMockData(true);
      setIsSupplierListOpen(true);
      setError('Could not connect to the supplier service. Showing default data instead.');
      toast({
        title: "Using default data",
        description: "Could not connect to the supplier service. Showing default data instead.",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    setUserRole(null);
    navigate('/auth');
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

  const openSupplierDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierDialogOpen(true);
  };

  const openDeleteConfirmation = (supplier: Supplier, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSupplier = () => {
    if (!supplierToDelete) return;
    
    setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierToDelete.id));
    
    toast({
      title: "Supplier deleted",
      description: `Supplier ${supplierToDelete.company_name} has been deleted successfully.`,
      variant: "destructive"
    });
    
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const goToBaselineConfig = () => {
    navigate('/admin-baseline-config');
  };

  const pendingSupplierCount = suppliers.filter(s => s.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-xl font-medium flex items-center">
              <span className="mr-1 text-2xl">●</span>
              <span className="font-semibold">Essence</span>
            </a>
            <span className="ml-4 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              Admin Dashboard
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Log out
            <LogOut className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full sm:w-[250px] pl-9"
            />
          </div>
        </div>
        
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
            onClick={fetchSuppliers}
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
            onClick={goToBaselineConfig}
          />
        </div>
      </main>

      {/* Supplier List Dialog */}
      <Dialog open={isSupplierListOpen} onOpenChange={setIsSupplierListOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Supplier Management
              {isMockData && <span className="ml-2 text-xs text-amber-500">(Sample Data)</span>}
            </DialogTitle>
            <DialogDescription>
              {isMockData 
                ? "Displaying sample data as the supplier service is currently unavailable"
                : "View and manage all registered suppliers"}
            </DialogDescription>
          </DialogHeader>
          
          <SupplierList
            suppliers={suppliers}
            isLoading={isLoading}
            error={error}
            isMockData={isMockData}
            onViewSupplier={openSupplierDetails}
            onDeleteSupplier={openDeleteConfirmation}
            onRetry={fetchSuppliers}
          />
          
          <DialogFooter className="flex items-center justify-between mt-4">
            {isMockData && (
              <p className="text-xs text-muted-foreground">
                Note: Actions on sample data will only be persisted for this session
              </p>
            )}
            <Button onClick={() => setIsSupplierListOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supplier Details Dialog */}
      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              {selectedSupplier ? `Review information for ${selectedSupplier.company_name}` : 'Supplier details'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSupplier && (
            <SupplierDetails
              supplier={selectedSupplier}
              onApprove={handleApproveSupplier}
              onReject={handleRejectSupplier}
              onDelete={() => {
                setIsSupplierDialogOpen(false);
                setSupplierToDelete(selectedSupplier);
                setIsDeleteDialogOpen(true);
              }}
              onClose={() => setIsSupplierDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          
          <DeleteConfirmation
            supplier={supplierToDelete}
            onConfirm={handleDeleteSupplier}
            onCancel={() => {
              setIsDeleteDialogOpen(false);
              setSupplierToDelete(null);
            }}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
