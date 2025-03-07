import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';

const Auth = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'supplier' | 'admin'>('supplier');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [isSameEmail, setIsSameEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserRole } = useAuth();

  const handleSameEmailChange = (checked: boolean) => {
    setIsSameEmail(checked);
    if (checked) {
      setNotificationEmail(email);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (isSameEmail) {
      setNotificationEmail(newEmail);
    }
  };

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
      
      if (role === 'supplier') {
        setIsRegistering(true);
      } else {
        setUserRole(role);
        
        toast({
          title: "Welcome!",
          description: `Hello ${name}, you're continuing as an admin.`,
        });
        
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!companyName.trim() || !email.trim() || !notificationEmail.trim() || !password || !confirmPassword) {
        toast({
          title: "Missing information",
          description: "Please fill out all fields",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: "Password mismatch",
          description: "Passwords do not match",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      setUserRole('supplier');
      
      toast({
        title: "Registration successful!",
        description: `Welcome ${companyName}, your supplier account has been created.`,
      });
      
      navigate('/supplier-dashboard');
    } catch (error: any) {
      toast({
        title: "Registration error",
        description: error.message || "An unexpected error occurred during registration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelection = () => {
    setIsRegistering(false);
  };

  if (isRegistering) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <a href="/" className="text-xl font-medium flex items-center justify-center mb-6">
              <span className="mr-1 text-2xl">●</span>
              <span className="font-semibold">Essence</span>
            </a>
            <CardTitle className="text-2xl font-bold">Create Supplier Account</CardTitle>
            <CardDescription>
              Register your company with SilentSource
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (Login)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="company@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notificationEmail">Notification Email</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sameEmail" 
                      checked={isSameEmail} 
                      onCheckedChange={handleSameEmailChange} 
                    />
                    <Label 
                      htmlFor="sameEmail" 
                      className="text-sm cursor-pointer"
                    >
                      Same as login email
                    </Label>
                  </div>
                </div>
                <Input
                  id="notificationEmail"
                  type="email"
                  placeholder="notifications@example.com"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  disabled={isSameEmail}
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Register'}
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="ghost" 
              className="w-full text-sm" 
              onClick={handleBackToSelection}
            >
              Back to dashboard selection
            </Button>
            <div className="text-center w-full">
              <Button 
                variant="link" 
                className="text-sm font-medium"
                onClick={() => {
                  toast({
                    title: "Login",
                    description: "Login functionality would be implemented here",
                  });
                }}
              >
                Already have an account? Log in
                <LogIn className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
