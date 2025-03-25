import { supabase } from '@/integrations/supabase/client';
import { Submission, BatchResult } from '@/types/submissions';
import { useToast } from '@/hooks/use-toast';

const WEBHOOK_URL = 'https://danjaved008.app.n8n.cloud/webhook/be46fb03-6f2d-4f9e-8963-f7aba3eb4101';

// Function to return mock data when the webhook is unavailable
export const processMockSubmissionData = (): Submission[] => {
  const mockSubmission = {
    "created_at": "2025-03-21T21:33:24+00:00",
    "submission_label": "ACME_Q2_Batch_2",
    "total_batches": 5,
    "passed_batches": 2,
    "failed_batches": 3,
    "results": [
      {
        "status": "FAIL",
        "metrics": {
          "purity": 5,
          "foaming": 315,
          "detergency": 520,
          "biodegradability": 160
        },
        "batch_label": "ACME_LAS_001",
        "failure_reasons": [
          "Biodegradability (160 < required 600)",
          "Purity (5 < required 60)"
        ]
      },
      {
        "status": "FAIL",
        "metrics": {
          "purity": 25,
          "foaming": 735,
          "detergency": 1040,
          "biodegradability": 480
        },
        "batch_label": "ACME_LAS_002",
        "failure_reasons": [
          "Biodegradability (480 < required 600)",
          "Purity (25 < required 60)"
        ]
      },
      {
        "status": "FAIL",
        "metrics": {
          "purity": 45,
          "foaming": 1155,
          "detergency": 1560,
          "biodegradability": 800
        },
        "batch_label": "ACME_LAS_003",
        "failure_reasons": [
          "Purity (45 < required 60)"
        ]
      },
      {
        "status": "PASS",
        "metrics": {
          "purity": 65,
          "foaming": 1575,
          "detergency": 2080,
          "biodegradability": 1120
        },
        "batch_label": "ACME_LAS_004"
      },
      {
        "status": "PASS",
        "metrics": {
          "purity": 85,
          "foaming": 1995,
          "detergency": 2600,
          "biodegradability": 1440
        },
        "batch_label": "ACME_LAS_005"
      }
    ],
    "supplierid": "43bf87df-c7b7-407f-9680-7e8a330e9b44",
    "submissionid": "d1c2f7e5-7d82-4d92-bcc6-b7b392fdd5a4"
  };

  return [mockSubmission as Submission];
};

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
      // Extract the submission data from the json property if it exists
      const submissionData = item.json || item;
      
      return {
        submissionid: submissionData.submission_id || submissionData.submissionid || '',
        submission_label: submissionData.submission_label || 'Untitled Submission',
        created_at: submissionData.created_at || submissionData.processed_at || new Date().toISOString(),
        supplierid: submissionData.supplier_id || submissionData.supplierid || '',
        total_batches: submissionData.total_batches || submissionData.summary?.total_batches || 0,
        passed_batches: submissionData.passed_batches || submissionData.summary?.passed_batches || 0,
        failed_batches: submissionData.failed_batches || submissionData.summary?.failed_batches || 0,
        supplier_name: submissionData.supplier_name || 'Unknown Supplier',
        results: submissionData.results ? submissionData.results.map((result: any) => ({
          status: result.status || 'UNKNOWN',
          batch_label: result.batch_label || 'Unknown Batch',
          metrics: {
            detergency: result.metrics?.detergency || 0,
            foaming: result.metrics?.foaming || 0,
            biodegradability: result.metrics?.biodegradability || 0,
            purity: result.metrics?.purity || 0
          },
          failure_reasons: result.failure_reasons || []
        })) : []
      };
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
