
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Supplier } from './SupplierList';
import { supabase } from '@/integrations/supabase/client';

interface Ingredient {
  id: string;
  name: string;
}

interface SupplierIngredientAssignment {
  supplierId: string;
  ingredientId: string;
  isEnabled: boolean;
}

interface AssignSupplierFormProps {
  suppliers: Supplier[];
}

const AssignSupplierForm: React.FC<AssignSupplierFormProps> = ({ suppliers }) => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [assignments, setAssignments] = useState<SupplierIngredientAssignment[]>([]);
  
  // Fetch ingredients from Supabase
  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select('id, name');
          
        if (error) throw error;
        
        if (data) {
          setIngredients(data);
          if (data.length > 0) {
            setSelectedIngredient(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        toast({
          title: "Error",
          description: "Failed to load ingredients. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIngredients();
  }, [toast]);

  // When ingredient selection changes, fetch current supplier assignments
  useEffect(() => {
    if (!selectedIngredient) return;
    
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd fetch actual assignments from your database
        // For this demo, we'll create dummy assignments
        const dummyAssignments: SupplierIngredientAssignment[] = suppliers.map(supplier => ({
          supplierId: supplier.id,
          ingredientId: selectedIngredient,
          isEnabled: Math.random() > 0.5 // Randomly enable/disable for demo
        }));
        
        setAssignments(dummyAssignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssignments();
  }, [selectedIngredient, suppliers]);

  const handleToggleSupplier = (supplierId: string, isEnabled: boolean) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.supplierId === supplierId
          ? { ...assignment, isEnabled }
          : assignment
      )
    );
  };

  const handleSaveAssignments = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, you'd save these assignments to your database
      console.log('Saving assignments:', assignments);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Assignments Saved",
        description: "Supplier assignments have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving assignments:', error);
      toast({
        title: "Error",
        description: "Failed to save assignments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Assign Suppliers to Ingredients</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="ingredient-select">Select Ingredient</Label>
          <Select
            value={selectedIngredient || ''}
            onValueChange={setSelectedIngredient}
            disabled={isLoading || ingredients.length === 0}
          >
            <SelectTrigger id="ingredient-select" className="w-full">
              <SelectValue placeholder="Select an ingredient" />
            </SelectTrigger>
            <SelectContent>
              {ingredients.map((ingredient) => (
                <SelectItem key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : selectedIngredient && assignments.length > 0 ? (
          <div className="space-y-4 border rounded-md p-4">
            <h4 className="font-medium">Enable/Disable Suppliers</h4>
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const supplier = suppliers.find(s => s.id === assignment.supplierId);
                return supplier ? (
                  <div key={supplier.id} className="flex items-center justify-between">
                    <span>{supplier.company_name}</span>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`switch-${supplier.id}`}
                        checked={assignment.isEnabled}
                        onCheckedChange={(checked) => handleToggleSupplier(supplier.id, checked)}
                      />
                      <Label htmlFor={`switch-${supplier.id}`} className="cursor-pointer">
                        {assignment.isEnabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
            
            <Button 
              onClick={handleSaveAssignments} 
              className="mt-4 w-full"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Assignments'
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {ingredients.length === 0 
              ? "No ingredients available" 
              : "Select an ingredient to manage supplier assignments"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignSupplierForm;
