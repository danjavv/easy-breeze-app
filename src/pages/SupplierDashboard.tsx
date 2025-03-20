import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SupplierSidebar from '@/components/dashboard/SupplierSidebar';
import SupplierHeader from '@/components/dashboard/SupplierHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubmissionsTable from '@/components/dashboard/SubmissionsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, History, ArrowUpRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type SubmissionResult = {
  results: {
    status: string;
    metrics: {
      purity: number;
      foaming: number;
      detergency: number;
      biodegradability?: number;
    };
    batch_label: string;
    failure_reasons?: string[];
  }[];
  summary: {
    total_batches: number;
    failed_batches: number;
    passed_batches: number;
  };
  processed_at: string;
  submission_id: string;
  submission_label: string;
};

const SupplierDashboard = () => {
  const { userRole, supplierID } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeItem, setActiveItem] = useState('submissions');
  const [loading, setLoading] = useState(false);
  const [pastSubmissions, setPastSubmissions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const sampleSubmissions = [
    { 
      id: 'acme-q2-1',
      date: '05/12', 
      label: 'ACME_Q2_1', 
      batches: 5, 
      status: '2 Pass',
      statusColor: 'text-amber-500'
    },
    { 
      id: 'acme-q2-0',
      date: '05/01', 
      label: 'ACME_Q2_0', 
      batches: 3, 
      status: '0 Pass',
      statusColor: 'text-red-500'
    },
  ];

  useEffect(() => {
    console.log("Supplier Dashboard - supplierID from context:", supplierID);
  }, [supplierID]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          return prevProgress < 70 ? prevProgress + 5 : prevProgress;
        });
      }, 300);
      
      return () => {
        clearInterval(interval);
        setProgress(0);
      };
    }
  }, [loading]);

  const fetchPastSubmissions = async () => {
    setLoading(true);
    setError(null);
    setShowSubmissions(true);
    setProgress(10);
    
    console.log('Sending request with supplierID:', supplierID);
    
    try {
      toast({
        title: "Loading Submissions",
        description: "Please wait while we fetch your past submissions...",
      });
      
      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook-test/7e057feb-401a-4110-9fcc-b00817876790', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplierID: supplierID || 'test-supplier-id',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      setProgress(100);
      
      const data = await response.json();
      console.log('Past submissions:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setPastSubmissions(data);
        
        const submissionCount = data.length;
        
        toast({
          title: "Submissions Loaded",
          description: `Found ${submissionCount} submission(s) for your account.`,
        });
      } 
      else if (data.message) {
        setPastSubmissions(sampleSubmissions);
        
        toast({
          title: "Processing Submissions",
          description: data.message,
        });
      } 
      else {
        setPastSubmissions(sampleSubmissions);
        
        toast({
          title: "No Submissions Found",
          description: "No previous submissions were found for your account.",
        });
      }
    } catch (error) {
      console.error('Error fetching past submissions:', error);
      setError('Failed to fetch submissions. Please try again later.');
      setPastSubmissions(sampleSubmissions);
      
      toast({
        title: "Error Loading Submissions",
        description: "There was a problem fetching your submissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleNewSubmission = () => {
    navigate('/new-submission');
  };

  const renderLoadingState = () => (
    <div className="space-y-6">
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Clock className="h-4 w-4 text-blue-500" />
        <AlertTitle>Loading Submissions</AlertTitle>
        <AlertDescription>
          Please wait while we retrieve your past submissions. This may take a moment...
        </AlertDescription>
      </Alert>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2 text-sm">
          <span>Loading progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const supplierName = 'ACME Corporation';
  const activePeriod = 'Q2 2023';
  const deadline = 'June 30, 2023 - 23:59 UTC';

  return (
    <div className="min-h-screen flex bg-background">
      <SupplierSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-1 flex flex-col">
        <SupplierHeader supplierName={supplierName} />
        
        <main className="flex-1 p-6 pt-20 md:pt-6">
          <div className="max-w-6xl mx-auto">
            <DashboardHeader activePeriod={activePeriod} deadline={deadline} />
            
            <div className="mb-6 flex flex-wrap gap-3">
              <Button 
                variant="outline"
                onClick={fetchPastSubmissions}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <History className="h-4 w-4" />
                )}
                {loading ? 'Loading Submissions...' : 'View Past Submissions'}
              </Button>
              
              <Button 
                onClick={handleNewSubmission}
                className="flex items-center gap-2"
              >
                <ArrowUpRight className="h-4 w-4" />
                New Submission
              </Button>
            </div>
            
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {loading && showSubmissions && renderLoadingState()}
            
            {showSubmissions && !loading && (
              <SubmissionsTable 
                submissions={pastSubmissions} 
                isLoading={loading} 
                onRefresh={fetchPastSubmissions}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDashboard;
