
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
    <div className="w-64 border-r bg-gradient-to-b from-card to-background hidden md:block">
      <div className="p-6 flex items-center justify-center">
        <span className="mr-1 text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">●</span>
        <span className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">SilentSource</span>
      </div>
      
      <div className="p-3">
        <nav className="space-y-2">
          <button 
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${activeItem === 'submissions' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            onClick={() => setActiveItem('submissions')}
          >
            <FileText className="h-5 w-5" />
            <span>My Submissions</span>
          </button>
          
          <button 
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${activeItem === 'new' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            onClick={() => setActiveItem('new')}
          >
            <FilePlus className="h-5 w-5" />
            <span>New Submission</span>
          </button>
          
          <button 
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${activeItem === 'templates' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            onClick={() => setActiveItem('templates')}
          >
            <FileCode className="h-5 w-5" />
            <span>Templates</span>
          </button>
          
          <button 
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${activeItem === 'account' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
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
          className="w-full justify-start transition-all duration-300 border-dashed hover:border-solid hover:bg-red-50 hover:text-red-600 hover:border-red-200"
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
