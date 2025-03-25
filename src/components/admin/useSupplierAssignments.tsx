import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchFromWebhook, processWebhookIngredients } from '@/utils/webhookUtils';
import { logSupabaseResponse } from '@/utils/debugUtils';

interface Supplier {
  id: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

interface Ingredient {
  id: string;
  name: string;
  detergency?: number | null;
  foaming?: number | null;
  biodegradability?: number | null;
  purity?: number | null;
  created_at?: string;
}

interface SupplierAssignment {
  ingredient_id: string;
  supplier_id: string;
}

export function useSupplierAssignments() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingAssignments, setExistingAssignments] = useState<SupplierAssignment[]>([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    // When ingredient selection changes, check if there's an existing supplier assignment
    if (selectedIngredient) {
      const assignment = existingAssignments.find(
        a => a.ingredient_id === selectedIngredient
      );
      
      if (assignment) {
        setSelectedSupplier(assignment.supplier_id);
      } else {
        setSelectedSupplier('');
      }
    }
  }, [selectedIngredient, existingAssignments]);

  const fetchIngredients = async () => {
    setIsLoadingIngredients(true);
    try {
      console.log('Fetching ingredients from webhook...');
      
      // Call the webhook to get ingredient data
      const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook/b65a9a50-5a55-462a-a29b-7f6572aa2dcc';
      const webhookData = await fetchFromWebhook(webhookUrl);
      
      // Process the webhook response using our utility function
      const formattedIngredients = processWebhookIngredients(webhookData);
      
      if (formattedIngredients.length > 0) {
        console.log('Ingredients loaded from webhook:', formattedIngredients);
        setIngredients(formattedIngredients);
        toast.success(`Loaded ${formattedIngredients.length} ingredients from webhook successfully`);
      } else {
        await fetchIngredientsFromDatabase();
      }
    } catch (error) {
      console.error('Error with webhook, falling back to Supabase:', error);
      await fetchIngredientsFromDatabase();
    } finally {
      setIsLoadingIngredients(false);
    }
  };
  
  const fetchIngredientsFromDatabase = async () => {
    try {
      console.log('Fetching ingredients from Supabase...');
      
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('id, name')
        .order('name');
      
      logSupabaseResponse('fetch ingredients', ingredientsData, ingredientsError);
      
      if (ingredientsError) {
        console.error('Supabase error:', ingredientsError);
        throw ingredientsError;
      }
      
      if (ingredientsData && ingredientsData.length > 0) {
        setIngredients(ingredientsData);
        toast.success(`Loaded ${ingredientsData.length} ingredients from database successfully`);
      } else {
        console.log('No ingredients data found');
        toast.info('No ingredients found in the database');
        setIngredients([]);
      }
    } catch (error) {
      console.error('Error fetching ingredients from database:', error);
      toast.error('Failed to load ingredients from database');
    }
  };

  const fetchSuppliers = async () => {
    setIsLoadingSuppliers(true);
    try {
      console.log('Fetching suppliers from webhook...');
      
      // Call the webhook to get supplier data
      const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook/944a3d31-08ac-4446-9c67-9e543a85aa40';
      const webhookData = await fetchFromWebhook(webhookUrl);
      
      if (webhookData && webhookData.length > 0) {
        // Process the webhook data to match our Supplier interface
        const formattedSuppliers = webhookData.map((item: any) => ({
          id: item.json.id,
          company_name: item.json.company_name,
          contact_person: item.json.contact_person,
          email: item.json.email,
          phone: item.json.phone,
          address: item.json.address,
          status: item.json.status
        }));
        
        console.log('Suppliers loaded from webhook:', formattedSuppliers);
        setSuppliers(formattedSuppliers);
        toast.success(`Loaded ${formattedSuppliers.length} suppliers from webhook successfully`);
      } else {
        await fetchSuppliersFromDatabase();
      }
    } catch (error) {
      console.error('Error with webhook, falling back to Supabase:', error);
      await fetchSuppliersFromDatabase();
    } finally {
      setIsLoadingSuppliers(false);
    }
  };
  
  const fetchSuppliersFromDatabase = async () => {
    try {
      console.log('Fetching suppliers from Supabase...');
      
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('id, company_name, contact_person, email, phone, address, status')
        .order('company_name');
      
      logSupabaseResponse('fetch suppliers', suppliersData, suppliersError);
      
      if (suppliersError) {
        console.error('Supabase error:', suppliersError);
        throw suppliersError;
      }
      
      if (suppliersData && suppliersData.length > 0) {
        setSuppliers(suppliersData);
        toast.success(`Loaded ${suppliersData.length} suppliers from database successfully`);
      } else {
        console.log('No suppliers data found');
        toast.info('No suppliers found in the database');
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error fetching suppliers from database:', error);
      toast.error('Failed to load suppliers from database');
    }
  };

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      // Fetch existing assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('ingredient_suppliers')
        .select('ingredient_id, supplier_id');
      
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
    if (!selectedIngredient || !selectedSupplier) {
      toast.error('Please select both an ingredient and a supplier');
      return;
    }

    setIsLoading(true);
    try {
      // Send POST request to webhook
      const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook/1b1dafe1-a89b-4447-a11a-ee07327b6d0c';
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_id: selectedSupplier,
          ingredient_id: selectedIngredient
        })
      });

      if (!webhookResponse.ok) {
        throw new Error('Failed to send data to webhook');
      }

      // Check if assignment already exists
      const existingAssignment = existingAssignments.find(
        a => a.ingredient_id === selectedIngredient
      );

      let result;
      
      if (existingAssignment) {
        // Update existing assignment
        result = await supabase
          .from('ingredient_suppliers')
          .update({ supplier_id: selectedSupplier })
          .eq('ingredient_id', selectedIngredient);
      } else {
        // Create new assignment
        result = await supabase
          .from('ingredient_suppliers')
          .insert({
            ingredient_id: selectedIngredient,
            supplier_id: selectedSupplier
          });
      }

      if (result.error) throw result.error;

      // Refresh assignments
      await fetchAssignments();
      
      toast.success('Supplier assignment saved successfully');
    } catch (error) {
      console.error('Error saving supplier assignment:', error);
      toast.error('Failed to save supplier assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (ingredientId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('ingredient_suppliers')
        .delete()
        .eq('ingredient_id', ingredientId);

      if (error) throw error;

      // Refresh assignments
      await fetchAssignments();
      
      // Clear selections if the deleted assignment was selected
      if (selectedIngredient === ingredientId) {
        setSelectedIngredient('');
        setSelectedSupplier('');
      }
      
      toast.success('Supplier assignment deleted successfully');
    } catch (error) {
      console.error('Error deleting supplier assignment:', error);
      toast.error('Failed to delete supplier assignment');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ingredients,
    suppliers,
    selectedIngredient,
    selectedSupplier,
    isLoadingIngredients,
    isLoadingSuppliers,
    isLoading,
    existingAssignments,
    setSelectedIngredient,
    setSelectedSupplier,
    fetchIngredients,
    fetchSuppliers,
    handleSave,
    handleDelete
  };
} 