
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Package, Truck, BarChart } from 'lucide-react';

const SupplierDashboard = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in or not a supplier
    if (!loading && (!user || userRole !== 'supplier')) {
      navigate('/auth');
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

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
              Supplier Dashboard
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            Log out
            <LogOut className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, Supplier!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Package className="mr-2 h-5 w-5 text-primary" />
                Products
              </CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">12</p>
              <p className="text-sm text-muted-foreground">Active products</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline" className="w-full">Manage Products</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Truck className="mr-2 h-5 w-5 text-primary" />
                Orders
              </CardTitle>
              <CardDescription>Track and fulfill orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">5</p>
              <p className="text-sm text-muted-foreground">Pending orders</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline" className="w-full">View Orders</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Analytics
              </CardTitle>
              <CardDescription>Track performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">$2,450</p>
              <p className="text-sm text-muted-foreground">Monthly revenue</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline" className="w-full">View Reports</Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest supplier actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4 border-b pb-4 last:border-none">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {item}
                  </div>
                  <div>
                    <p className="font-medium">Order #{Math.floor(Math.random() * 1000) + 1000} was shipped</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() - Math.random() * 10000000).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SupplierDashboard;
