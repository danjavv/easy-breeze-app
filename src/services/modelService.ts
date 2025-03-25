import { Model } from '@/components/admin/ModelList';

export async function getModels(): Promise<{ models: Model[] }> {
  try {
    const response = await fetch('https://danjaved008.app.n8n.cloud/webhook/944a3d31-08ac-4446-9c67-9e543a85aa40');
    
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    
    const data = await response.json();
    return { models: data };
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}

export async function addModel(model: Omit<Model, 'id' | 'created_at'>): Promise<Model> {
  try {
    // Add model logic here
    const mockId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    return {
      ...model,
      id: mockId,
      created_at: now
    };
  } catch (error) {
    console.error('Error adding model:', error);
    throw error;
  }
}

export async function deleteModel(modelId: string): Promise<void> {
  try {
    // Delete model logic here
    console.log('Deleting model:', modelId);
  } catch (error) {
    console.error('Error deleting model:', error);
    throw error;
  }
}

export async function updateModelStatus(modelId: string, status: 'Active' | 'Inactive'): Promise<void> {
  try {
    // Update model status logic here
    console.log('Updating model status:', modelId, status);
  } catch (error) {
    console.error('Error updating model status:', error);
    throw error;
  }
} 