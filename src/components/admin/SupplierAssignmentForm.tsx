import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  company_name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

interface SupplierAssignmentFormProps {
  ingredients: Ingredient[];
  suppliers: Supplier[];
  selectedIngredient: string;
  selectedSupplier: string;
  isLoading: boolean;
  onIngredientChange: (value: string) => void;
  onSupplierChange: (value: string) => void;
  onSave: () => void;
}

const SupplierAssignmentForm: React.FC<SupplierAssignmentFormProps> = ({
  ingredients,
  suppliers,
  selectedIngredient,
  selectedSupplier,
  isLoading,
  onIngredientChange,
  onSupplierChange,
  onSave,
}) => {
  // Find the currently selected ingredient and supplier to display their names
  const selectedIngredientName = ingredients.find(i => i.id === selectedIngredient)?.name || '';
  const selectedSupplierName = suppliers.find(s => s.id === selectedSupplier)?.company_name || '';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ingredient-select">Select Ingredient</Label>
          <Select 
            value={selectedIngredient} 
            onValueChange={onIngredientChange}
            disabled={isLoading}
          >
            <SelectTrigger id="ingredient-select" className="w-full">
              <SelectValue placeholder="Select an ingredient">
                {selectedIngredientName || "Select an ingredient"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ingredients.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Click "Load Ingredients" button to fetch ingredients
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
              ? `${ingredients.length} ingredients available` 
              : "No ingredients loaded yet"}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supplier-select">Assign Supplier</Label>
          <Select 
            value={selectedSupplier} 
            onValueChange={onSupplierChange}
            disabled={isLoading || !selectedIngredient}
          >
            <SelectTrigger id="supplier-select" className="w-full">
              <SelectValue placeholder="Select a supplier">
                {selectedSupplierName || "Select a supplier"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {suppliers.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Click "Load Suppliers" button to fetch suppliers
                </div>
              ) : (
                suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.company_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {suppliers.length > 0 
              ? `${suppliers.length} approved suppliers available` 
              : "No approved suppliers loaded yet"}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          onClick={onSave} 
          disabled={isLoading || !selectedIngredient || !selectedSupplier}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Assignment
        </Button>
      </div>
    </div>
  );
};

export default SupplierAssignmentForm; 