
import { Button } from '@/components/ui/button';
import { Database, FileDown, Loader2 } from 'lucide-react';

interface AssignmentActionsProps {
  isLoadingIngredients: boolean;
  isLoadingModels: boolean;
  onLoadIngredients: () => Promise<void>;
  onLoadModels: () => Promise<void>;
}

const AssignmentActions: React.FC<AssignmentActionsProps> = ({ 
  isLoadingIngredients, 
  isLoadingModels, 
  onLoadIngredients, 
  onLoadModels 
}) => {
  return (
    <div className="flex space-x-4 mb-6">
      <Button 
        variant="outline"
        onClick={onLoadIngredients}
        disabled={isLoadingIngredients}
        className="flex items-center"
      >
        {isLoadingIngredients ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="mr-2 h-4 w-4" />
        )}
        {isLoadingIngredients ? 'Loading Detergents...' : 'Load Detergents'}
      </Button>
      
      <Button 
        variant="outline"
        onClick={onLoadModels}
        disabled={isLoadingModels}
        className="flex items-center"
      >
        {isLoadingModels ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Database className="mr-2 h-4 w-4" />
        )}
        {isLoadingModels ? 'Loading Models...' : 'Load Models'}
      </Button>
    </div>
  );
};

export default AssignmentActions;
