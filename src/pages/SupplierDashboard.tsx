import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SupplierSidebar from '@/components/dashboard/SupplierSidebar';
import SupplierHeader from '@/components/dashboard/SupplierHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubmissionsTable from '@/components/dashboard/SubmissionsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, History } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const SupplierDashboard = () => {
  const { userRole, supplierID } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeItem, setActiveItem] = useState('submissions');
  const [loading, setLoading] = useState(false);
  const [pastSubmissions, setPastSubmissions] = useState<any[]>([]);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Sample data
  const supplierName = 'ACME Corporation';
  const activePeriod = 'Q2 2023';
  const deadline = 'June 30, 2023 - 23:59 UTC';
  
  // Log the supplier ID when the component mounts
  useEffect(() => {
    console.log("Supplier Dashboard - supplierID from context:", supplierID);
  }, [supplierID]);
  
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

  const fetchPastSubmissions = async () => {
    setLoading(true);
    setError(null);
    
    // Log the supplier ID being sent
    console.log('Sending request with supplierID:', supplierID);
    
    try {
      const response = await fetch('https://danjavv.app.n8n.cloud/webhook-test/7e057feb-401a-4110-9fcc-b00817876790', {
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

      const data = await response.json();
      console.log('Past submissions:', data);
      
      // Store the full API response
      setApiResponse(data);
      
      // Update submissions with fetched data or use default if no data
      if (Array.isArray(data) && data.length > 0) {
        setPastSubmissions(data);
      } else if (data.submissions && Array.isArray(data.submissions) && data.submissions.length > 0) {
        // Check if data has a submissions property that is an array
        setPastSubmissions(data.submissions);
      } else {
        // Keep sample data if the API returns no data
        setPastSubmissions(sampleSubmissions);
        
        // Show a toast notification about the response
        toast({
          title: "API Response Received",
          description: "No submissions data found in the response. Showing sample data instead.",
        });
      }
    } catch (error) {
      console.error('Error fetching past submissions:', error);
      setError('Failed to fetch submissions. Please try again later.');
      // Fallback to sample data on error
      setPastSubmissions(sampleSubmissions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Component */}
      <SupplierSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header Component */}
        <SupplierHeader supplierName={supplierName} />
        
        {/* Main content area */}
        <main className="flex-1 p-6 pt-20 md:pt-6">
          <div className="max-w-6xl mx-auto">
            {/* Dashboard Header Component */}
            <DashboardHeader activePeriod={activePeriod} deadline={deadline} />
            
            {/* Past Submissions Button */}
            <div className="mb-6">
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
            </div>
            
            {/* Error message if any */}
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
            
            {/* API Response Display */}
            {apiResponse && !Array.isArray(apiResponse) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">API Response</CardTitle>
                  <CardDescription>Raw data received from the server</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-100 p-4 rounded-md overflow-auto max-h-40 text-xs">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
            
            {/* Submissions Table Component */}
            <SubmissionsTable submissions={pastSubmissions.length > 0 ? pastSubmissions : sampleSubmissions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDashboard;
