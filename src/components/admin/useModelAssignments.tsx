
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchFromWebhook } from '@/utils/webhookUtils';
import { logSupabaseResponse } from '@/utils/debugUtils';

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

export function useModelAssignments() {
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

  const fetchIngredients = async () => {
    setIsLoadingIngredients(true);
    try {
      console.log('Fetching ingredients from webhook...');
      
      // Call the webhook to get detergent data
      const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook-test/b65a9a50-5a55-462a-a29b-7f6572aa2dcc';
      const webhookData = await fetchFromWebhook(webhookUrl);
      
      console.log('Webhook data received:', webhookData);
      
      // Process the webhook response (assuming it returns an array of ingredients)
      if (webhookData && Array.isArray(webhookData) && webhookData.length > 0) {
        const formattedIngredients = webhookData.map((item: any) => ({
          id: item.id || `ingredient-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name || 'Unknown Ingredient'
        }));
        
        setIngredients(formattedIngredients);
        toast.success(`Loaded ${formattedIngredients.length} detergents from webhook successfully`);
        
        // After getting data from webhook, also save to Supabase
        for (const ingredient of formattedIngredients) {
          const { error } = await supabase
            .from('ingredients')
            .upsert({ id: ingredient.id, name: ingredient.name }, { onConflict: 'id' });
          
          if (error) {
            console.error('Error saving ingredient to Supabase:', error);
          }
        }
      } else {
        // If webhook fails to return proper data, fall back to Supabase
        console.log('No valid webhook data, falling back to Supabase...');
        await fetchIngredientsFromDatabase();
      }
    } catch (error) {
      console.error('Error with webhook, falling back to Supabase:', error);
      // Fall back to database if webhook fails
      await fetchIngredientsFromDatabase();
    } finally {
      setIsLoadingIngredients(false);
    }
  };
  
  const fetchIngredientsFromDatabase = async () => {
    try {
      console.log('Fetching ingredients from Supabase...');
      
      // Fetch ingredients (detergents) from the ingredients table
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('id, name')
        .order('name');
      
      logSupabaseResponse('fetch ingredients', ingredientsData, ingredientsError);
      
      if (ingredientsError) {
        console.error('Supabase error:', ingredientsError);
        throw ingredientsError;
      }
      
      console.log('Ingredients data received:', ingredientsData);
      
      if (ingredientsData && ingredientsData.length > 0) {
        setIngredients(ingredientsData);
        toast.success(`Loaded ${ingredientsData.length} detergents from database successfully`);
      } else {
        console.log('No ingredients data found');
        toast.info('No detergents found in the database');
        setIngredients([]);
      }
    } catch (error) {
      console.error('Error fetching ingredients from database:', error);
      toast.error('Failed to load detergents from database');
    }
  };

  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      console.log('Fetching models from Supabase...');
      // Fetch models
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('id, name')
        .order('name');
      
      logSupabaseResponse('fetch models', modelsData, modelsError);
      
      if (modelsError) {
        console.error('Supabase error:', modelsError);
        throw modelsError;
      }
      
      console.log('Models data received:', modelsData);
      
      if (modelsData && modelsData.length > 0) {
        setModels(modelsData);
        toast.success(`Loaded ${modelsData.length} models successfully`);
      } else {
        console.log('No models data found');
        toast.info('No models found in the database');
        setModels([]);
      }
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
      
      logSupabaseResponse('fetch assignments', assignmentsData, assignmentsError);
      
      if (assignmentsError) throw assignmentsError;
      
      setExistingAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

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

  return {
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
  };
}
