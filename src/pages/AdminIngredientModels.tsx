
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox'; 
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Save, RefreshCw, Plus, Trash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast as sonnerToast } from 'sonner';

interface Ingredient {
  id: string;
  name: string;
  purity?: number | null;
  detergency?: number | null;
  foaming?: number | null;
  biodegrability?: number | null;
}

interface Model {
  name: string;
  description: string;
  detergency: number;
  foaming: number;
  biodegrability: number;
  purity: number;
  parameters?: Record<string, any>;
}

const AdminIngredientModels = () => {
  const { setUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelConfigOpen, setIsModelConfigOpen] = useState(false);
  
  // Configuration state for the model
  const [configName, setConfigName] = useState('Model 1');
  const [isActive, setIsActive] = useState(false);
  
  // Values for base model properties
  const [baseValues, setBaseValues] = useState({
    detergency: 320,
    foaming: 250,
    biodegradability: 500,
    purity: 40,
  });

  // Values for model thresholds
  const [thresholdValues, setThresholdValues] = useState({
    detergency: 500,
    foaming: 300,
    biodegradability: 600,
    purity: 60,
  });

  useEffect(() => {
    // Check if we have ingredients from the location state (passed from DashboardCardsGrid)
    if (location.state?.ingredients) {
      // Ensure we have an array of ingredients
      const ingredientsArray = Array.isArray(location.state.ingredients) 
        ? location.state.ingredients 
        : [location.state.ingredients];
      
      setIngredients(ingredientsArray);
    } else {
      // If not, fetch them directly
      fetchIngredients();
    }
  }, [location.state]);

  const fetchIngredients = async () => {
    setIsLoading(true);
    try {
      // Fetch ingredients from Supabase directly
      const { data, error } = await supabase
        .from('ingredients')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Ensure we're working with an array of ingredients
      const ingredientsArray = Array.isArray(data) ? data : [data];
      
      setIngredients(ingredientsArray);
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

  const handleSignOut = () => {
    setUserRole(null);
    navigate('/auth');
  };

  const handleBaseValueChange = (key: keyof typeof baseValues, value: string) => {
    setBaseValues(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleThresholdValueChange = (key: keyof typeof thresholdValues, value: string) => {
    setThresholdValues(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const startModelConfig = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    
    // Set default model name based on existing models count
    const modelCount = 1; // Since we don't have models in the ingredient type, start with 1
    setConfigName(`Model ${modelCount}`);
    
    // Use ingredient values as defaults if available
    if (ingredient) {
      setBaseValues({
        detergency: ingredient.detergency || 320,
        foaming: ingredient.foaming || 250,
        biodegradability: ingredient.biodegrability || 500,
        purity: ingredient.purity || 40,
      });
      
      // Set thresholds slightly higher than base values
      setThresholdValues({
        detergency: (ingredient.detergency || 320) + 180,
        foaming: (ingredient.foaming || 250) + 50,
        biodegradability: (ingredient.biodegrability || 500) + 100,
        purity: (ingredient.purity || 40) + 20,
      });
    }
    
    setIsModelConfigOpen(true);
  };

  const handleSaveModel = async () => {
    if (!selectedIngredient) return;
    
    setIsLoading(true);
    try {
      // Create a new model object
      const newModel: Model = {
        name: configName,
        description: isActive ? "Active Model" : "Inactive Model",
        detergency: thresholdValues.detergency,
        foaming: thresholdValues.foaming,
        biodegrability: thresholdValues.biodegradability,
        purity: thresholdValues.purity,
        parameters: {
          version: 1,
          created_at: new Date().toISOString(),
          isActive: isActive,
          baseValues: {...baseValues},
        }
      };
      
      // Get current models array from the database
      const { data: ingredientData, error: fetchError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('id', selectedIngredient.id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Check if we have models data or initialize an empty array
      const currentModels = ingredientData.models || [];
      
      // Add new model to the array
      const updatedModels = [...currentModels, newModel];
      
      // Update the ingredient in the database
      const { error } = await supabase
        .from('ingredients')
        .update({ 
          // Use JSON data instead of trying to access a 'models' property
          // that might not exist in the Ingredient interface
          models: updatedModels 
        })
        .eq('id', selectedIngredient.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the ingredients data after save
      fetchIngredients();
      
      sonnerToast.success('Model configuration saved successfully');
      if (isActive) {
        sonnerToast.info('Model set as active');
      }
      
      setIsModelConfigOpen(false);
    } catch (error) {
      console.error('Error creating model:', error);
      sonnerToast.error('Failed to save model configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModel = async (ingredientId: string, modelIndex: number) => {
    setIsLoading(true);
    try {
      // Get current models from the database
      const { data: ingredientData, error: fetchError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('id', ingredientId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Get the current models array or initialize an empty one
      const currentModels = ingredientData.models || [];
      
      // Remove the model at the specified index
      const updatedModels = currentModels.filter((_, index) => index !== modelIndex);
      
      // Update the ingredient in the database
      const { error } = await supabase
        .from('ingredients')
        .update({ 
          // Use JSON data directly
          models: updatedModels
        })
        .eq('id', ingredientId);
      
      if (error) {
        throw error;
      }
      
      // Refresh ingredients data after deletion
      fetchIngredients();
      
      sonnerToast.success('Model deleted successfully');
    } catch (error) {
      console.error('Error deleting model:', error);
      sonnerToast.error('Failed to delete model');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    setIsModelConfigOpen(false);
  };
  
  // Render the model configuration UI
  const renderModelConfig = () => {
    if (!isModelConfigOpen || !selectedIngredient) return null;
    
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Model Configuration for {selectedIngredient.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="config-name">Model Name</Label>
              <Input 
                id="config-name"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Base Values</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Property</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(baseValues).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium capitalize">{key}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Input 
                            type="number"
                            value={value}
                            onChange={(e) => handleBaseValueChange(key as keyof typeof baseValues, e.target.value)}
                            className="w-[120px]"
                          />
                          {key === 'purity' && <span className="ml-2">%</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Model Thresholds</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Property</TableHead>
                    <TableHead>Required Minimum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(thresholdValues).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium capitalize">{key}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Input 
                            type="number"
                            value={value}
                            onChange={(e) => handleThresholdValueChange(key as keyof typeof thresholdValues, e.target.value)}
                            className="w-[120px]"
                          />
                          {key === 'purity' && <span className="ml-2">%</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="active" 
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked as boolean)}
              />
              <label
                htmlFor="active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set as Active Model
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveModel}>
                <Save className="mr-2 h-4 w-4" />
                Save Model
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Function to display models for the selected ingredient
  const renderModels = () => {
    if (!selectedIngredient) return null;
    
    // Get the models from ingredient data
    const { data } = supabase
      .from('ingredients')
      .select('models')
      .eq('id', selectedIngredient.id)
      .single();
    
    const models = data?.models || [];
    
    if (models.length === 0) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{selectedIngredient.name} - Available Models</CardTitle>
          <CardDescription>
            All configured models for {selectedIngredient.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Detergency</TableHead>
                <TableHead>Foaming</TableHead>
                <TableHead>Biodegradability</TableHead>
                <TableHead>Purity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>{model.detergency || model.parameters?.thresholds?.detergency || '-'}</TableCell>
                  <TableCell>{model.foaming || model.parameters?.thresholds?.foaming || '-'}</TableCell>
                  <TableCell>{model.biodegrability || model.parameters?.thresholds?.biodegradability || '-'}</TableCell>
                  <TableCell>{model.purity || model.parameters?.thresholds?.purity || '-'}</TableCell>
                  <TableCell>
                    {model.parameters?.isActive ? 
                      <span className="text-green-500 font-medium">Active</span> : 
                      <span className="text-muted-foreground">Inactive</span>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteModel(selectedIngredient.id, index)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => startModelConfig(selectedIngredient)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Model
          </Button>
        </CardFooter>
      </Card>
    );
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

        {/* Model Configuration UI */}
        {isModelConfigOpen && renderModelConfig()}

        {/* If not configuring a model, show the ingredients table */}
        {!isModelConfigOpen && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Ingredients</CardTitle>
              <CardDescription>
                View all ingredients and manage models for them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Purity</TableHead>
                    <TableHead>Detergency</TableHead>
                    <TableHead>Foaming</TableHead>
                    <TableHead>Biodegradability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.length > 0 ? (
                    ingredients.map((ingredient) => (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium">{ingredient.name || 'Unnamed'}</TableCell>
                        <TableCell>{ingredient.purity !== null ? ingredient.purity : '-'}</TableCell>
                        <TableCell>{ingredient.detergency !== null ? ingredient.detergency : '-'}</TableCell>
                        <TableCell>{ingredient.foaming !== null ? ingredient.foaming : '-'}</TableCell>
                        <TableCell>{ingredient.biodegrability !== null ? ingredient.biodegrability : '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => startModelConfig(ingredient)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Manage Models
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        {isLoading ? 'Loading ingredients...' : 'No ingredients found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Display models for the selected ingredient if not in config mode */}
        {!isModelConfigOpen && selectedIngredient && renderModels()}
      </main>
    </div>
  );
};

export default AdminIngredientModels;
