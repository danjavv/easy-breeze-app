
import { supabase } from '@/integrations/supabase/client';
import { Submission, BatchResult } from '@/types/submissions';
import { useToast } from '@/hooks/use-toast';

const WEBHOOK_URL = 'https://danjaved008.app.n8n.cloud/webhook-test/be46fb03-6f2d-4f9e-8963-f7aba3eb4101';

// Process webhook data into properly typed submissions
export const processWebhookData = (webhookData: any): Submission[] => {
  try {
    console.log('Processing webhook data:', webhookData);
    
    const dataArray = Array.isArray(webhookData) ? webhookData : [webhookData];
    
    if (dataArray.length === 0) {
      console.log('No data returned from webhook');
      return [];
    }
    
    const processedSubmissions = dataArray.map(item => {
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
      })) : [];
      
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
    return processedSubmissions;
  } catch (error) {
    console.error('Error processing webhook data:', error);
    return [];
  }
};

// Fetch submissions from the webhook
export const fetchSubmissionsFromWebhook = async (): Promise<Submission[]> => {
  try {
    console.log(`Fetching from webhook: ${WEBHOOK_URL}`);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch submissions: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Webhook submissions response:', data);
    
    return processWebhookData(data);
  } catch (error) {
    console.error('Error fetching submissions from webhook:', error);
    throw error;
  }
};

// Fetch submissions from Supabase database
export const fetchSubmissionsFromSupabase = async (): Promise<Submission[]> => {
  try {
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
    
    if (!submissionsData || submissionsData.length === 0) {
      return [];
    }
    
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
        })) : [];
        
        return {
          ...submission,
          supplier_name: supplierMap[submission.supplierid] || 'Unknown Supplier',
          results: typedResults
        } as Submission;
      });
      
      return enhancedSubmissions;
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
        })) : []
      } as Submission)) : [];
      
      return typedSubmissions;
    }
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
};

// Format date for display
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
