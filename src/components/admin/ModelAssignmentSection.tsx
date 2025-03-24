
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ModelAssignmentForm from './ModelAssignmentForm';
import { MoreHorizontal, Trash2, Database } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingAssignments, setExistingAssignments] = useState<ModelAssignment[]>([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchIngredients = async () => {
    setIsLoadingIngredients(true);
    try {
      // Fetch ingredients (detergents)
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('id, name')
        .order('name');
      
      if (ingredientsError) throw ingredientsError;
      
      setIngredients(ingredientsData || []);
      toast.success(`Loaded ${ingredientsData?.length || 0} detergents successfully`);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast.error('Failed to load detergents');
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      // Fetch models
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('id, name')
        .order('name');
      
      if (modelsError) throw modelsError;
      
      setModels(modelsData || []);
      toast.success(`Loaded ${modelsData?.length || 0} models successfully`);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to load models');
    } finally {
      setIsLoadingModels(false);
    }
  };

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      // Fetch existing assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('ingredient_models')
        .select('ingredient_id, model_id');
      
      if (assignmentsError) throw assignmentsError;
      
      setExistingAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
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
      toast.error('Please select both a detergent and a model');
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
      fetchAssignments(); // Refresh assignments data
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error('Failed to save model assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (ingredientId: string) => {
    if (!ingredientId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('ingredient_models')
        .delete()
        .eq('ingredient_id', ingredientId);
        
      if (error) throw error;
      
      toast.success('Assignment removed successfully');
      fetchAssignments(); // Refresh assignments data
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to remove assignment');
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
        <div className="flex space-x-4 mb-6">
          <Button 
            variant="outline"
            onClick={fetchIngredients}
            disabled={isLoadingIngredients}
            className="flex items-center"
          >
            <Database className="mr-2 h-4 w-4" />
            {isLoadingIngredients ? 'Loading Detergents...' : 'Load Detergents'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={fetchModels}
            disabled={isLoadingModels}
            className="flex items-center"
          >
            <Database className="mr-2 h-4 w-4" />
            {isLoadingModels ? 'Loading Models...' : 'Load Models'}
          </Button>
        </div>
        
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
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Existing Assignments</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Detergent</th>
                  <th className="text-left p-3 font-medium">Assigned Model</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {existingAssignments.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={3} className="p-4 text-center text-muted-foreground">
                      No assignments found
                    </td>
                  </tr>
                ) : (
                  existingAssignments.map((assignment) => {
                    const ingredient = ingredients.find(i => i.id === assignment.ingredient_id);
                    const model = models.find(m => m.id === assignment.model_id);
                    
                    return (
                      <tr key={assignment.ingredient_id} className="border-t">
                        <td className="p-3">{ingredient?.name || 'Unknown Detergent'}</td>
                        <td className="p-3">{model?.name || 'Unknown Model'}</td>
                        <td className="p-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(assignment.ingredient_id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Assignment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelAssignmentSection;
