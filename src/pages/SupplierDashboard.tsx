
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SupplierSidebar from '@/components/dashboard/SupplierSidebar';
import SupplierHeader from '@/components/dashboard/SupplierHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubmissionsTable from '@/components/dashboard/SubmissionsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock } from 'lucide-react';

const SupplierDashboard = () => {
  const { userRole, supplierStatus } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('submissions');

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

  // If supplier account is pending approval or rejected
  if (supplierStatus !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {supplierStatus === 'pending' ? (
                <>
                  <Clock className="h-5 w-5 text-amber-500" />
                  Account Pending Approval
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Account Registration Rejected
                </>
              )}
            </CardTitle>
            <CardDescription>
              {supplierStatus === 'pending' 
                ? 'Your supplier account is currently under review by our admin team.'
                : 'Unfortunately, your supplier account registration was not approved.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              {supplierStatus === 'pending' 
                ? 'Please check back later or contact support if you have any questions about your application status.'
                : 'If you believe this is an error, please contact our support team for assistance.'}
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/auth')}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            
            {/* Submissions Table Component */}
            <SubmissionsTable submissions={sampleSubmissions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDashboard;
