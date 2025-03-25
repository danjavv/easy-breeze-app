import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

interface IngredientListProps {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  onDelete?: (ingredientId: string) => void;
  onToggleStatus?: (ingredientId: string, status: 'Active' | 'Inactive') => void;
}

export function IngredientList({ ingredients, isLoading, error, onDelete, onToggleStatus }: IngredientListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  if (!ingredients.length) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No ingredients found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{ingredient.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{ingredient.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={ingredient.status === 'Active' ? 'default' : 'secondary'}>
                  {ingredient.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(ingredient.created_at), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  {onToggleStatus && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus(ingredient.id, ingredient.status === 'Active' ? 'Inactive' : 'Active')}
                    >
                      {ingredient.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(ingredient.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 