
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Submission {
  submissionid: string;
  submission_label: string | null;
  created_at: string;
  supplierid: string;
  total_batches: number | null;
  passed_batches: number | null;
  failed_batches: number | null;
}

export function useSubmissionsManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  const handleViewAllSubmissions = async () => {
    try {
      setIsLoadingSubmissions(true);
      
      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook/be46fb03-6f2d-4f9e-8963-f7aba3eb4101', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Webhook submissions response:', data);
      
      const submissionsArray = Array.isArray(data) ? data : [data];
      
      navigate('/admin-all-submissions', { 
        state: { 
          submissions: submissionsArray, 
          fromWebhook: true 
        } 
      });
      
      toast({
        title: "Submissions loaded",
        description: `Successfully loaded submissions from webhook.`,
      });
    } catch (error) {
      console.error('Error fetching submissions from webhook:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions from webhook. Falling back to direct database access.",
        variant: "destructive"
      });
      
      navigate('/admin-all-submissions');
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  return {
    submissions,
    isLoadingSubmissions,
    handleViewAllSubmissions
  };
}
