
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
}

interface ModelAssignmentFormProps {
  ingredients: Ingredient[];
  models: Model[];
  selectedIngredient: string;
  selectedModel: string;
  isLoading: boolean;
  onIngredientChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onSave: () => void;
}

const ModelAssignmentForm: React.FC<ModelAssignmentFormProps> = ({
  ingredients,
  models,
  selectedIngredient,
  selectedModel,
  isLoading,
  onIngredientChange,
  onModelChange,
  onSave,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ingredient-select">Select Detergent</Label>
          <Select 
            value={selectedIngredient} 
            onValueChange={onIngredientChange}
            disabled={isLoading}
          >
            <SelectTrigger id="ingredient-select" className="w-full">
              <SelectValue placeholder="Select a detergent" />
            </SelectTrigger>
            <SelectContent>
              {ingredients.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Click "Load Detergents" button to fetch detergents
                </div>
              ) : (
                ingredients.map((ingredient) => (
                  <SelectItem key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {ingredients.length > 0 
              ? `${ingredients.length} detergents available` 
              : "No detergents loaded yet"}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model-select">Assign Model</Label>
          <Select 
            value={selectedModel} 
            onValueChange={onModelChange}
            disabled={isLoading || !selectedIngredient}
          >
            <SelectTrigger id="model-select" className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Click "Load Models" button to fetch models
                </div>
              ) : (
                models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {models.length > 0 
              ? `${models.length} models available` 
              : "No models loaded yet"}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          onClick={onSave} 
          disabled={isLoading || !selectedIngredient || !selectedModel}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Assignment
        </Button>
      </div>
    </div>
  );
};

export default ModelAssignmentForm;
