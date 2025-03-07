
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type DashboardHeaderProps = {
  activePeriod: string;
  deadline: string;
};

const DashboardHeader = ({ activePeriod, deadline }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
        <div className="flex items-center mt-2">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
            Active Period: {activePeriod}
          </div>
          <div className="ml-3 text-sm text-muted-foreground">
            Deadline: {deadline}
          </div>
        </div>
      </div>
      
      <Button 
        size="default" 
        className="mt-4 md:mt-0"
        onClick={() => navigate('/new-submission')}
      >
        <FilePlus className="mr-2 h-4 w-4" />
        New Submission
      </Button>
    </div>
  );
};

export default DashboardHeader;
