import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Ingredient, Model } from '@/pages/AdminDashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Supplier {
  id: string;
  company_name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

interface DataContextType {
  models: Model[];
  ingredients: Ingredient[];
  suppliers: Supplier[];
  setModels: (models: Model[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  clearModels: () => void;
  clearIngredients: () => void;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const STORAGE_KEY_MODELS = 'essence_models';
const STORAGE_KEY_INGREDIENTS = 'essence_ingredients';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [models, setModelsState] = useState<Model[]>(() => {
    // Initialize from localStorage on component mount
    const savedModels = localStorage.getItem(STORAGE_KEY_MODELS);
    return savedModels ? JSON.parse(savedModels) : [];
  });
  
  const [ingredients, setIngredientsState] = useState<Ingredient[]>(() => {
    // Initialize from localStorage on component mount
    const savedIngredients = localStorage.getItem(STORAGE_KEY_INGREDIENTS);
    return savedIngredients ? JSON.parse(savedIngredients) : [];
  });

  const [suppliers, setSuppliersState] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update localStorage whenever models or ingredients change
  useEffect(() => {
    if (models.length > 0) {
      localStorage.setItem(STORAGE_KEY_MODELS, JSON.stringify(models));
      console.log("Models saved to localStorage:", models);
      console.log("First model name in localStorage:", models[0]?.name || 'No name');
    }
  }, [models]);

  useEffect(() => {
    if (ingredients.length > 0) {
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(ingredients));
      console.log("Ingredients saved to localStorage:", ingredients);
      console.log("First ingredient name in localStorage:", ingredients[0]?.name || 'No name');
    }
  }, [ingredients]);

  const setModels = (newModels: Model[]) => {
    console.log("Setting models in DataContext:", newModels);
    console.log("First model name in context:", newModels[0]?.name || 'No name');
    setModelsState(newModels);
  };

  const setIngredients = (newIngredients: Ingredient[]) => {
    console.log("Setting ingredients in DataContext:", newIngredients);
    console.log("First ingredient name in context:", newIngredients[0]?.name || 'No name');
    setIngredientsState(newIngredients);
  };

  const setSuppliers = (newSuppliers: Supplier[]) => {
    console.log("Setting suppliers in DataContext:", newSuppliers);
    console.log("First supplier name in context:", newSuppliers[0]?.company_name || 'No name');
    setSuppliersState(newSuppliers);
  };

  const clearModels = () => {
    console.log("Clearing models in DataContext");
    setModelsState([]);
    localStorage.removeItem(STORAGE_KEY_MODELS);
  };
  
  const clearIngredients = () => {
    console.log("Clearing ingredients in DataContext");
    setIngredientsState([]);
    localStorage.removeItem(STORAGE_KEY_INGREDIENTS);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');

      if (ingredientsError) throw ingredientsError;
      setIngredients(ingredientsData || []);

      // Fetch models
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .order('name');

      if (modelsError) throw modelsError;
      setModels(modelsData || []);

      // Fetch suppliers
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .order('company_name');

      if (suppliersError) throw suppliersError;
      
      // Transform the data to ensure proper typing of the status field
      const formattedSuppliers = (suppliersData || []).map(supplier => ({
        ...supplier,
        status: supplier.status as 'Pending' | 'Approved' | 'Rejected'
      }));
      
      setSuppliers(formattedSuppliers);

      toast.success('Data loaded successfully');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ 
      models, 
      ingredients, 
      suppliers, 
      setModels, 
      setIngredients,
      setSuppliers,
      clearModels,
      clearIngredients,
      isLoading,
      error,
      fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
