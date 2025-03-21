
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface SubmissionsHeaderProps {
  fromWebhook: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

const SubmissionsHeader: React.FC<SubmissionsHeaderProps> = ({ 
  fromWebhook, 
  isLoading, 
  onRefresh 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={() => navigate('/admin-dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">All Submissions</h1>
        <p className="text-muted-foreground">
          {fromWebhook 
            ? "Submissions data from external webhook" 
            : "View and manage all supplier submissions"}
        </p>
      </div>
      
      <Button 
        variant="outline"
        onClick={onRefresh}
        disabled={isLoading}
      >
        {isLoading ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Refresh {fromWebhook ? "from Webhook" : ""}
      </Button>
    </div>
  );
};

export default SubmissionsHeader;
