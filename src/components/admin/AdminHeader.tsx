
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AdminHeaderProps {
  onSignOut: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onSignOut }) => {
  return (
    <header className="bg-background border-b border-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-xl font-medium flex items-center group">
            <span className="mr-1 text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text group-hover:from-purple-500 group-hover:to-indigo-500 transition-all duration-500">●</span>
            <span className="font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Essence</span>
          </a>
          <span className="ml-4 px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs rounded-full font-medium border border-indigo-100">
            Admin Dashboard
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSignOut}
          className="transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          Log out
          <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
