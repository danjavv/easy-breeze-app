
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'supplier' | 'admin'>('supplier');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserRole } = useAuth();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!name.trim()) {
        toast({
          title: "Name required",
          description: "Please enter your name to continue",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Set the user role
      setUserRole(role);
      
      toast({
        title: "Welcome!",
        description: `Hello ${name}, you're continuing as a ${role}.`,
      });
      
      // Navigate to the appropriate dashboard
      if (role === 'supplier') {
        navigate('/supplier-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <a href="/" className="text-xl font-medium flex items-center justify-center mb-6">
            <span className="mr-1 text-2xl">●</span>
            <span className="font-semibold">Essence</span>
          </a>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Welcome to SilentSource
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your name and select a dashboard to continue
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-6 mt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label>Dashboard Type</Label>
            <RadioGroup 
              defaultValue="supplier" 
              value={role} 
              onValueChange={(value) => setRole(value as 'supplier' | 'admin')} 
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supplier" id="supplier" />
                <Label htmlFor="supplier" className="cursor-pointer">Supplier Dashboard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="cursor-pointer">Admin Dashboard</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Processing...' : `Continue to ${role} dashboard`}
            <UserPlus className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
