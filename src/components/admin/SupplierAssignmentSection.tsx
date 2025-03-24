import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SupplierAssignmentForm from './SupplierAssignmentForm';
import AssignmentActions from './AssignmentActions';
import AssignmentTable from './AssignmentTable';
import { useSupplierAssignments } from './useSupplierAssignments';
import { useData } from '@/contexts/DataContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const SupplierAssignmentSection = () => {
  const { suppliers: contextSuppliers, ingredients: contextIngredients, setSuppliers: setContextSuppliers, setIngredients: setContextIngredients } = useData();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    ingredients,
    suppliers,
    selectedIngredient,
    setSelectedIngredient,
    isLoadingIngredients,
    isLoadingSuppliers,
    isLoading,
    existingAssignments,
    fetchIngredients,
    fetchSuppliers,
    handleSave,
    handleDelete,
    setSuppliers: setHookSuppliers,
    setIngredients: setHookIngredients
  } = useSupplierAssignments();

  // Load data from context into the hook on initial render
  useEffect(() => {
    if (!isInitialized) {
      if (contextSuppliers.length > 0) {
        console.log("Initializing suppliers from context storage:", contextSuppliers);
        console.log("First context supplier name:", contextSuppliers[0]?.name || 'No name');
        setHookSuppliers(contextSuppliers);
      }
      
      if (contextIngredients.length > 0) {
        console.log("Initializing ingredients from context storage:", contextIngredients);
        console.log("First context ingredient name:", contextIngredients[0]?.name || 'No name');
        setHookIngredients(contextIngredients);
      }
      
      setIsInitialized(true);
    }
  }, [contextSuppliers, contextIngredients, setHookSuppliers, setHookIngredients, isInitialized]);

  // Sync hook data back to context when changed through fetching
  useEffect(() => {
    if (ingredients.length > 0 && isInitialized) {
      console.log("Syncing ingredients back to context:", ingredients);
      console.log("First ingredient name to sync:", ingredients[0]?.name || 'No name');
      setContextIngredients(ingredients);
      toast.success("Detergents loaded and saved for future use");
    }
  }, [ingredients, setContextIngredients, isInitialized]);

  useEffect(() => {
    if (suppliers.length > 0 && isInitialized) {
      console.log("Syncing suppliers back to context:", suppliers);
      console.log("First supplier name to sync:", suppliers[0]?.name || 'No name');
      setContextSuppliers(suppliers);
      toast.success("Suppliers loaded and saved for future use");
    }
  }, [suppliers, setContextSuppliers, isInitialized]);

  // Log the values in the component for debugging
  useEffect(() => {
    console.log("Current ingredients in SupplierAssignmentSection:", ingredients);
    console.log("Current suppliers in SupplierAssignmentSection:", suppliers);
  }, [ingredients, suppliers]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">Assign Supplier to Detergent</CardTitle>
      </CardHeader>
      <CardContent>
        <AssignmentActions
          isLoadingIngredients={isLoadingIngredients}
          isLoadingModels={isLoadingSuppliers}
          onLoadIngredients={fetchIngredients}
          onLoadModels={fetchSuppliers}
        />
        
        <SupplierAssignmentForm 
          ingredients={ingredients}
          suppliers={suppliers}
          selectedIngredient={selectedIngredient}
          isLoading={isLoading}
          onIngredientChange={setSelectedIngredient}
          onSave={handleSave}
        />
        
        <AssignmentTable
          ingredients={ingredients}
          models={suppliers}
          existingAssignments={existingAssignments}
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};

export default SupplierAssignmentSection; 