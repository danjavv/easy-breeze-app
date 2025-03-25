
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Ingredient {
  id: string;
  name: string;
  purity?: number | null;
  detergency?: number | null;
  foaming?: number | null;
  biodegrability?: number | null;
}

export function useIngredientManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);

  const handleFetchIngredients = async () => {
    try {
      setIsLoadingIngredients(true);
      
      const { data, error } = await supabase
        .from('ingredients')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      console.log('Ingredients data:', data);
      
      const ingredientsArray = Array.isArray(data) ? data : [data];
      
      setIngredients(ingredientsArray);
      navigate('/admin-ingredient-models', { state: { ingredients: ingredientsArray } });
      
      toast({
        title: "Ingredients loaded",
        description: `Successfully loaded ${ingredientsArray.length} ingredients.`,
      });
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ingredients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  return {
    ingredients,
    isLoadingIngredients,
    handleFetchIngredients
  };
}
