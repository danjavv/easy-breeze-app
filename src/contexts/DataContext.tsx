
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Ingredient, Model } from '@/pages/AdminDashboard';

interface DataContextType {
  models: Model[];
  ingredients: Ingredient[];
  setModels: (models: Model[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
  clearModels: () => void;
  clearIngredients: () => void;
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

  return (
    <DataContext.Provider value={{ 
      models, 
      ingredients, 
      setModels, 
      setIngredients,
      clearModels,
      clearIngredients
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
