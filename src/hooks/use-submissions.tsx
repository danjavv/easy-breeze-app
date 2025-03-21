
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Submission } from '@/types/submissions';
import { fetchSubmissionsFromWebhook, fetchSubmissionsFromSupabase, processMockSubmissionData } from '@/utils/submissionsAPI';

const ITEMS_PER_PAGE = 10;

export const useSubmissions = () => {
  const { toast } = useToast();
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fromWebhook, setFromWebhook] = useState(false);

  useEffect(() => {
    loadSubmissionsFromWebhook();
  }, []);

  const loadSubmissionsFromWebhook = async () => {
    try {
      setIsLoading(true);
      let data;
      
      try {
        data = await fetchSubmissionsFromWebhook();
      } catch (error) {
        console.error('Error loading webhook data:', error);
        // If the fetch fails, use the mock data
        data = processMockSubmissionData();
        
        toast({
          title: "Using mock data",
          description: "Couldn't connect to webhook, using mock submission data instead.",
        });
      }
      
      setSubmissions(data);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE) || 1);
      setFromWebhook(true);
      
      toast({
        title: "Data processed",
        description: `Successfully processed ${data.length} submissions.`,
      });
    } catch (error) {
      console.error('Error loading webhook data:', error);
      toast({
        title: "Error",
        description: "Failed to process submissions. Trying database...",
        variant: "destructive"
      });
      
      loadSubmissionsFromSupabase();
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubmissionsFromSupabase = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSubmissionsFromSupabase();
      
      setSubmissions(data);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE) || 1);
      setFromWebhook(false);
      
      toast({
        title: "Submissions loaded",
        description: `Successfully loaded ${data.length} submissions.`,
      });
    } catch (error) {
      console.error('Error loading Supabase data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedSubmissions = submissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );
  
  return {
    submissions,
    paginatedSubmissions,
    isLoading,
    currentPage,
    totalPages,
    fromWebhook,
    setCurrentPage,
    refreshWebhook: loadSubmissionsFromWebhook,
    refreshSupabase: loadSubmissionsFromSupabase
  };
};
