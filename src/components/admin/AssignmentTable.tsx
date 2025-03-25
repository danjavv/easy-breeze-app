
import { useState } from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Model {
  id: string;
  name: string;
}

interface Ingredient {
  id: string;
  name: string;
}

interface ModelAssignment {
  ingredient_id: string;
  model_id: string;
}

interface AssignmentTableProps {
  ingredients: Ingredient[];
  models: Model[];
  existingAssignments: ModelAssignment[];
  isLoading: boolean;
  onDelete: (ingredientId: string) => Promise<void>;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({
  ingredients,
  models,
  existingAssignments,
  isLoading,
  onDelete,
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Existing Assignments</h3>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Detergent</th>
              <th className="text-left p-3 font-medium">Assigned Model</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {existingAssignments.length === 0 ? (
              <tr className="border-t">
                <td colSpan={3} className="p-4 text-center text-muted-foreground">
                  No assignments found
                </td>
              </tr>
            ) : (
              existingAssignments.map((assignment) => {
                const ingredient = ingredients.find(i => i.id === assignment.ingredient_id);
                const model = models.find(m => m.id === assignment.model_id);
                
                return (
                  <tr key={assignment.ingredient_id} className="border-t">
                    <td className="p-3">{ingredient?.name || 'Unknown Detergent'}</td>
                    <td className="p-3">{model?.name || 'Unknown Model'}</td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(assignment.ingredient_id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Assignment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentTable;
