
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import BatchDetails from './BatchDetails';
import { Submission } from '@/types/submissions';

interface SubmissionsTableProps {
  submissions: Submission[];
  formatDate: (dateString: string) => string;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions, formatDate }) => {
  const navigate = useNavigate();

  const viewSubmissionDetails = (submissionId: string) => {
    navigate(`/submission-results/${submissionId}`);
  };

  const truncateId = (id: string) => {
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Submission</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Supplier ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.submissionid}>
              <TableCell className="whitespace-nowrap">
                {formatDate(submission.created_at)}
              </TableCell>
              <TableCell className="font-medium">
                {submission.submission_label || 'Untitled Submission'}
              </TableCell>
              <TableCell>{submission.supplier_name || 'Unknown Supplier'}</TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger className="text-xs text-muted-foreground">
                    {truncateId(submission.supplierid)}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{submission.supplierid}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                {submission.total_batches === null ? (
                  <span className="text-muted-foreground">No batches</span>
                ) : (
                  <span>
                    {submission.passed_batches} / {submission.total_batches} passed
                  </span>
                )}
              </TableCell>
              <TableCell>
                {submission.results && submission.results.length > 0 ? (
                  <BatchDetails 
                    results={submission.results}
                    submissionLabel={submission.submission_label || 'Untitled'}
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">No data</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => viewSubmissionDetails(submission.submissionid)}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionsTable;
