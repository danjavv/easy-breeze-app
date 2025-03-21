
import React from 'react';
import { Calendar, User, FileCheck, FileX, Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import BatchDetails from './BatchDetails';
import { BatchResult, Submission } from '@/types/submissions';

interface SubmissionsTableProps {
  submissions: Submission[];
  formatDate: (dateString: string) => string;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions, formatDate }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Submission ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Batches</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => {
            const passRate = submission.total_batches ? 
              ((submission.passed_batches || 0) / submission.total_batches) * 100 :
              0;
              
            return (
              <TableRow key={submission.submissionid}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(submission.created_at)}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {submission.submissionid.split('-')[0]}...
                </TableCell>
                <TableCell>
                  {submission.submission_label || 'Untitled Submission'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {submission.supplier_name || 'Unknown Supplier'}
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-xs text-muted-foreground hover:text-foreground">
                          ID: {submission.supplierid.substring(0, 8)}...
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-mono text-xs">{submission.supplierid}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  {submission.total_batches || 0} total
                </TableCell>
                <TableCell>
                  {submission.total_batches && submission.passed_batches !== null && submission.failed_batches !== null ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">
                          {submission.passed_batches} Passed
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileX className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">
                          {submission.failed_batches} Failed
                        </span>
                      </div>
                      <Badge className={passRate > 80 ? 'bg-green-500' : passRate > 50 ? 'bg-amber-500' : 'bg-red-500'}>
                        {passRate.toFixed(0)}% Pass rate
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="outline">No data</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {submission.results && submission.results.length > 0 ? (
                    <BatchDetails 
                      results={submission.results as BatchResult[]} 
                      submissionLabel={submission.submission_label || 'Untitled Submission'}
                    />
                  ) : (
                    <Badge variant="outline">No batches</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionsTable;
