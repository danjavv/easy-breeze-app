import { Button } from '@/components/ui/button';
import { Database, FileDown, Loader2 } from 'lucide-react';

interface AssignmentActionsProps {
  isLoadingIngredients: boolean;
  isLoadingSuppliers: boolean;
  onLoadIngredients: () => Promise<void>;
  onLoadSuppliers: () => Promise<void>;
}

const AssignmentActions: React.FC<AssignmentActionsProps> = ({ 
  isLoadingIngredients, 
  isLoadingSuppliers, 
  onLoadIngredients, 
  onLoadSuppliers 
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
        {isLoadingIngredients ? 'Loading Ingredients...' : 'Load Ingredients'}
      </Button>
      
      <Button 
        variant="outline"
        onClick={onLoadSuppliers}
        disabled={isLoadingSuppliers}
        className="flex items-center"
      >
        {isLoadingSuppliers ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Database className="mr-2 h-4 w-4" />
        )}
        {isLoadingSuppliers ? 'Loading Suppliers...' : 'Load Suppliers'}
      </Button>
    </div>
  );
};

export default AssignmentActions;
