import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SupplierAssignmentForm from './SupplierAssignmentForm';
import { useSupplierAssignments } from './useSupplierAssignments';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { useState } from 'react';

const SupplierAssignmentSection = () => {
  const {
    ingredients,
    suppliers,
    selectedIngredient,
    setSelectedIngredient,
    isLoadingIngredients,
    isLoadingSuppliers,
    isLoading,
    existingAssignments,
    fetchIngredients,
    fetchSuppliers,
    handleSave
  } = useSupplierAssignments();

  const [assignments, setAssignments] = useState(existingAssignments);

  const handleToggleSupplier = (supplierId: string, isEnabled: boolean) => {
    if (!selectedIngredient) return;

    setAssignments(prev => {
      const existingIndex = prev.findIndex(
        a => a.supplier_id === supplierId && a.ingredient_id === selectedIngredient
      );

      if (existingIndex >= 0) {
        // Update existing assignment
        const newAssignments = [...prev];
        newAssignments[existingIndex] = {
          ...newAssignments[existingIndex],
          is_enabled: isEnabled
        };
        return newAssignments;
      } else {
        // Add new assignment
        return [
          ...prev,
          {
            supplier_id: supplierId,
            ingredient_id: selectedIngredient,
            is_enabled: isEnabled
          }
        ];
      }
    });
  };

  const handleSaveAssignments = async () => {
    if (!selectedIngredient) return;

    const currentAssignments = assignments.filter(
      a => a.ingredient_id === selectedIngredient
    );

    await handleSave(currentAssignments);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">Assign Suppliers to Detergent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Button
            onClick={fetchIngredients}
            disabled={isLoadingIngredients}
            variant="outline"
          >
            {isLoadingIngredients ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Detergents...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Load Detergents
              </>
            )}
          </Button>
          <Button
            onClick={fetchSuppliers}
            disabled={isLoadingSuppliers}
            variant="outline"
          >
            {isLoadingSuppliers ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Suppliers...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Load Suppliers
              </>
            )}
          </Button>
        </div>
        
        <SupplierAssignmentForm 
          ingredients={ingredients}
          suppliers={suppliers}
          selectedIngredient={selectedIngredient}
          isLoading={isLoading}
          onIngredientChange={setSelectedIngredient}
          onToggleSupplier={handleToggleSupplier}
          onSave={handleSaveAssignments}
          assignments={assignments}
        />
      </CardContent>
    </Card>
  );
};

export default SupplierAssignmentSection; 