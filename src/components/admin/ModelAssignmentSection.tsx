
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModelAssignmentForm from './ModelAssignmentForm';
import AssignmentActions from './AssignmentActions';
import AssignmentTable from './AssignmentTable';
import { useModelAssignments } from './useModelAssignments';

const ModelAssignmentSection = () => {
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
    handleDelete
  } = useModelAssignments();

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
