import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupplierAssignments } from '@/components/admin/useSupplierAssignments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function AdminSupplierAssignments() {
  const navigate = useNavigate();
  const {
    ingredients,
    suppliers,
    selectedIngredient,
    selectedSupplier,
    isLoadingIngredients,
    isLoadingSuppliers,
    isLoading,
    existingAssignments,
    setSelectedIngredient,
    setSelectedSupplier,
    fetchIngredients,
    fetchSuppliers,
    handleSave,
    handleDelete
  } = useSupplierAssignments();

  useEffect(() => {
    fetchIngredients();
    fetchSuppliers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Supplier Assignments</h1>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Admin Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Supplier and Ingredient</CardTitle>
            <CardDescription>
              Choose a supplier and ingredient to create an assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select
                  value={selectedSupplier}
                  onValueChange={setSelectedSupplier}
                  disabled={isLoadingSuppliers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isLoadingSuppliers && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading suppliers...
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ingredient">Ingredient</Label>
                <Select
                  value={selectedIngredient}
                  onValueChange={setSelectedIngredient}
                  disabled={isLoadingIngredients}
                >
                  <SelectTrigger>
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
                {isLoadingIngredients && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading ingredients...
                  </div>
                )}
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isLoading || !selectedIngredient || !selectedSupplier}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Assignment'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
          <CardDescription>
            View and manage existing supplier assignments for ingredients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {existingAssignments.length === 0 ? (
              <p className="text-muted-foreground">No assignments found.</p>
            ) : (
              <div className="grid gap-4">
                {existingAssignments.map((assignment) => {
                  const ingredient = ingredients.find(i => i.id === assignment.ingredient_id);
                  const supplier = suppliers.find(s => s.id === assignment.supplier_id);
                  
                  return (
                    <div
                      key={assignment.ingredient_id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{ingredient?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Supplier: {supplier?.company_name}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(assignment.ingredient_id)}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 