import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, ShoppingBag, BarChart2, Settings, Search, Sliders, CheckCircle, XCircle, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Supplier {
  id: string;
  company_name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  notification_email?: string;
  password_hash?: string;
}

const AdminDashboard = () => {
  const { setUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://danjavv.app.n8n.cloud/webhook-test/37825e51-69ed-4104-9def-af272b819973');
      
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      
      const data = await response.json();
      console.log('Fetched data:', data); // Debug log
      
      // Handle different response formats
      if (Array.isArray(data)) {
        console.log('Setting array data:', data); // Debug log
        setSuppliers(data);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.suppliers)) {
          // If data has a suppliers array property
          console.log('Setting data.suppliers:', data.suppliers); // Debug log
          setSuppliers(data.suppliers);
        } else {
          // If it's just a single object, wrap it in an array
          console.log('Setting single object in array:', [data]); // Debug log
          setSuppliers([data]);
        }
      } else {
        console.log('No valid data found, setting empty array'); // Debug log
        setSuppliers([]);
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to load supplier data. Please try again.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load supplier data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSignOut = () => {
    setUserRole(null);
    navigate('/auth');
  };

  const handleApproveSupplier = (supplierId: string) => {
    toast({
      title: "Supplier approved",
      description: `Supplier ${suppliers.find(s => s.id === supplierId)?.company_name} has been approved successfully.`,
    });
    setIsReviewDialogOpen(false);
  };

  const handleRejectSupplier = (supplierId: string) => {
    toast({
      title: "Supplier rejected",
      description: `Supplier ${suppliers.find(s => s.id === supplierId)?.company_name} has been rejected.`,
      variant: "destructive"
    });
    setIsReviewDialogOpen(false);
  };

  const openSupplierDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsReviewDialogOpen(true);
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Suppliers
              </CardTitle>
              <CardDescription>Manage supplier accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{suppliers.length}</p>
              <p className="text-sm text-muted-foreground">Active suppliers</p>
              <p className="text-sm font-medium text-amber-500 mt-1">
                {suppliers.filter(s => s.status === 'Pending').length} Pending approval
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline" className="w-full">Manage Suppliers</Button>
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
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Supplier Onboarding Status</CardTitle>
                <CardDescription>New supplier account approvals pending</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchSuppliers}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="animate-spin h-8 w-8 text-primary" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                  <p className="text-destructive">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={fetchSuppliers}
                  >
                    Try Again
                  </Button>
                </div>
              ) : suppliers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No suppliers found
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openSupplierDetails(supplier);
                              }}
                            >
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              {selectedSupplier ? `Review application for ${selectedSupplier.company_name}` : 'Supplier details'}
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
                {selectedSupplier.status !== 'Pending' && (
                  <Button
                    onClick={() => setIsReviewDialogOpen(false)}
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
    </div>
  );
};

export default AdminDashboard;

