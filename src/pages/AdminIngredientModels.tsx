
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Plus, RefreshCw, Trash } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  purity?: number | null;
  detergency?: number | null;
  foaming?: number | null;
  biodegrability?: number | null;
  models?: any[] | null;
}

interface Model {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

const formSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  description: z.string().min(1, "Description is required"),
});

const AdminIngredientModels = () => {
  const { setUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const fetchIngredients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      setIngredients(data || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ingredients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleSignOut = () => {
    setUserRole(null);
    navigate('/auth');
  };

  const handleAddModel = async (values: z.infer<typeof formSchema>) => {
    if (!selectedIngredient) return;
    
    setIsLoading(true);
    try {
      // Create a new model object
      const newModel: Model = {
        name: values.name,
        description: values.description,
        parameters: {
          // Default parameters
          version: 1,
          created_at: new Date().toISOString(),
        }
      };
      
      // Get current models array or initialize it
      const currentModels = selectedIngredient.models || [];
      
      // Add new model to the array
      const updatedModels = [...currentModels, newModel];
      
      // Update the ingredient in the database
      const { error } = await supabase
        .from('ingredients')
        .update({ models: updatedModels })
        .eq('id', selectedIngredient.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setIngredients(prev => 
        prev.map(ing => 
          ing.id === selectedIngredient.id 
            ? { ...ing, models: updatedModels } 
            : ing
        )
      );
      
      setSelectedIngredient(prev => 
        prev ? { ...prev, models: updatedModels } : null
      );
      
      setIsDialogOpen(false);
      form.reset();
      
      toast({
        title: "Model created",
        description: `Successfully added model "${values.name}" to ingredient "${selectedIngredient.name}".`,
      });
    } catch (error) {
      console.error('Error creating model:', error);
      toast({
        title: "Error",
        description: "Failed to create model. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModel = async (ingredientId: string, modelIndex: number) => {
    setIsLoading(true);
    try {
      // Find the ingredient
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      if (!ingredient || !ingredient.models) return;
      
      // Remove the model at the specified index
      const updatedModels = ingredient.models.filter((_, index) => index !== modelIndex);
      
      // Update the ingredient in the database
      const { error } = await supabase
        .from('ingredients')
        .update({ models: updatedModels })
        .eq('id', ingredientId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setIngredients(prev => 
        prev.map(ing => 
          ing.id === ingredientId 
            ? { ...ing, models: updatedModels } 
            : ing
        )
      );
      
      if (selectedIngredient?.id === ingredientId) {
        setSelectedIngredient(prev => 
          prev ? { ...prev, models: updatedModels } : null
        );
      }
      
      toast({
        title: "Model deleted",
        description: "The model has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      toast({
        title: "Error",
        description: "Failed to delete model. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminHeader onSignOut={handleSignOut} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin-dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Ingredient Models</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchIngredients}
            className="ml-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>

        {/* Grid of ingredients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {ingredients.map((ingredient) => (
            <Card key={ingredient.id} className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{ingredient.name || 'Unnamed Ingredient'}</CardTitle>
                <CardDescription>
                  Models: {ingredient.models ? ingredient.models.length : 0}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Properties:</p>
                <ul className="text-sm space-y-1">
                  {ingredient.purity !== null && (
                    <li>Purity: {ingredient.purity}</li>
                  )}
                  {ingredient.detergency !== null && (
                    <li>Detergency: {ingredient.detergency}</li>
                  )}
                  {ingredient.foaming !== null && (
                    <li>Foaming: {ingredient.foaming}</li>
                  )}
                  {ingredient.biodegrability !== null && (
                    <li>Biodegradability: {ingredient.biodegrability}</li>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setSelectedIngredient(ingredient);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Model
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Selected ingredient models display */}
        {selectedIngredient && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{selectedIngredient.name} Models</CardTitle>
              <CardDescription>
                All available models for {selectedIngredient.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedIngredient.models && selectedIngredient.models.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedIngredient.models.map((model, index) => (
                    <Card key={index} className="border border-muted">
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{model.name}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteModel(selectedIngredient.id, index)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-sm">{model.description}</p>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(model.parameters.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Version: {model.parameters.version}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No models available for this ingredient.</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dialog for adding a new model */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Model</DialogTitle>
              <DialogDescription>
                Create a new model for {selectedIngredient?.name}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddModel)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Model'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminIngredientModels;
