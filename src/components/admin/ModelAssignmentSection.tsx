
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModelAssignmentForm from './ModelAssignmentForm';
import AssignmentActions from './AssignmentActions';
import AssignmentTable from './AssignmentTable';
import { useModelAssignments } from './useModelAssignments';
import { useData } from '@/contexts/DataContext';
import { useEffect } from 'react';

const ModelAssignmentSection = () => {
  const { models: contextModels, ingredients: contextIngredients } = useData();
  
  const {
    ingredients,
    models,
    selectedIngredient,
    setSelectedIngredient,
    selectedModel,
    setSelectedModel,
    isLoadingIngredients,
    isLoadingModels,
    isLoading,
    existingAssignments,
    fetchIngredients,
    fetchModels,
    handleSave,
    handleDelete,
    setModels: setHookModels,
    setIngredients: setHookIngredients
  } = useModelAssignments();

  // Use data from context if available
  useEffect(() => {
    if (contextModels.length > 0) {
      console.log("Using models from context:", contextModels);
      setHookModels(contextModels);
    }
    
    if (contextIngredients.length > 0) {
      console.log("Using ingredients from context:", contextIngredients);
      setHookIngredients(contextIngredients);
    }
  }, [contextModels, contextIngredients, setHookModels, setHookIngredients]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">Assign Model to Detergent</CardTitle>
      </CardHeader>
      <CardContent>
        <AssignmentActions
          isLoadingIngredients={isLoadingIngredients}
          isLoadingModels={isLoadingModels}
          onLoadIngredients={fetchIngredients}
          onLoadModels={fetchModels}
        />
        
        <ModelAssignmentForm 
          ingredients={ingredients}
          models={models}
          selectedIngredient={selectedIngredient}
          selectedModel={selectedModel}
          isLoading={isLoading}
          onIngredientChange={setSelectedIngredient}
          onModelChange={setSelectedModel}
          onSave={handleSave}
        />
        
        <AssignmentTable
          ingredients={ingredients}
          models={models}
          existingAssignments={existingAssignments}
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};

export default ModelAssignmentSection;
