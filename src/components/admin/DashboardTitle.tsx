
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const DashboardTitle: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-border/30 gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Admin Control Panel</h1>
        <p className="text-muted-foreground mt-1">Manage all system operations from a single location</p>
      </div>
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full sm:w-[250px] pl-9 transition-all duration-300 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
        />
      </div>
    </div>
  );
};

export default DashboardTitle;
