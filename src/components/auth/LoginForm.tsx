
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  onBack: () => void;
  onRegisterClick: () => void;
}

const LoginForm = ({ onBack, onRegisterClick }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserRole, setSupplierID } = useAuth();

  const notifyLoginAttempt = async (email: string) => {
    try {
      const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook-test/3f878768-29d0-43f6-a567-c5f127ff8855';
      
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'login_attempt',
          email,
          timestamp: new Date().toISOString()
        })
      });
      
      console.log("Login attempt notification sent to webhook");
    } catch (error) {
      console.error("Failed to send login notification:", error);
      // Non-critical, so we don't need to halt the login process
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!email.trim() || !password) {
        toast({
          title: "Missing information",
          description: "Please fill out all fields",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Send notification about login attempt
      await notifyLoginAttempt(email);
      
      // First, try to authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error("Authentication error:", authError);
        throw new Error(authError.message || "Authentication failed");
      }
      
      if (authData.user) {
        console.log("Authenticated with Supabase:", authData.user);
        
        // Now fetch supplier information
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('id, company_name, status')
          .eq('email', email)
          .single();
          
        if (supplierError && supplierError.code !== 'PGRST116') {
          console.error("Error fetching supplier:", supplierError);
          throw new Error("Could not verify supplier account");
        }
        
        if (supplierData) {
          setSupplierID(supplierData.id);
          console.log("Stored supplierid:", supplierData.id);
          
          setUserRole('supplier');
          
          toast({
            title: "Login successful",
            description: "Welcome back to SilentSource!",
          });
          
          navigate('/supplier-dashboard');
        } else {
          // Fallback to try the webhook approach if no supplier record is found
          try {
            const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook-test/3f878768-29d0-43f6-a567-c5f127ff8855';
            
            const response = await fetch(webhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password
              })
            });
            
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            
            const responseData = await response.json();
            console.log("Login response:", responseData);
            
            const data = Array.isArray(responseData) ? responseData[0] : responseData;
            
            if (data && data.supplierid) {
              setSupplierID(data.supplierid);
              console.log("Stored supplierid from webhook:", data.supplierid);
              
              setUserRole('supplier');
              
              toast({
                title: "Login successful",
                description: "Welcome back to SilentSource!",
              });
              
              navigate('/supplier-dashboard');
            } else {
              toast({
                title: "Login failed",
                description: "Invalid email or password",
                variant: "destructive"
              });
            }
          } catch (webhookError) {
            console.error("Webhook fallback error:", webhookError);
            throw new Error("Login service is currently unavailable");
          }
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred during login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <a href="/" className="text-xl font-medium flex items-center justify-center mb-6">
            <span className="mr-1 text-2xl">●</span>
            <span className="font-semibold">Essence</span>
          </a>
          <CardTitle className="text-2xl font-bold">Sign In to Your Account</CardTitle>
          <CardDescription>
            Access your SilentSource supplier dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="company@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Sign In'}
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            variant="ghost" 
            className="w-full text-sm" 
            onClick={onBack}
          >
            Back to dashboard selection
          </Button>
          <div className="text-center w-full">
            <Button 
              variant="link" 
              className="text-sm font-medium"
              onClick={onRegisterClick}
            >
              Don't have an account? Register
              <UserPlus className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
