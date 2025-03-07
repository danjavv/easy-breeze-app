
import { useState } from 'react';
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
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Eye } from 'lucide-react';

type BatchResult = {
  id: string;
  status: 'pass' | 'fail';
  details?: {
    criteria: string;
    actual: string;
    required: string;
    pass: boolean;
  }[];
};

const SubmissionResults = () => {
  const navigate = useNavigate();
  const { submissionId } = useParams();
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  // Sample data for demonstration
  const submissionData = {
    label: 'ACME_Q2_Batch_2',
    timestamp: 'May 12, 2023 14:32 UTC',
    batches: [
      {
        id: 'ACME_001',
        status: 'pass' as const,
        details: [
          { criteria: 'Purity', actual: '65.4%', required: '≥ 60%', pass: true },
          { criteria: 'Foaming', actual: '315', required: '≥ 300', pass: true },
          { criteria: 'pH Level', actual: '7.2', required: '6.8-7.5', pass: true },
        ],
      },
      {
        id: 'ACME_002',
        status: 'fail' as const,
        details: [
          { criteria: 'Purity', actual: '58.7%', required: '≥ 60%', pass: false },
          { criteria: 'Foaming', actual: '298', required: '≥ 300', pass: false },
          { criteria: 'pH Level', actual: '7.1', required: '6.8-7.5', pass: true },
        ],
      },
      {
        id: 'ACME_003',
        status: 'pass' as const,
        details: [
          { criteria: 'Purity', actual: '67.2%', required: '≥ 60%', pass: true },
          { criteria: 'Foaming', actual: '345', required: '≥ 300', pass: true },
          { criteria: 'pH Level', actual: '7.3', required: '6.8-7.5', pass: true },
        ],
      },
      {
        id: 'ACME_004',
        status: 'fail' as const,
        details: [
          { criteria: 'Purity', actual: '61.3%', required: '≥ 60%', pass: true },
          { criteria: 'Foaming', actual: '290', required: '≥ 300', pass: false },
          { criteria: 'pH Level', actual: '7.8', required: '6.8-7.5', pass: false },
        ],
      },
    ] as BatchResult[],
  };

  const toggleBatchDetails = (batchId: string) => {
    if (expandedBatch === batchId) {
      setExpandedBatch(null);
    } else {
      setExpandedBatch(batchId);
    }
  };

  const handleViewMetrics = (batchId: string) => {
    // In a real app, this would navigate to a metrics page for the specific batch
    console.log(`View metrics for batch ${batchId}`);
  };

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
              <CardTitle className="text-2xl">{submissionData.label}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                Submitted: {submissionData.timestamp}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Metrics</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionData.batches.map((batch) => (
                    <TableRow key={batch.id} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell>
                        {batch.status === 'pass' ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" /> PASS
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-1" /> FAIL
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleBatchDetails(batch.id)}
                          className="p-1 h-8 w-8"
                        >
                          {expandedBatch === batch.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewMetrics(batch.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
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
                
                <div className="space-y-2">
                  {submissionData.batches
                    .find(batch => batch.id === expandedBatch)
                    ?.details?.map((detail, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm p-2 rounded-md bg-background">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          detail.pass ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {detail.pass ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">{detail.criteria}</div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          detail.pass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {detail.actual}
                        </div>
                        <div className="text-muted-foreground">
                          Required: {detail.required}
                        </div>
                      </div>
                    ))
                  }
                </div>
                
                {submissionData.batches.find(batch => batch.id === expandedBatch)?.status === 'fail' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
                    <p className="font-medium">This batch failed to meet the following criteria:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {submissionData.batches
                        .find(batch => batch.id === expandedBatch)
                        ?.details
                        ?.filter(detail => !detail.pass)
                        .map((failure, index) => (
                          <li key={index}>
                            {failure.criteria} ({failure.actual} &lt; required {failure.required})
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionResults;
