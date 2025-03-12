
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trash2, XCircle } from 'lucide-react';
import { Supplier } from './SupplierList';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface SupplierDetailsProps {
  supplier: Supplier;
  onApprove: (supplierId: string) => void;
  onReject: (supplierId: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({
  supplier,
  onApprove,
  onReject,
  onDelete,
  onClose,
}) => {
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm') + ' UTC';
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Supplier Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Company Name:</span>
            <span>{supplier.company_name}</span>
            
            <span className="text-muted-foreground">Email:</span>
            <span>{supplier.email}</span>
            
            {supplier.notification_email && (
              <>
                <span className="text-muted-foreground">Notification Email:</span>
                <span>{supplier.notification_email}</span>
              </>
            )}
            
            <span className="text-muted-foreground">Current Status:</span>
            <span>{getStatusBadge(supplier.status)}</span>

            <span className="text-muted-foreground">Created At:</span>
            <span>{formatDate(supplier.created_at)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 justify-end">
        {supplier.status === 'Pending' && (
          <>
            <Button
              variant="outline"
              onClick={() => onReject(supplier.id)}
              className="w-full sm:w-auto flex items-center"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => onApprove(supplier.id)}
              className="w-full sm:w-auto flex items-center"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </>
        )}
        <Button
          variant="destructive"
          onClick={onDelete}
          className="w-full sm:w-auto flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
        {supplier.status !== 'Pending' && (
          <Button
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        )}
      </div>
    </>
  );
};

export default SupplierDetails;
