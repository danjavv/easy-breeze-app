
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface SubmissionProps {
  id: string;
  date: string;
  label: string;
  batches: number;
  status: string;
  statusColor: string;
}

interface SubmissionsTableProps {
  submissions: SubmissionProps[];
  isLoading: boolean;
  onRefresh: () => void;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ 
  submissions, 
  isLoading, 
  onRefresh 
}) => {
  const navigate = useNavigate();
  
  const viewDetails = (id: string) => {
    navigate(`/submission-results/${id}`);
  };
  
  const getStatusBadge = (status: string, color: string) => {
    if (status.includes('Pass')) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          {status}
        </Badge>
      );
    } else if (status.includes('0')) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {status}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className={color}>
        {status}
      </Badge>
    );
  };
  
  if (isLoading) {
    return (
      <Card className="animate-fade-in border-border/40 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!submissions || submissions.length === 0) {
    return (
      <Card className="animate-fade-in border-border/40 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground opacity-20 mb-3" />
            <h3 className="text-lg font-medium">No submissions found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              You haven't submitted any samples yet
            </p>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="animate-fade-in border-border/40 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Submission History</CardTitle>
        <CardDescription>
          View all your past submissions and their results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Batches</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow 
                  key={submission.id}
                  className="hover:bg-muted/40 transition-colors duration-200"
                >
                  <TableCell className="font-medium">{submission.date}</TableCell>
                  <TableCell>{submission.label}</TableCell>
                  <TableCell>{submission.batches}</TableCell>
                  <TableCell>
                    {getStatusBadge(submission.status, submission.statusColor)}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewDetails(submission.id)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsTable;
