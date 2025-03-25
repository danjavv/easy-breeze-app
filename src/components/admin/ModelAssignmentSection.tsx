
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModelAssignmentForm from './ModelAssignmentForm';
import AssignmentActions from './AssignmentActions';
import AssignmentTable from './AssignmentTable';
import { useModelAssignments } from './useModelAssignments';
import { useData } from '@/contexts/DataContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ModelAssignmentSection = () => {
  const { models: contextModels, ingredients: contextIngredients, setModels: setContextModels, setIngredients: setContextIngredients } = useData();
  const [isInitialized, setIsInitialized] = useState(false);
  
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

  // Load data from context into the hook on initial render
  useEffect(() => {
    if (!isInitialized) {
      if (contextModels.length > 0) {
        console.log("Initializing models from context storage:", contextModels);
        console.log("First context model name:", contextModels[0]?.name || 'No name');
        setHookModels(contextModels);
      }
      
      if (contextIngredients.length > 0) {
        console.log("Initializing ingredients from context storage:", contextIngredients);
        console.log("First context ingredient name:", contextIngredients[0]?.name || 'No name');
        setHookIngredients(contextIngredients);
      }
      
      setIsInitialized(true);
    }
  }, [contextModels, contextIngredients, setHookModels, setHookIngredients, isInitialized]);

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
    if (models.length > 0 && isInitialized) {
      console.log("Syncing models back to context:", models);
      console.log("First model name to sync:", models[0]?.name || 'No name');
      setContextModels(models);
      toast.success("Models loaded and saved for future use");
    }
  }, [models, setContextModels, isInitialized]);

  // Log the values in the component for debugging
  useEffect(() => {
    console.log("Current ingredients in ModelAssignmentSection:", ingredients);
    console.log("Current models in ModelAssignmentSection:", models);
  }, [ingredients, models]);

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
