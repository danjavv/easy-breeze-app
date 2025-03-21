import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, User, Calendar, FileCheck, FileX } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';

interface Submission {
  submissionid: string;
  submission_label: string | null;
  created_at: string;
  supplierid: string;
  total_batches: number | null;
  passed_batches: number | null;
  failed_batches: number | null;
  supplier_name?: string;
}

const ITEMS_PER_PAGE = 10;

const AdminAllSubmissions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const initialSubmissions = location.state?.submissions || [];
  const fromWebhook = location.state?.fromWebhook || false;
  
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(initialSubmissions.length / ITEMS_PER_PAGE) || 1
  );

  useEffect(() => {
    if (submissions.length === 0 && !fromWebhook) {
      fetchSubmissionsFromSupabase();
    } else if (fromWebhook) {
      processWebhookData(submissions);
    }
  }, []);

  const processWebhookData = (webhookData: any[]) => {
    try {
      console.log('Processing webhook data:', webhookData);
      
      const processedSubmissions = webhookData.map(item => {
        return {
          submissionid: item.id || item.submissionid || `webhook-${Math.random().toString(36).substr(2, 9)}`,
          submission_label: item.label || item.submission_label || 'Webhook Submission',
          created_at: item.created_at || item.date || new Date().toISOString(),
          supplierid: item.supplier_id || item.supplierid || 'unknown',
          supplier_name: item.supplier_name || item.company_name || 'External Supplier',
          total_batches: item.total_batches || item.batches || 0,
          passed_batches: item.passed_batches || item.passed || 0,
          failed_batches: item.failed_batches || item.failed || 0
        };
      });
      
      setSubmissions(processedSubmissions);
      setTotalPages(Math.ceil(processedSubmissions.length / ITEMS_PER_PAGE) || 1);
      
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
        
        const enhancedSubmissions = submissionsData.map(submission => ({
          ...submission,
          supplier_name: supplierMap[submission.supplierid] || 'Unknown Supplier'
        }));
        
        setSubmissions(enhancedSubmissions);
        setTotalPages(Math.ceil(enhancedSubmissions.length / ITEMS_PER_PAGE) || 1);
      } else {
        setSubmissions(submissionsData || []);
        setTotalPages(Math.ceil((submissionsData?.length || 0) / ITEMS_PER_PAGE) || 1);
      }
      
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

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (totalPages > maxPagesToShow && currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue;
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (totalPages > maxPagesToShow && currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSubmissions.map((submission, index) => {
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
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {submission.supplier_name || 'Unknown Supplier'}
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
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                          />
                        </PaginationItem>
                        
                        {renderPaginationItems()}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="py-32 text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading submissions...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FileX className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-xl font-medium mb-2">No submissions found</p>
                    <p className="text-muted-foreground">
                      There are no supplier submissions in the system yet
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={fetchSubmissionsFromSupabase}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Data
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminAllSubmissions;
