
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SupplierSidebar from '@/components/dashboard/SupplierSidebar';
import SupplierHeader from '@/components/dashboard/SupplierHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubmissionsTable from '@/components/dashboard/SubmissionsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, History } from 'lucide-react';

const SupplierDashboard = () => {
  const { userRole, supplierID } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('submissions');
  const [loading, setLoading] = useState(false);
  const [pastSubmissions, setPastSubmissions] = useState<any[]>([]);
  
  // Sample data
  const supplierName = 'ACME Corporation';
  const activePeriod = 'Q2 2023';
  const deadline = 'June 30, 2023 - 23:59 UTC';
  
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
      
      // Update submissions with fetched data or use default if no data
      if (Array.isArray(data) && data.length > 0) {
        setPastSubmissions(data);
      } else {
        // Keep sample data if the API returns no data
        setPastSubmissions(sampleSubmissions);
      }
    } catch (error) {
      console.error('Error fetching past submissions:', error);
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
            
            {/* Submissions Table Component */}
            <SubmissionsTable submissions={pastSubmissions.length > 0 ? pastSubmissions : sampleSubmissions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDashboard;
