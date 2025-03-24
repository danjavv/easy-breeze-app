import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logSupabaseResponse } from '@/utils/debugUtils';

interface Ingredient {
  id: string;
  name: string;
  detergency?: number | null;
  foaming?: number | null;
  biodegradability?: number | null;
  purity?: number | null;
  created_at?: string;
}

interface Supplier {
  id: string;
  company_name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

interface SupplierAssignment {
  ingredientId: string;
  supplierId: string;
}

export function useSupplierAssignments() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignments, setAssignments] = useState<SupplierAssignment[]>([]);

  useEffect(() => {
    // When ingredient selection changes, check if there's an existing supplier assignment
    if (selectedIngredient) {
      const assignment = assignments.find(a => a.ingredientId === selectedIngredient);
      if (assignment) {
        setSelectedSupplier(assignment.supplierId);
      } else {
        setSelectedSupplier('');
      }
    }
  }, [selectedIngredient, assignments]);

  const fetchIngredients = async () => {
    setIsLoadingIngredients(true);
    try {
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');
      
      logSupabaseResponse('fetch ingredients', ingredientsData, ingredientsError);
      
      if (ingredientsError) throw ingredientsError;
      
      if (ingredientsData && ingredientsData.length > 0) {
        setIngredients(ingredientsData);
        toast.success(`Loaded ${ingredientsData.length} ingredients from database successfully`);
      } else {
        toast.info('No ingredients found in the database');
        setIngredients([]);
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast.error('Failed to load ingredients from database');
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const fetchSuppliers = async () => {
    setIsLoadingSuppliers(true);
    try {
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('status', 'Approved')
        .order('company_name');
      
      logSupabaseResponse('fetch suppliers', suppliersData, suppliersError);
      
      if (suppliersError) throw suppliersError;
      
      if (suppliersData && suppliersData.length > 0) {
        setSuppliers(suppliersData);
        toast.success(`Loaded ${suppliersData.length} suppliers from database successfully`);
      } else {
        toast.info('No approved suppliers found in the database');
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers from database');
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  const handleSave = async () => {
    if (!selectedIngredient || !selectedSupplier) {
      toast.error('Please select both an ingredient and a supplier');
      return;
    }

    setIsLoading(true);
    try {
      // Update assignments in local state
      setAssignments(prevAssignments => {
        const existingIndex = prevAssignments.findIndex(a => a.ingredientId === selectedIngredient);
        if (existingIndex >= 0) {
          // Update existing assignment
          return prevAssignments.map((a, index) => 
            index === existingIndex 
              ? { ...a, supplierId: selectedSupplier }
              : a
          );
        } else {
          // Add new assignment
          return [...prevAssignments, { ingredientId: selectedIngredient, supplierId: selectedSupplier }];
        }
      });

      toast.success('Supplier assignment saved successfully');
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error('Failed to save supplier assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (ingredientId: string) => {
    if (!ingredientId) return;
    
    setIsLoading(true);
    try {
      // Remove assignment from local state
      setAssignments(prevAssignments => 
        prevAssignments.filter(a => a.ingredientId !== ingredientId)
      );
      
      toast.success('Assignment removed successfully');
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
    selectedSupplier,
    setSelectedSupplier,
    isLoadingIngredients,
    isLoadingSuppliers,
    isLoading,
    assignments,
    fetchIngredients,
    fetchSuppliers,
    handleSave,
    handleDelete,
    setSuppliers,
    setIngredients
  };
} 