
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import PaginationControls from '@/components/admin/PaginationControls';
import EmptySubmissions from '@/components/admin/EmptySubmissions';
import { Submission, BatchResult } from '@/types/submissions';

const ITEMS_PER_PAGE = 10;

const AdminAllSubmissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fromWebhook, setFromWebhook] = useState(false);

  // Fetch submissions when component mounts
  useEffect(() => {
    fetchSubmissionsFromWebhook();
  }, []);

  const processWebhookData = (webhookData: any) => {
    try {
      console.log('Processing webhook data:', webhookData);
      
      const dataArray = Array.isArray(webhookData) ? webhookData : [webhookData];
      
      const processedSubmissions = dataArray.map(item => {
        // Ensure results are properly typed as BatchResult[]
        const typedResults = item.results ? item.results.map((result: any) => ({
          status: result.status || 'UNKNOWN',
          batch_label: result.batch_label || `Batch`,
          metrics: {
            purity: result.metrics?.purity || 0,
            foaming: result.metrics?.foaming || 0,
            detergency: result.metrics?.detergency || 0,
            biodegradability: result.metrics?.biodegradability || 0
          },
          failure_reasons: result.failure_reasons || []
        } as BatchResult)) : [];
        
        return {
          submissionid: item.submissionid || item.id || `webhook-${Math.random().toString(36).substr(2, 9)}`,
          submission_label: item.submission_label || item.label || 'Webhook Submission',
          created_at: item.created_at || item.date || new Date().toISOString(),
          supplierid: item.supplierid || item.supplier_id || 'unknown',
          supplier_name: item.supplier_name || item.company_name || 'External Supplier',
          total_batches: item.total_batches || typedResults.length || 0,
          passed_batches: item.passed_batches || 0,
          failed_batches: item.failed_batches || 0,
          results: typedResults
        } as Submission;
      });
      
      console.log('Processed submissions:', processedSubmissions);
      setSubmissions(processedSubmissions);
      setTotalPages(Math.ceil(processedSubmissions.length / ITEMS_PER_PAGE) || 1);
      setFromWebhook(true);
      
      toast({
        title: "Webhook data processed",
        description: `Successfully processed ${processedSubmissions.length} submissions from webhook.`,
      });
    } catch (error) {
      console.error('Error processing webhook data:', error);
      toast({
        title: "Error",
        description: "Failed to process webhook data. Using raw data instead.",
        variant: "destructive"
      });
    }
  };

  const fetchSubmissionsFromSupabase = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching submissions data from Supabase...');
      
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (submissionsError) {
        console.error('Error fetching submissions:', submissionsError);
        throw submissionsError;
      }
      
      console.log('Submissions data:', submissionsData);
      
      const supplierIds = [...new Set(submissionsData.map(s => s.supplierid))];
      
      if (supplierIds.length > 0) {
        const { data: suppliersData, error: suppliersError } = await supabase
          .from('suppliers')
          .select('id, company_name')
          .in('id', supplierIds);
        
        if (suppliersError) {
          console.error('Error fetching suppliers:', suppliersError);
          throw suppliersError;
        }
        
        console.log('Suppliers data:', suppliersData);
        
        const supplierMap = suppliersData.reduce((acc, supplier) => {
          acc[supplier.id] = supplier.company_name;
          return acc;
        }, {} as Record<string, string>);
        
        // Ensure results are properly typed as BatchResult[]
        const enhancedSubmissions = submissionsData.map(submission => {
          const typedResults = submission.results ? submission.results.map((result: any) => ({
            status: result.status || 'UNKNOWN',
            batch_label: result.batch_label || `Batch`,
            metrics: {
              purity: result.metrics?.purity || 0,
              foaming: result.metrics?.foaming || 0,
              detergency: result.metrics?.detergency || 0,
              biodegradability: result.metrics?.biodegradability || 0
            },
            failure_reasons: result.failure_reasons || []
          } as BatchResult)) : [];
          
          return {
            ...submission,
            supplier_name: supplierMap[submission.supplierid] || 'Unknown Supplier',
            results: typedResults
          } as Submission;
        });
        
        setSubmissions(enhancedSubmissions);
        setTotalPages(Math.ceil(enhancedSubmissions.length / ITEMS_PER_PAGE) || 1);
      } else {
        const typedSubmissions = submissionsData ? submissionsData.map(submission => ({
          ...submission,
          results: submission.results ? submission.results.map((result: any) => ({
            status: result.status || 'UNKNOWN',
            batch_label: result.batch_label || `Batch`,
            metrics: {
              purity: result.metrics?.purity || 0,
              foaming: result.metrics?.foaming || 0,
              detergency: result.metrics?.detergency || 0,
              biodegradability: result.metrics?.biodegradability || 0
            },
            failure_reasons: result.failure_reasons || []
          } as BatchResult)) : []
        } as Submission)) : [];
        
        setSubmissions(typedSubmissions);
        setTotalPages(Math.ceil((typedSubmissions.length || 0) / ITEMS_PER_PAGE) || 1);
      }
      
      setFromWebhook(false);
      
      toast({
        title: "Submissions loaded",
        description: `Successfully loaded ${submissionsData?.length || 0} submissions.`,
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissionsFromWebhook = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook-test/be46fb03-6f2d-4f9e-8963-f7aba3eb4101', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Webhook submissions response (refresh):', data);
      
      processWebhookData(data);
    } catch (error) {
      console.error('Error fetching submissions from webhook:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions from webhook. Trying database...",
        variant: "destructive"
      });
      
      fetchSubmissionsFromSupabase();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    navigate('/auth');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const paginatedSubmissions = submissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  console.log('Current page:', currentPage);
  console.log('Total pages:', totalPages);
  console.log('Paginated submissions:', paginatedSubmissions);
  console.log('All submissions:', submissions);

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminHeader onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button 
              variant="outline" 
              className="mb-4" 
              onClick={() => navigate('/admin-dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">All Submissions</h1>
            <p className="text-muted-foreground">
              {fromWebhook 
                ? "Submissions data from external webhook" 
                : "View and manage all supplier submissions"}
            </p>
          </div>
          
          <Button 
            variant="outline"
            onClick={fromWebhook ? fetchSubmissionsFromWebhook : fetchSubmissionsFromSupabase}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh {fromWebhook ? "from Webhook" : ""}
          </Button>
        </div>
        
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
                  submissions={paginatedSubmissions} 
                  formatDate={formatDate} 
                />
                
                <PaginationControls 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <EmptySubmissions 
                isLoading={isLoading} 
                onRefresh={fromWebhook ? fetchSubmissionsFromWebhook : fetchSubmissionsFromSupabase} 
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminAllSubmissions;
