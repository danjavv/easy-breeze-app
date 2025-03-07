
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type HeaderProps = {
  supplierName: string;
};

const SupplierHeader = ({ supplierName }: HeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/auth');
  };

  return (
    <>
      {/* Mobile header - only shown on small screens */}
      <div className="fixed top-0 left-0 right-0 h-14 border-b bg-card z-10 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center">
          <span className="mr-1 text-xl">●</span>
          <span className="font-semibold">SilentSource</span>
        </div>
        <Button variant="outline" size="icon" onClick={() => {/* Toggle mobile menu */}}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Header */}
      <header className="bg-card border-b p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between sticky top-0 z-10 md:border-none">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="relative">
            <button className="inline-flex items-center justify-between rounded-md border border-input px-3 py-2 text-sm font-medium bg-background hover:bg-accent">
              <span className="text-muted-foreground mr-1">Supplier:</span> 
              <span>{supplierName}</span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </button>
          </div>
        </div>
        
        <div className="hidden md:flex items-center">
          <Button size="sm" variant="outline" onClick={handleSignOut} className="ml-2">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>
    </>
  );
};

export default SupplierHeader;
