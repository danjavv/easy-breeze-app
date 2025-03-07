
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, ShoppingBag, BarChart2, Settings, Search, Sliders } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminDashboard = () => {
  const { setUserRole } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUserRole(null);
    navigate('/auth');
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
              <p className="text-3xl font-semibold">24</p>
              <p className="text-sm text-muted-foreground">Active suppliers</p>
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
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Supplier Onboarding Status</CardTitle>
              <CardDescription>New supplier account approvals pending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start justify-between gap-4 border-b pb-4 last:border-none">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {String.fromCharCode(64 + item)}
                      </div>
                      <div>
                        <p className="font-medium">Supplier #{item}</p>
                        <p className="text-sm text-muted-foreground">
                          {['Pending review', 'Documents received', 'Awaiting final approval'][item - 1]}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="flex items-center">
                    <Sliders className="mr-2 h-4 w-4 text-primary" />
                    Baseline Config
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => navigate('/admin-baseline-config')}
                  >
                    Edit
                  </Button>
                </div>
                {['Platform Configuration', 'User Permissions', 'Notification Settings', 'Security Controls'].map((setting, index) => (
                  <div key={setting} className="flex items-center justify-between py-2 border-b last:border-none">
                    <span>{setting}</span>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
