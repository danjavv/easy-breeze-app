import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, LogIn } from 'lucide-react';

type RoleType = 'admin';

interface RoleSelectionProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

const RoleSelection = ({ onRegisterClick, onLoginClick }: RoleSelectionProps) => {
  const [role, setRole] = useState<RoleType>('admin');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserRole } = useAuth();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      setUserRole(role);
      
      toast({
        title: "Welcome!",
        description: `You're continuing as an admin.`,
      });
      
      navigate('/admin-dashboard');
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
          <h2 className="text-3xl font-bold">Welcome to SilentSource</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Select your role to continue
          </p>
        </div>

        <form onSubmit={handleContinue} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Continue as Admin'}
              <UserPlus className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={onLoginClick}
            >
              Sign in as existing supplier
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection;
