import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

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

interface SupplierAssignmentFormProps {
  ingredients: Ingredient[];
  suppliers: Supplier[];
  selectedIngredient: string;
  isLoading: boolean;
  onIngredientChange: (value: string) => void;
  onToggleSupplier: (supplierId: string, isEnabled: boolean) => void;
  onSave: () => void;
  assignments: SupplierAssignment[];
}

const SupplierAssignmentForm: React.FC<SupplierAssignmentFormProps> = ({
  ingredients,
  suppliers,
  selectedIngredient,
  isLoading,
  onIngredientChange,
  onToggleSupplier,
  onSave,
  assignments
}) => {
  // Find the currently selected ingredient to display its name
  const selectedIngredientName = ingredients.find(i => i.id === selectedIngredient)?.name || '';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ingredient-select">Select Detergent</Label>
        <Select 
          value={selectedIngredient} 
          onValueChange={onIngredientChange}
          disabled={isLoading}
        >
          <SelectTrigger id="ingredient-select" className="w-full">
            <SelectValue placeholder="Select a detergent">
              {selectedIngredientName || "Select a detergent"}
            </SelectValue>
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
      
      {selectedIngredient && suppliers.length > 0 && (
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="font-medium">Enable/Disable Suppliers</h4>
          <div className="space-y-3">
            {suppliers.map((supplier) => {
              const assignment = assignments.find(
                a => a.supplier_id === supplier.id && a.ingredient_id === selectedIngredient
              );
              const isEnabled = assignment?.is_enabled ?? false;
              
              return (
                <div key={supplier.id} className="flex items-center justify-between">
                  <span>{supplier.company_name}</span>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id={`switch-${supplier.id}`}
                      checked={isEnabled}
                      onCheckedChange={(checked) => onToggleSupplier(supplier.id, checked)}
                    />
                    <Label htmlFor={`switch-${supplier.id}`} className="cursor-pointer">
                      {isEnabled ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          onClick={onSave} 
          disabled={isLoading || !selectedIngredient}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Assignments
        </Button>
      </div>
    </div>
  );
};

export default SupplierAssignmentForm; 