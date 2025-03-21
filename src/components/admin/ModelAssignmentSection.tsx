
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Save } from 'lucide-react';

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

  const getIngredientName = (id: string) => {
    return ingredients.find(i => i.id === id)?.name || 'Unknown';
  };

  const getModelName = (id: string) => {
    return models.find(m => m.id === id)?.name || 'Unknown';
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">Assign Model to Detergent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ingredient-select">Select Detergent</Label>
              <Select 
                value={selectedIngredient} 
                onValueChange={setSelectedIngredient}
                disabled={isLoading}
              >
                <SelectTrigger id="ingredient-select" className="w-full">
                  <SelectValue placeholder="Select a detergent" />
                </SelectTrigger>
                <SelectContent>
                  {ingredients.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      {isLoading ? "Loading..." : "No detergents found"}
                    </div>
                  ) : (
                    ingredients.map((ingredient) => (
                      <SelectItem key={ingredient.id} value={ingredient.id}>
                        {ingredient.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model-select">Assign Model</Label>
              <Select 
                value={selectedModel} 
                onValueChange={setSelectedModel}
                disabled={isLoading || !selectedIngredient}
              >
                <SelectTrigger id="model-select" className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      {isLoading ? "Loading..." : "No models found"}
                    </div>
                  ) : (
                    models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {existingAssignments.length > 0 && (
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-2">Current Assignments</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detergent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Model
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {existingAssignments.map((assignment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getIngredientName(assignment.ingredient_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getModelName(assignment.model_id)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button onClick={handleSave} disabled={isLoading || !selectedIngredient || !selectedModel}>
              <Save className="mr-2 h-4 w-4" />
              Save Assignment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelAssignmentSection;
