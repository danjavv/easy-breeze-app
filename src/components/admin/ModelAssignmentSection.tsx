
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ModelAssignmentForm from './ModelAssignmentForm';
import AssignmentsTable from './AssignmentsTable';

interface Model {
  id: string;
  name: string;
}

interface Ingredient {
  id: string;
  name: string;
}

interface ModelAssignment {
  ingredient_id: string;
  model_id: string;
}

const ModelAssignmentSection = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingAssignments, setExistingAssignments] = useState<ModelAssignment[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('id, name')
        .order('name');
      
      if (ingredientsError) throw ingredientsError;
      
      // Fetch models
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('id, name')
        .order('name');
      
      if (modelsError) throw modelsError;
      
      // Fetch existing assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('ingredient_models')
        .select('ingredient_id, model_id');
      
      if (assignmentsError) throw assignmentsError;
      
      setIngredients(ingredientsData || []);
      setModels(modelsData || []);
      setExistingAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // When ingredient selection changes, check if there's an existing model assignment
    if (selectedIngredient) {
      const assignment = existingAssignments.find(
        a => a.ingredient_id === selectedIngredient
      );
      
      if (assignment) {
        setSelectedModel(assignment.model_id);
      } else {
        setSelectedModel('');
      }
    }
  }, [selectedIngredient, existingAssignments]);

  const handleSave = async () => {
    if (!selectedIngredient || !selectedModel) {
      toast.error('Please select both an ingredient and a model');
      return;
    }

    setIsLoading(true);
    try {
      // Check if assignment already exists
      const existingAssignment = existingAssignments.find(
        a => a.ingredient_id === selectedIngredient
      );

      let result;
      
      if (existingAssignment) {
        // Update existing assignment
        result = await supabase
          .from('ingredient_models')
          .update({ model_id: selectedModel })
          .eq('ingredient_id', selectedIngredient);
      } else {
        // Create new assignment
        result = await supabase
          .from('ingredient_models')
          .insert({
            ingredient_id: selectedIngredient,
            model_id: selectedModel
          });
      }

      if (result.error) throw result.error;

      toast.success('Model assignment saved successfully');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error('Failed to save model assignment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">Assign Model to Detergent</CardTitle>
      </CardHeader>
      <CardContent>
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
        
        <AssignmentsTable 
          assignments={existingAssignments}
          ingredients={ingredients}
          models={models}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default ModelAssignmentSection;
