
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, ArrowUp, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Metrics = {
  purity: number;
  foaming: number;
  detergency: number;
  biodegradability?: number;
};

type Batch = {
  status: string;
  metrics: Metrics;
  batch_label: string;
  failure_reasons?: string[];
};

type SubmissionSummary = {
  total_batches: number;
  failed_batches: number;
  passed_batches: number;
};

type SubmissionResult = {
  results: Batch[];
  summary: SubmissionSummary;
  processed_at: string;
  submission_id: string;
  submission_label: string;
};

type Submission = SubmissionResult | {
  id?: string;
  date: string;
  label: string;
  batches: number;
  status: string;
  statusColor: string;
};

type SubmissionsTableProps = {
  submissions: Submission[];
  isLoading?: boolean;
  onRefresh?: () => void;
};

const SubmissionsTable = ({ submissions, isLoading = false, onRefresh }: SubmissionsTableProps) => {
  const navigate = useNavigate();
  const { supplierID } = useAuth();

  useEffect(() => {
    // Send POST request when component mounts (when viewing past submissions)
    const fetchSubmissions = async () => {
      try {
        console.log('Sending POST request with supplierID:', supplierID);
        const response = await fetch('https://danjaved008.app.n8n.cloud/webhook-test/7e057feb-401a-4110-9fcc-b00817876790', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            supplierID: supplierID || 'test-supplier-id',
          }),
        });
        
        if (!response.ok) {
          console.error('Error fetching submissions:', response.statusText);
        }
        
        const data = await response.json().catch(e => {
          console.log('Not a valid JSON response');
        });
        
        if (data) {
          console.log('Response data:', data);
          if (onRefresh) {
            onRefresh(); // Notify parent to refresh data
          }
        }
      } catch (error) {
        console.error('Error sending POST request:', error);
      }
    };

    fetchSubmissions();
  }, [supplierID, onRefresh]);

  const viewSubmission = (submissionId: string) => {
    navigate(`/submission-results/${submissionId}`);
  };

  const newSubmission = () => {
    navigate('/new-submission');
  };

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('pass')) {
      return status.toLowerCase().includes('0 pass') ? 'text-red-500' : 'text-amber-500';
    }
    if (status.toLowerCase().includes('fail')) return 'text-red-500';
    if (status.toLowerCase().includes('pending')) return 'text-blue-500';
    return 'text-muted-foreground';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit',
        year: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const isNewFormatSubmission = (submission: any): submission is SubmissionResult => {
    return submission.results && Array.isArray(submission.results) && submission.summary;
  };

  const renderSkeletonRows = () => {
    return Array(3).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-8 w-16" /></TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="bg-card rounded-md border shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Submissions</h2>
        <div className="flex gap-2">
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2" disabled={isLoading}>
              {isLoading ? <Loader size={16} className="animate-spin" /> : null}
              Refresh
            </Button>
          )}
          <Button onClick={newSubmission} className="flex items-center gap-2">
            <ArrowUp size={16} />
            New Submission
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Batches</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletonRows()
            ) : submissions.length > 0 ? (
              submissions.map((submission, index) => {
                if (isNewFormatSubmission(submission)) {
                  const { summary, processed_at, submission_id, submission_label } = submission;
                  const statusText = `${summary.passed_batches} Pass / ${summary.failed_batches} Fail`;
                  const statusClass = summary.failed_batches === 0 ? 'text-green-500' : 'text-amber-500';
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{formatDate(processed_at)}</TableCell>
                      <TableCell className="font-medium">{submission_label}</TableCell>
                      <TableCell>{summary.total_batches}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {summary.failed_batches === 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-amber-500" />
                          )}
                          <span className={statusClass}>{statusText}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewSubmission(submission_id)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={index}>
                      <TableCell>{submission.date}</TableCell>
                      <TableCell className="font-medium">{submission.label}</TableCell>
                      <TableCell>{submission.batches}</TableCell>
                      <TableCell className={submission.statusColor || getStatusColor(submission.status)}>
                        {submission.status}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewSubmission(submission.id || `submission-${index}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No submissions found. Start by creating a new submission.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubmissionsTable;
