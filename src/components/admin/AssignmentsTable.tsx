
import React from 'react';

interface ModelAssignment {
  ingredient_id: string;
  model_id: string;
}

interface Ingredient {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
}

interface AssignmentsTableProps {
  assignments: ModelAssignment[];
  ingredients: Ingredient[];
  models: Model[];
  isLoading: boolean;
}

const AssignmentsTable: React.FC<AssignmentsTableProps> = ({
  assignments,
  ingredients,
  models,
  isLoading,
}) => {
  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    return ingredient ? ingredient.name : 'Unknown';
  };

  const getModelName = (id: string) => {
    const model = models.find(m => m.id === id);
    return model ? model.name : 'Unknown';
  };

  if (assignments.length === 0) {
    return null;
  }

  return (
    <div className="pt-4">
      <h3 className="text-lg font-medium mb-2">Current Assignments</h3>
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detergent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Model
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : (
              assignments.map((assignment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getIngredientName(assignment.ingredient_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getModelName(assignment.model_id)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsTable;
