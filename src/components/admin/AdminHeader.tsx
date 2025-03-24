import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  user: {
    email: string;
  } | null;
  onSignOut: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onSignOut }) => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Easy Breeze Admin</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
          )}
          <Button variant="outline" onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
