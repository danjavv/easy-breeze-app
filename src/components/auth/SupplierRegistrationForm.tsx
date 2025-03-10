import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';

interface SupplierRegistrationFormProps {
  onBack: () => void;
  onLoginClick: () => void;
}

const SupplierRegistrationForm = ({ onBack, onLoginClick }: SupplierRegistrationFormProps) => {
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
      
      const webhookUrl = 'https://danjavv.app.n8n.cloud/webhook/59f900d2-b5fe-4c3f-bde6-6e1d2bb061d5';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: companyName,
          email: email,
          notification_email: notificationEmail,
          password: password
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit registration');
      }
      
      setUserRole('supplier');
      
      toast({
        title: "Registration submitted",
        description: "Your registration has been submitted for approval. You'll be notified once it's reviewed.",
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
            onClick={onBack}
          >
            Back to dashboard selection
          </Button>
          <div className="text-center w-full">
            <Button 
              variant="link" 
              className="text-sm font-medium"
              onClick={onLoginClick}
            >
              Already have an account? Log in
              <LogIn className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupplierRegistrationForm;
