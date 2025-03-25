
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import PaginationControls from '@/components/admin/PaginationControls';
import EmptySubmissions from '@/components/admin/EmptySubmissions';
import { formatDate } from '@/utils/submissionsAPI';
import { Submission } from '@/types/submissions';

interface SubmissionsContentProps {
  submissions: Submission[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  fromWebhook: boolean;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const SubmissionsContent: React.FC<SubmissionsContentProps> = ({
  submissions,
  isLoading,
  currentPage,
  totalPages,
  fromWebhook,
  onPageChange,
  onRefresh
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Submission History</CardTitle>
        <CardDescription>
          {fromWebhook 
            ? "Submissions retrieved from external webhook" 
            : "All submissions from suppliers, sorted by most recent"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length > 0 ? (
          <>
            <SubmissionsTable 
              submissions={submissions} 
              formatDate={formatDate} 
            />
            
            <PaginationControls 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </>
        ) : (
          <EmptySubmissions 
            isLoading={isLoading} 
            onRefresh={onRefresh} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionsContent;
