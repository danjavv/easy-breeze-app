
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Eye, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';

type BatchMetrics = {
  detergency: number;
  foaming: number;
  biodegradability: number;
  purity: number;
};

type BatchResult = {
  batch_label: string;
  status: 'PASS' | 'FAIL';
  metrics: BatchMetrics;
  failure_reasons?: string[];
};

type SubmissionData = {
  submission_id: string;
  submission_label: string;
  processed_at: string;
  summary: {
    total_batches: number;
    passed_batches: number;
    failed_batches: number;
  };
  results: BatchResult[];
};

const SubmissionResults = () => {
  const navigate = useNavigate();
  const { submissionId } = useParams();
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubmissionData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get results from sessionStorage first
        const storedResults = sessionStorage.getItem('submissionResults');
        
        if (storedResults) {
          const parsedResults = JSON.parse(storedResults);
          if (Array.isArray(parsedResults) && parsedResults.length > 0) {
            // Find the specific submission if submissionId is provided
            const resultToUse = submissionId && submissionId !== 'latest' 
              ? parsedResults.find(r => r.submission_id === submissionId) || parsedResults[0]
              : parsedResults[0];
              
            setSubmissionData(resultToUse);
            sessionStorage.removeItem('submissionResults'); // Clear after use
            return;
          }
        }
        
        // If no stored results or the submission ID doesn't match, display fallback data
        setSubmissionData({
          submission_id: "123",
          submission_label: "ACME_Q2_Batch_2",
          processed_at: "2025-03-12T10:04:39.445Z",
          summary: {
            total_batches: 5,
            passed_batches: 2,
            failed_batches: 3
          },
          results: [
            {
              batch_label: "ACME_LAS_001",
              status: "FAIL",
              metrics: {
                detergency: 520,
                foaming: 315,
                biodegradability: 160,
                purity: 5
              },
              failure_reasons: [
                "Biodegradability (160 < required 600)",
                "Purity (5 < required 60)"
              ]
            },
            {
              batch_label: "ACME_LAS_002",
              status: "FAIL",
              metrics: {
                detergency: 1040,
                foaming: 735,
                biodegradability: 480,
                purity: 25
              },
              failure_reasons: [
                "Biodegradability (480 < required 600)",
                "Purity (25 < required 60)"
              ]
            },
            {
              batch_label: "ACME_LAS_003",
              status: "FAIL",
              metrics: {
                detergency: 1560,
                foaming: 1155,
                biodegradability: 800,
                purity: 45
              },
              failure_reasons: [
                "Purity (45 < required 60)"
              ]
            },
            {
              batch_label: "ACME_LAS_004",
              status: "PASS",
              metrics: {
                detergency: 2080,
                foaming: 1575,
                biodegradability: 1120,
                purity: 65
              }
            },
            {
              batch_label: "ACME_LAS_005",
              status: "PASS",
              metrics: {
                detergency: 2600,
                foaming: 1995,
                biodegradability: 1440,
                purity: 85
              }
            }
          ]
        });
        
        toast.info("Using sample data", {
          description: "No submission data found. Displaying sample results."
        });
      } catch (error) {
        console.error('Error loading submission data:', error);
        setError('Failed to load submission results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSubmissionData();
  }, [submissionId]);

  const toggleBatchDetails = (batchId: string) => {
    if (expandedBatch === batchId) {
      setExpandedBatch(null);
    } else {
      setExpandedBatch(batchId);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h3 className="text-xl font-medium">Loading submission results...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/supplier-dashboard')} 
            className="mb-6"
          >
            Back to Dashboard
          </Button>
          
          <Card className="w-full shadow-md">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                <h3 className="text-xl font-medium">Error Loading Results</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!submissionData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/supplier-dashboard')} 
            className="mb-6"
          >
            Back to Dashboard
          </Button>
          
          <Card className="w-full shadow-md">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                <h3 className="text-xl font-medium">No Submission Data</h3>
                <p className="text-muted-foreground">Could not find any submission results. Please try submitting your data again.</p>
                <Button 
                  onClick={() => navigate('/new-submission')}
                  className="mt-4"
                >
                  New Submission
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate('/supplier-dashboard')} 
          className="mb-6"
        >
          Back to Dashboard
        </Button>
        
        <Card className="w-full shadow-md animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-2xl">{submissionData.submission_label}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                Submitted: {formatDate(submissionData.processed_at)}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <h4 className="text-sm text-muted-foreground mb-1">Total Batches</h4>
                  <p className="text-2xl font-bold">{submissionData.summary.total_batches}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <h4 className="text-sm text-green-700 mb-1">Passed Batches</h4>
                  <p className="text-2xl font-bold text-green-700">{submissionData.summary.passed_batches}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50">
                <CardContent className="p-4 text-center">
                  <h4 className="text-sm text-red-700 mb-1">Failed Batches</h4>
                  <p className="text-2xl font-bold text-red-700">{submissionData.summary.failed_batches}</p>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Batch Results</h3>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Detergency</TableHead>
                    <TableHead>Foaming</TableHead>
                    <TableHead>Biodegradability</TableHead>
                    <TableHead>Purity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionData.results.map((batch) => (
                    <TableRow key={batch.batch_label} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{batch.batch_label}</TableCell>
                      <TableCell>
                        {batch.status === 'PASS' ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" /> PASS
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-1" /> FAIL
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{batch.metrics.detergency}</TableCell>
                      <TableCell>{batch.metrics.foaming}</TableCell>
                      <TableCell>{batch.metrics.biodegradability}</TableCell>
                      <TableCell>{batch.metrics.purity}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleBatchDetails(batch.batch_label)}
                          className="p-1 h-8 w-8"
                        >
                          {expandedBatch === batch.batch_label ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {expandedBatch && (
              <div className="mt-4 p-4 border rounded-md bg-muted/30 animate-fade-in">
                <h4 className="text-md font-medium mb-2">
                  {expandedBatch} Details
                </h4>
                
                {submissionData.results.find(batch => batch.batch_label === expandedBatch)?.status === 'FAIL' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700 mb-4">
                    <p className="font-medium">This batch failed to meet the following criteria:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {submissionData.results
                        .find(batch => batch.batch_label === expandedBatch)
                        ?.failure_reasons?.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))
                      }
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(submissionData.results.find(batch => batch.batch_label === expandedBatch)?.metrics || {}).map(([key, value]) => (
                    <div key={key} className="p-3 bg-background rounded-md border">
                      <div className="text-sm text-muted-foreground capitalize mb-1">{key}</div>
                      <div className="text-lg font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionResults;
