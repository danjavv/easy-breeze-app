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
  name: string;
}

interface SupplierAssignment {
  ingredient_id: string;
  supplier_id: string;
}

interface SupplierAssignmentFormProps {
  ingredients: Ingredient[];
  suppliers: Supplier[];
  selectedIngredient: string;
  isLoading: boolean;
  onIngredientChange: (value: string) => void;
  onSave: (assignments: SupplierAssignment[]) => void;
}

const SupplierAssignmentForm: React.FC<SupplierAssignmentFormProps> = ({
  ingredients,
  suppliers,
  selectedIngredient,
  isLoading,
  onIngredientChange,
  onSave,
}) => {
  const [assignments, setAssignments] = React.useState<SupplierAssignment[]>([]);

  // Find the currently selected ingredient to display its name
  const selectedIngredientName = ingredients.find(i => i.id === selectedIngredient)?.name || '';

  const handleToggleSupplier = (supplierId: string, isEnabled: boolean) => {
    if (!selectedIngredient) return;

    setAssignments(prev => {
      const existingIndex = prev.findIndex(
        a => a.supplier_id === supplierId && a.ingredient_id === selectedIngredient
      );

      if (existingIndex >= 0) {
        // Remove assignment if disabled
        if (!isEnabled) {
          return prev.filter((_, index) => index !== existingIndex);
        }
        return prev;
      } else {
        // Add new assignment if enabled
        return [
          ...prev,
          {
            supplier_id: supplierId,
            ingredient_id: selectedIngredient,
          }
        ];
      }
    });
  };

  const handleSave = () => {
    if (!selectedIngredient) return;
    onSave(assignments);
  };

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
      
      {selectedIngredient && (
        <div className="space-y-4">
          <Label>Assign Suppliers</Label>
          <div className="space-y-2">
            {suppliers.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Click "Load Suppliers" button to fetch suppliers
              </div>
            ) : (
              suppliers.map((supplier) => {
                const isAssigned = assignments.some(
                  a => a.supplier_id === supplier.id && a.ingredient_id === selectedIngredient
                );
                
                return (
                  <div key={supplier.id} className="flex items-center justify-between p-2 border rounded-md">
                    <span className="text-sm">{supplier.name}</span>
                    <Switch
                      checked={isAssigned}
                      onCheckedChange={(checked) => handleToggleSupplier(supplier.id, checked)}
                    />
                  </div>
                );
              })
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {suppliers.length > 0 
              ? `${suppliers.length} suppliers available` 
              : "No suppliers loaded yet"}
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !selectedIngredient || assignments.length === 0}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Assignment
        </Button>
      </div>
    </div>
  );
};

export default SupplierAssignmentForm; 