
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AdminHeaderProps {
  onSignOut: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onSignOut }) => {
  return (
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
        <Button variant="outline" size="sm" onClick={onSignOut}>
          Log out
          <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
