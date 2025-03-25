import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface Model {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

interface ModelListProps {
  models: Model[];
  isLoading: boolean;
  error: string | null;
  onDelete?: (modelId: string) => void;
  onToggleStatus?: (modelId: string, status: 'Active' | 'Inactive') => void;
}

export function ModelList({ models, isLoading, error, onDelete, onToggleStatus }: ModelListProps) {
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

  if (!models.length) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No models found
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
          {models.map((model) => (
            <tr key={model.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{model.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{model.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={model.status === 'Active' ? 'default' : 'secondary'}>
                  {model.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(model.created_at), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  {onToggleStatus && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus(model.id, model.status === 'Active' ? 'Inactive' : 'Active')}
                    >
                      {model.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(model.id)}
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