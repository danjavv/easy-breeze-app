
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
  const [models, setModels] = useState<Model[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const clearModels = () => setModels([]);
  const clearIngredients = () => setIngredients([]);

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
