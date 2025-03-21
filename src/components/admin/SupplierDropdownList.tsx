
import React, { useState } from 'react';
import { Supplier } from '@/components/admin/SupplierList';
import { 
  CheckCircle, 
  ChevronDown, 
  Clock, 
  Mail, 
  Trash, 
  User, 
  X, 
  XCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SupplierSubmission {
  submission_id: string;
  submission_label: string;
  processed_at: string;
  summary: {
    total_batches: number;
    failed_batches: number;
    passed_batches: number;
  };
  results: {
    status: string;
    metrics: {
      purity: number;
      foaming: number;
      detergency: number;
      biodegradability: number;
    };
    batch_label: string;
    failure_reasons?: string[];
  }[];
}

interface SupplierDropdownListProps {
  suppliers: Supplier[];
  onClose: () => void;
  onDelete: (supplierId: string) => void;
}

const SupplierDropdownList: React.FC<SupplierDropdownListProps> = ({ 
  suppliers, 
  onClose,
  onDelete
}) => {
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SupplierSubmission | null>(null);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

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
        return <Badge variant="warning" className="ml-2 inline-flex items-center">Pending</Badge>;
      case 'Approved':
        return <Badge variant="success" className="ml-2 inline-flex items-center">
          <CheckCircle className="mr-1 h-3 w-3" /> Approved
        </Badge>;
      case 'Rejected':
        return <Badge variant="destructive" className="ml-2 inline-flex items-center">
          <XCircle className="mr-1 h-3 w-3" /> Rejected
        </Badge>;
      default:
        return <Badge variant="outline" className="ml-2">{status}</Badge>;
    }
  };

  const toggleSupplier = (supplierId: string) => {
    setExpandedSupplier(expandedSupplier === supplierId ? null : supplierId);
  };

  const viewSubmissionDetails = (submission: SupplierSubmission) => {
    setSelectedSubmission(submission);
    setShowSubmissionDialog(true);
  };

  const confirmDelete = (supplierId: string) => {
    setDeleteConfirmation(supplierId);
  };

  const handleDelete = () => {
    if (deleteConfirmation) {
      onDelete(deleteConfirmation);
      setDeleteConfirmation(null);
    }
  };

  const handleClose = () => {
    setDeleteConfirmation(null);
    setExpandedSupplier(null);
    onClose();
  };

  return (
    <Card className="mt-6 mb-8">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Supplier List</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        {suppliers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No suppliers found
          </div>
        ) : (
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="border rounded-md">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted"
                  onClick={() => toggleSupplier(supplier.id)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <span className="font-medium">{supplier.company_name}</span>
                      {getStatusBadge(supplier.status)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-start flex-col w-full">
                            <span className="text-xs text-muted-foreground">ID:</span>
                            <span className="text-xs font-mono break-all">{supplier.id}</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{supplier.email}</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Created: {formatDate(supplier.created_at)}</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive" 
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(supplier.id);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Trash className="h-4 w-4" />
                            <span>Delete supplier</span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {expandedSupplier === supplier.id && (
                  <div className="p-4 border-t bg-muted/40">
                    <h4 className="text-sm font-medium mb-2">Submissions</h4>
                    {supplier.submissions && supplier.submissions.length > 0 ? (
                      <div className="space-y-2">
                        {supplier.submissions.map((submission, index) => (
                          <div key={index} className="bg-background rounded-md p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium">{submission.submission_label}</h5>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(submission.processed_at)}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewSubmissionDetails(submission)}
                              >
                                View Details
                              </Button>
                            </div>
                            <div className="mt-2 flex gap-3">
                              <Badge variant="outline">
                                Total: {submission.summary.total_batches}
                              </Badge>
                              <Badge variant="success">
                                Passed: {submission.summary.passed_batches}
                              </Badge>
                              <Badge variant="destructive">
                                Failed: {submission.summary.failed_batches}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No submissions yet</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-2">Confirm Delete</h3>
              <p className="mb-4">
                Are you sure you want to delete this supplier? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full" onClick={handleClose}>
          Close
        </Button>
      </CardFooter>

      {/* Submission Details Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSubmission?.submission_label} Details
            </DialogTitle>
            <DialogDescription>
              Processed on {selectedSubmission && formatDate(selectedSubmission.processed_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline">
                  Total: {selectedSubmission.summary.total_batches}
                </Badge>
                <Badge variant="success">
                  Passed: {selectedSubmission.summary.passed_batches}
                </Badge>
                <Badge variant="destructive">
                  Failed: {selectedSubmission.summary.failed_batches}
                </Badge>
              </div>

              <div className="border rounded-md">
                <div className="bg-muted p-3 font-medium">Batch Results</div>
                <div className="divide-y">
                  {selectedSubmission.results.map((result, index) => (
                    <div key={index} className="p-3 hover:bg-muted/50">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{result.batch_label}</span>
                        {result.status === 'PASS' ? (
                          <Badge variant="success">PASS</Badge>
                        ) : (
                          <Badge variant="destructive">FAIL</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>Purity: {result.metrics.purity}</div>
                        <div>Foaming: {result.metrics.foaming}</div>
                        <div>Detergency: {result.metrics.detergency}</div>
                        <div>Biodegradability: {result.metrics.biodegradability}</div>
                      </div>
                      
                      {result.failure_reasons && result.failure_reasons.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm font-medium text-destructive">Failure Reasons:</div>
                          <ul className="list-disc pl-5 text-sm text-destructive">
                            {result.failure_reasons.map((reason, i) => (
                              <li key={i}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowSubmissionDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SupplierDropdownList;
