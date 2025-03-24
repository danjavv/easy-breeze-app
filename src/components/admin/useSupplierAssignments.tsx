import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Ingredient {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  company_name: string;
  email: string;
  status: string;
}

interface SupplierAssignment {
  supplier_id: string;
  ingredient_id: string;
  is_enabled: boolean;
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
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        setIngredients(data);
        toast.success(`Loaded ${data.length} detergents successfully`);
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
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, company_name, email, status')
        .order('company_name');
        
      if (error) throw error;
      
      if (data) {
        setSuppliers(data);
        toast.success(`Loaded ${data.length} suppliers successfully`);
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
      const { data, error } = await supabase
        .from('supplier_ingredients')
        .select('supplier_id, ingredient_id, is_enabled');
      
      if (error) throw error;
      
      setExistingAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (assignments: SupplierAssignment[]) => {
    if (!selectedIngredient) {
      toast.error('Please select a detergent');
      return;
    }

    setIsLoading(true);
    try {
      // Delete all existing assignments for this ingredient
      const { error: deleteError } = await supabase
        .from('supplier_ingredients')
        .delete()
        .eq('ingredient_id', selectedIngredient);
        
      if (deleteError) throw deleteError;
      
      // Insert new assignments
      if (assignments.length > 0) {
        const { error: insertError } = await supabase
          .from('supplier_ingredients')
          .insert(assignments);
          
        if (insertError) throw insertError;
      }

      // Send webhook with the assignments
      try {
        await fetch('https://danjaved008.app.n8n.cloud/webhook-test/1b1dafe1-a89b-4447-a11a-ee07327b6d0c', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            supplier_id: assignments[0]?.supplier_id,
            ingredient_id: selectedIngredient
          })
        });
      } catch (webhookError) {
        console.error('Error sending webhook:', webhookError);
        // Don't throw the error as the main operation was successful
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
    handleSave
  };
} 