import { Ingredient } from '@/components/admin/IngredientList';

export async function getIngredients(): Promise<{ ingredients: Ingredient[] }> {
  try {
    const response = await fetch('https://danjaved008.app.n8n.cloud/webhook/944a3d31-08ac-4446-9c67-9e543a85aa40');
    
    if (!response.ok) {
      throw new Error('Failed to fetch ingredients');
    }
    
    const data = await response.json();
    return { ingredients: data };
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
}

export async function addIngredient(ingredient: Omit<Ingredient, 'id' | 'created_at'>): Promise<Ingredient> {
  try {
    // Add ingredient logic here
    const mockId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    return {
      ...ingredient,
      id: mockId,
      created_at: now
    };
  } catch (error) {
    console.error('Error adding ingredient:', error);
    throw error;
  }
}

export async function deleteIngredient(ingredientId: string): Promise<void> {
  try {
    // Delete ingredient logic here
    console.log('Deleting ingredient:', ingredientId);
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    throw error;
  }
}

export async function updateIngredientStatus(ingredientId: string, status: 'Active' | 'Inactive'): Promise<void> {
  try {
    // Update ingredient status logic here
    console.log('Updating ingredient status:', ingredientId, status);
  } catch (error) {
    console.error('Error updating ingredient status:', error);
    throw error;
  }
} 