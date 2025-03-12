
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const DashboardTitle: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-3xl font-bold">Admin Control Panel</h1>
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full sm:w-[250px] pl-9"
        />
      </div>
    </div>
  );
};

export default DashboardTitle;
