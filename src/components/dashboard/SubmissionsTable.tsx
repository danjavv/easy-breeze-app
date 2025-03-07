
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
import { Eye } from 'lucide-react';

type Submission = {
  id?: string;
  date: string;
  label: string;
  batches: number;
  status: string;
  statusColor: string;
};

type SubmissionsTableProps = {
  submissions: Submission[];
};

const SubmissionsTable = ({ submissions }: SubmissionsTableProps) => {
  const navigate = useNavigate();

  const viewSubmission = (submissionId: string) => {
    navigate(`/submission-results/${submissionId}`);
  };

  return (
    <div className="bg-card rounded-md border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Your Submissions</h2>
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
            {submissions.map((submission, index) => (
              <TableRow key={index}>
                <TableCell>{submission.date}</TableCell>
                <TableCell className="font-medium">{submission.label}</TableCell>
                <TableCell>{submission.batches}</TableCell>
                <TableCell className={submission.statusColor}>{submission.status}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubmissionsTable;
