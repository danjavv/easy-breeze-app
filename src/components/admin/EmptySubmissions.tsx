
import React from 'react';
import { FileX, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptySubmissionsProps {
  isLoading: boolean;
  onRefresh: () => void;
}

const EmptySubmissions: React.FC<EmptySubmissionsProps> = ({ isLoading, onRefresh }) => {
  return (
    <div className="py-32 text-center">
      {isLoading ? (
        <div className="flex flex-col items-center">
          <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <FileX className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">No submissions found</p>
          <p className="text-muted-foreground">
            There are no supplier submissions in the system yet
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptySubmissions;
