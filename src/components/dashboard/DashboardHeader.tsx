
import { Button } from '@/components/ui/button';
import { FilePlus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type DashboardHeaderProps = {
  activePeriod: string;
  deadline: string;
};

const DashboardHeader = ({ activePeriod, deadline }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-border/30">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Supplier Dashboard</h1>
        <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-2 sm:gap-4">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium border border-primary/10">
            Active Period: {activePeriod}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Deadline: {deadline}
          </div>
        </div>
      </div>
      
      <Button 
        size="default" 
        className="mt-4 md:mt-0 shadow-sm transition-all duration-300 hover:shadow-md"
        onClick={() => navigate('/new-submission')}
      >
        <FilePlus className="mr-2 h-4 w-4" />
        New Submission
      </Button>
    </div>
  );
};

export default DashboardHeader;
