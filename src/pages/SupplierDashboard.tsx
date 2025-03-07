import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  FileText, 
  FilePlus, 
  FileCode, 
  User, 
  LogOut, 
  Settings
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SupplierDashboard = () => {
  const { userRole, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('submissions');

  const handleSignOut = () => {
    setUserRole(null);
    navigate('/auth');
  };

  const sampleSubmissions = [
    { 
      date: '05/12', 
      label: 'ACME_Q2_1', 
      batches: 5, 
      status: '2 Pass',
      statusColor: 'text-amber-500'
    },
    { 
      date: '05/01', 
      label: 'ACME_Q2_0', 
      batches: 3, 
      status: '0 Pass',
      statusColor: 'text-red-500'
    },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card hidden md:block">
        <div className="p-4 flex items-center justify-center">
          <span className="mr-1 text-2xl">●</span>
          <span className="text-xl font-semibold">SilentSource</span>
        </div>
        
        <div className="p-2">
          <nav className="space-y-1">
            <button 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeItem === 'submissions' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
              onClick={() => setActiveItem('submissions')}
            >
              <FileText className="h-5 w-5" />
              <span>My Submissions</span>
            </button>
            
            <button 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeItem === 'new' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
              onClick={() => setActiveItem('new')}
            >
              <FilePlus className="h-5 w-5" />
              <span>New Submission</span>
            </button>
            
            <button 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeItem === 'templates' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
              onClick={() => setActiveItem('templates')}
            >
              <FileCode className="h-5 w-5" />
              <span>Templates</span>
            </button>
            
            <button 
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeItem === 'account' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
              onClick={() => setActiveItem('account')}
            >
              <User className="h-5 w-5" />
              <span>Account</span>
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-8 left-0 w-64 p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
      
      {/* Mobile header - only shown on small screens */}
      <div className="fixed top-0 left-0 right-0 h-14 border-b bg-card z-10 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center">
          <span className="mr-1 text-xl">●</span>
          <span className="font-semibold">SilentSource</span>
        </div>
        <Button variant="outline" size="icon" onClick={() => {/* Toggle mobile menu */}}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between sticky top-0 z-10 md:border-none">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="relative">
              <button className="inline-flex items-center justify-between rounded-md border border-input px-3 py-2 text-sm font-medium bg-background hover:bg-accent">
                <span className="text-muted-foreground mr-1">Supplier:</span> 
                <span>ACME Corporation</span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            <Button size="sm" variant="outline" onClick={handleSignOut} className="ml-2">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 p-6 pt-20 md:pt-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
                <div className="flex items-center mt-2">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
                    Active Period: Q2 2023
                  </div>
                  <div className="ml-3 text-sm text-muted-foreground">
                    Deadline: June 30, 2023 - 23:59 UTC
                  </div>
                </div>
              </div>
              
              <Button size="default" className="mt-4 md:mt-0">
                <FilePlus className="mr-2 h-4 w-4" />
                New Submission
              </Button>
            </div>
            
            <div className="bg-card rounded-md border shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Your Submissions</h2>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Batches</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleSubmissions.map((submission, index) => (
                      <TableRow key={index}>
                        <TableCell>{submission.date}</TableCell>
                        <TableCell className="font-medium">{submission.label}</TableCell>
                        <TableCell>{submission.batches}</TableCell>
                        <TableCell className={submission.statusColor}>{submission.status}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDashboard;
