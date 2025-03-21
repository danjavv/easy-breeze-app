
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Supplier } from '@/components/admin/SupplierList';
import { AlertTriangle, CheckCircle, Trash2, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SupplierDropdownListProps {
  suppliers: Supplier[];
  onClose: () => void;
  onDelete: (supplierId: string) => void;
  onToggleStatus: (supplier: Supplier) => void;
}

const SupplierDropdownList: React.FC<SupplierDropdownListProps> = ({
  suppliers,
  onClose,
  onDelete,
  onToggleStatus
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm') + ' UTC';
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="warning" className="flex items-center">
          <AlertTriangle className="mr-1 h-3 w-3" /> {status}
        </Badge>;
      case 'Approved':
        return <Badge variant="success" className="flex items-center">
          <CheckCircle className="mr-1 h-3 w-3" /> {status}
        </Badge>;
      case 'Rejected':
        return <Badge variant="danger" className="flex items-center">
          <XCircle className="mr-1 h-3 w-3" /> {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Supplier Management</DialogTitle>
          <DialogDescription>
            View and manage supplier accounts
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 my-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.company_name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                    <TableCell>{formatDate(supplier.created_at)}</TableCell>
                    <TableCell className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center" 
                        onClick={() => onToggleStatus(supplier)}
                      >
                        {supplier.status === 'Pending' ? (
                          <>
                            <ToggleLeft className="h-4 w-4 mr-1" /> Activate
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4 mr-1" /> Set Pending
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex items-center"
                        onClick={() => onDelete(supplier.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No suppliers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierDropdownList;
