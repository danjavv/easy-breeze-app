import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Ingredient {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface SupplierAssignment {
  ingredient_id: string;
  supplier_id: string;
}

export function useSupplierAssignments() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingAssignments, setExistingAssignments] = useState<SupplierAssignment[]>([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchIngredients = async () => {
    setIsLoadingIngredients(true);
    try {
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('id, name')
        .order('name');

      if (ingredientsError) throw ingredientsError;

      if (ingredientsData && ingredientsData.length > 0) {
        setIngredients(ingredientsData);
        toast.success(`Loaded ${ingredientsData.length} detergents successfully`);
      } else {
        toast.info('No detergents found');
        setIngredients([]);
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast.error('Failed to load detergents');
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const fetchSuppliers = async () => {
    setIsLoadingSuppliers(true);
    try {
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('id, name')
        .order('name');

      if (suppliersError) throw suppliersError;

      if (suppliersData && suppliersData.length > 0) {
        setSuppliers(suppliersData);
        toast.success(`Loaded ${suppliersData.length} suppliers successfully`);
      } else {
        toast.info('No suppliers found');
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('supplier_ingredients')
        .select('ingredient_id, supplier_id');
      
      if (assignmentsError) throw assignmentsError;
      
      setExistingAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (assignments: SupplierAssignment[]) => {
    if (!selectedIngredient) return;
    
    setIsLoading(true);
    try {
      // First, delete existing assignments for this ingredient
      const { error: deleteError } = await supabase
        .from('supplier_ingredients')
        .delete()
        .eq('ingredient_id', selectedIngredient);
        
      if (deleteError) throw deleteError;
      
      // Then, insert new assignments
      if (assignments.length > 0) {
        const { error: insertError } = await supabase
          .from('supplier_ingredients')
          .insert(assignments);
          
        if (insertError) throw insertError;
      }
      
      // Send webhook notification
      try {
        const response = await fetch('https://danjaved008.app.n8n.cloud/webhook/1b1dafe1-a89b-4447-a11a-ee07327b6d0c', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            supplier_id: assignments[0]?.supplier_id,
            ingredient_id: selectedIngredient
          }),
        });

        if (!response.ok) {
          console.error('Webhook notification failed:', response.statusText);
        }
      } catch (webhookError) {
        console.error('Error sending webhook notification:', webhookError);
      }
      
      toast.success('Supplier assignments saved successfully');
      fetchAssignments(); // Refresh assignments data
    } catch (error) {
      console.error('Error saving assignments:', error);
      toast.error('Failed to save supplier assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (ingredientId: string) => {
    if (!ingredientId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('supplier_ingredients')
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
    setSuppliers,
    setIngredients
  };
} 