import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Ingredient, Model } from '@/pages/AdminDashboard';
import { Supplier } from '@/components/admin/SupplierList';

interface DataContextType {
  models: Model[];
  ingredients: Ingredient[];
  suppliers: Supplier[];
  setModels: (models: Model[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  clearModels: () => void;
  clearIngredients: () => void;
  clearSuppliers: () => void;
}

const STORAGE_KEY_MODELS = 'essence_models';
const STORAGE_KEY_INGREDIENTS = 'essence_ingredients';
const STORAGE_KEY_SUPPLIERS = 'essence_suppliers';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [models, setModelsState] = useState<Model[]>(() => {
    try {
      const savedModels = localStorage.getItem(STORAGE_KEY_MODELS);
      return savedModels ? JSON.parse(savedModels) : [];
    } catch (error) {
      console.error('Error loading models from localStorage:', error);
      return [];
    }
  });
  
  const [ingredients, setIngredientsState] = useState<Ingredient[]>(() => {
    try {
      const savedIngredients = localStorage.getItem(STORAGE_KEY_INGREDIENTS);
      return savedIngredients ? JSON.parse(savedIngredients) : [];
    } catch (error) {
      console.error('Error loading ingredients from localStorage:', error);
      return [];
    }
  });

  const [suppliers, setSuppliersState] = useState<Supplier[]>(() => {
    try {
      const savedSuppliers = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
      return savedSuppliers ? JSON.parse(savedSuppliers) : [];
    } catch (error) {
      console.error('Error loading suppliers from localStorage:', error);
      return [];
    }
  });

  // Update localStorage whenever models, ingredients, or suppliers change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MODELS, JSON.stringify(models));
      console.log("Models saved to localStorage:", models);
    } catch (error) {
      console.error('Error saving models to localStorage:', error);
    }
  }, [models]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(ingredients));
      console.log("Ingredients saved to localStorage:", ingredients);
    } catch (error) {
      console.error('Error saving ingredients to localStorage:', error);
    }
  }, [ingredients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(suppliers));
      console.log("Suppliers saved to localStorage:", suppliers);
    } catch (error) {
      console.error('Error saving suppliers to localStorage:', error);
    }
  }, [suppliers]);

  const setModels = (newModels: Model[]) => {
    console.log("Setting models in DataContext:", newModels);
    setModelsState(newModels);
  };

  const setIngredients = (newIngredients: Ingredient[]) => {
    console.log("Setting ingredients in DataContext:", newIngredients);
    setIngredientsState(newIngredients);
  };

  const setSuppliers = (newSuppliers: Supplier[]) => {
    console.log("Setting suppliers in DataContext:", newSuppliers);
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

  const clearSuppliers = () => {
    console.log("Clearing suppliers in DataContext");
    setSuppliersState([]);
    localStorage.removeItem(STORAGE_KEY_SUPPLIERS);
  };

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
      clearSuppliers
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
