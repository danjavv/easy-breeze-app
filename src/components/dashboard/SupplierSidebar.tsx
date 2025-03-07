
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FilePlus, 
  FileCode, 
  User, 
  LogOut 
} from 'lucide-react';

type SidebarProps = {
  activeItem: string;
  setActiveItem: (item: string) => void;
};

const SupplierSidebar = ({ activeItem, setActiveItem }: SidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/auth');
  };

  return (
    <div className="w-64 border-r bg-card hidden md:block">
      <div className="p-4 flex items-center justify-center">
        <span className="mr-1 text-2xl">●</span>
        <span className="text-xl font-semibold">SilentSource</span>
      </div>
      
      <div className="p-2">
        <nav className="space-y-1">
          <button 
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeItem === 'submissions' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            onClick={() => setActiveItem('submissions')}
          >
            <FileText className="h-5 w-5" />
            <span>My Submissions</span>
          </button>
          
          <button 
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeItem === 'new' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            onClick={() => setActiveItem('new')}
          >
            <FilePlus className="h-5 w-5" />
            <span>New Submission</span>
          </button>
          
          <button 
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeItem === 'templates' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            onClick={() => setActiveItem('templates')}
          >
            <FileCode className="h-5 w-5" />
            <span>Templates</span>
          </button>
          
          <button 
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeItem === 'account' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            onClick={() => setActiveItem('account')}
          >
            <User className="h-5 w-5" />
            <span>Account</span>
          </button>
        </nav>
      </div>
      
      <div className="absolute bottom-8 left-0 w-64 p-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default SupplierSidebar;
