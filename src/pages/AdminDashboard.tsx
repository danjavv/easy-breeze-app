
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, ShoppingBag, BarChart2, Settings, Search, Sliders, CheckCircle, XCircle, RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Supplier {
  id: string;
  company_name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  notification_email?: string;
  password_hash?: string;
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    company_name: "Eco Ingredients Co.",
    email: "contact@ecoingredients.com",
    status: "Pending",
    created_at: "2025-03-01T10:30:00Z"
  },
  {
    id: "2",
    company_name: "Natural Extracts Ltd.",
    email: "info@naturalextracts.com",
    status: "Approved",
    created_at: "2025-02-15T09:15:00Z"
  },
  {
    id: "3",
    company_name: "Pure Botanicals Inc.",
    email: "sales@purebotanicals.com",
    status: "Rejected",
    created_at: "2025-02-28T14:45:00Z"
  },
  {
    id: "4",
    company_name: "Organic Essentials",
    email: "support@organicessen.com",
    status: "Pending",
    created_at: "2025-03-05T11:20:00Z"
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
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

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
      
      const newAttempts = loadAttempts + 1;
      setLoadAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        console.log('Falling back to mock data after failed attempts');
        setSuppliers(mockSuppliers);
        setIsMockData(true);
        setIsSupplierListOpen(true);
        setError('Could not connect to the supplier service. Showing sample data instead.');
        toast({
          title: "Using sample data",
          description: "Could not connect to the supplier service. Showing sample data instead.",
          variant: "default"
        });
      } else {
        setError(`Failed to load supplier data: ${err.message || 'Unknown error'}. Attempt ${newAttempts}/3`);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load supplier data. Attempt ${newAttempts}/3. Retrying...`,
        });
        
        setTimeout(() => {
          fetchSuppliers();
        }, 2000);
      }
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm') + ' UTC';
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="warning" className="flex items-center">
          <AlertTriangle className="mr-1 h-3 w-3" /> {status}
        </Badge>;
      case 'Approved':
        return <Badge variant="success" className="flex items-center">
          <CheckCircle className="mr-1 h-3 w-3" /> {status}
        </Badge>;
      case 'Rejected':
        return <Badge variant="danger" className="flex items-center">
          <XCircle className="mr-1 h-3 w-3" /> {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Suppliers
              </CardTitle>
              <CardDescription>Manage supplier accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{suppliers.length || 0}</p>
              <p className="text-sm text-muted-foreground">Active suppliers</p>
              <p className="text-sm font-medium text-amber-500 mt-1">
                {pendingSupplierCount || 0} Pending approval
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={fetchSuppliers}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Suppliers
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                Product Catalog
              </CardTitle>
              <CardDescription>Oversee all products</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">128</p>
              <p className="text-sm text-muted-foreground">Total products</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline" className="w-full">View Catalog</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                Platform Analytics
              </CardTitle>
              <CardDescription>System performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">$12,450</p>
              <p className="text-sm text-muted-foreground">Monthly revenue</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline" className="w-full">View Analytics</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Sliders className="mr-2 h-5 w-5 text-primary" />
                Baseline Config
              </CardTitle>
              <CardDescription>Set ingredient standards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">4</p>
              <p className="text-sm text-muted-foreground">Ingredient parameters</p>
            </CardContent>
            <CardFooter>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={goToBaselineConfig}
              >
                Configure Baseline
              </Button>
            </CardFooter>
          </Card>
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
          
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-8 space-y-4">
              <RefreshCw className="animate-spin h-8 w-8 text-primary" />
              <p className="text-muted-foreground">Fetching supplier data...</p>
              <p className="text-xs text-muted-foreground">Attempt {loadAttempts + 1}/3</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setLoadAttempts(0);
                  fetchSuppliers();
                }}
              >
                Try Again
              </Button>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No suppliers found
            </div>
          ) : (
            <div className="rounded-md border flex-1 overflow-hidden">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background shadow-sm z-10">
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow 
                        key={supplier.id || Math.random().toString()}
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => openSupplierDetails(supplier)}
                      >
                        <TableCell className="font-medium">{supplier.company_name}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                        <TableCell>{formatDate(supplier.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openSupplierDetails(supplier);
                              }}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => openDeleteConfirmation(supplier, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
          
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
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Supplier Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Company Name:</span>
                    <span>{selectedSupplier.company_name}</span>
                    
                    <span className="text-muted-foreground">Email:</span>
                    <span>{selectedSupplier.email}</span>
                    
                    {selectedSupplier.notification_email && (
                      <>
                        <span className="text-muted-foreground">Notification Email:</span>
                        <span>{selectedSupplier.notification_email}</span>
                      </>
                    )}
                    
                    <span className="text-muted-foreground">Current Status:</span>
                    <span>{getStatusBadge(selectedSupplier.status)}</span>

                    <span className="text-muted-foreground">Created At:</span>
                    <span>{formatDate(selectedSupplier.created_at)}</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {selectedSupplier.status === 'Pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectSupplier(selectedSupplier.id)}
                      className="w-full sm:w-auto flex items-center"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApproveSupplier(selectedSupplier.id)}
                      className="w-full sm:w-auto flex items-center"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsSupplierDialogOpen(false);
                    setSupplierToDelete(selectedSupplier);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="w-full sm:w-auto flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                {selectedSupplier.status !== 'Pending' && (
                  <Button
                    onClick={() => setIsSupplierDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the supplier account for{" "}
              <span className="font-semibold">{supplierToDelete?.company_name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSupplierToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSupplier}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
