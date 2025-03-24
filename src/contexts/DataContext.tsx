
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ingredient, Model } from '@/pages/AdminDashboard';

interface DataContextType {
  models: Model[];
  ingredients: Ingredient[];
  setModels: (models: Model[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
  clearModels: () => void;
  clearIngredients: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [models, setModelsState] = useState<Model[]>([]);
  const [ingredients, setIngredientsState] = useState<Ingredient[]>([]);

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
  };
  
  const clearIngredients = () => {
    console.log("Clearing ingredients in DataContext");
    setIngredientsState([]);
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
