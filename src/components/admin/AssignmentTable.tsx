import { useState } from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Supplier {
  id: string;
  company_name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

interface Ingredient {
  id: string;
  name: string;
  detergency?: number | null;
  foaming?: number | null;
  biodegradability?: number | null;
  purity?: number | null;
  created_at?: string;
}

interface SupplierAssignment {
  ingredientId: string;
  supplierId: string;
}

interface AssignmentTableProps {
  ingredients: Ingredient[];
  suppliers: Supplier[];
  assignments: SupplierAssignment[];
  isLoading: boolean;
  onDelete: (ingredientId: string) => Promise<void>;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({
  ingredients,
  suppliers,
  assignments,
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
              <th className="text-left p-3 font-medium">Ingredient</th>
              <th className="text-left p-3 font-medium">Assigned Supplier</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr className="border-t">
                <td colSpan={3} className="p-4 text-center text-muted-foreground">
                  No assignments found
                </td>
              </tr>
            ) : (
              assignments.map((assignment) => {
                const ingredient = ingredients.find(i => i.id === assignment.ingredientId);
                const supplier = suppliers.find(s => s.id === assignment.supplierId);
                
                return (
                  <tr key={assignment.ingredientId} className="border-t">
                    <td className="p-3">{ingredient?.name || 'Unknown Ingredient'}</td>
                    <td className="p-3">{supplier?.company_name || 'Unknown Supplier'}</td>
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
                            onClick={() => onDelete(assignment.ingredientId)}
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
