
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw, Trash2, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export interface Supplier {
  id: string;
  company_name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  notification_email?: string;
  password_hash?: string;
}

interface SupplierListProps {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
  isMockData: boolean;
  onViewSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplier: Supplier, e: React.MouseEvent) => void;
  onRetry: () => void;
}

const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  isLoading,
  error,
  isMockData,
  onViewSupplier,
  onDeleteSupplier,
  onRetry,
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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-8 space-y-4">
        <RefreshCw className="animate-spin h-8 w-8 text-primary" />
        <p className="text-muted-foreground">Fetching supplier data...</p>
      </div>
    );
  } 
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    );
  } 
  
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No suppliers found
      </div>
    );
  } 
  
  return (
    <div className="rounded-md border flex-1 overflow-hidden">
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader className="sticky top-0 bg-background shadow-sm z-10">
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow 
                key={supplier.id || Math.random().toString()}
                className="cursor-pointer hover:bg-muted"
                onClick={() => onViewSupplier(supplier)}
              >
                <TableCell className="font-medium">{supplier.company_name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                <TableCell>{formatDate(supplier.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewSupplier(supplier);
                      }}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => onDeleteSupplier(supplier, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default SupplierList;
