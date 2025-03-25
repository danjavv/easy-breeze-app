import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SupplierSidebar from '@/components/dashboard/SupplierSidebar';
import SupplierHeader from '@/components/dashboard/SupplierHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubmissionsTable from '@/components/dashboard/SubmissionsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, History, ArrowUpRight, FileText, Info, Loader } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

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
  const [isLoadingIngredient, setIsLoadingIngredient] = useState(false);
  const [assignedIngredient, setAssignedIngredient] = useState<any>(null);
  const [ingredientError, setIngredientError] = useState<string | null>(null);
  const [isLoadingSupplierDetails, setIsLoadingSupplierDetails] = useState(false);
  const [supplierDetailsError, setSupplierDetailsError] = useState<string | null>(null);
  const [supplierDetails, setSupplierDetails] = useState<any[]>([]);
  
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
    
    try {
      const response = await fetch(`https://danjaved008.app.n8n.cloud/webhook/944a3d31-08ac-4446-9c67-9e543a85aa40/submissions/${supplierID}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch past submissions');
      }
      
      const data = await response.json();
      setPastSubmissions(data);
      setShowSubmissions(true);
      
      toast({
        title: "Success",
        description: "Past submissions loaded successfully",
      });
    } catch (error: any) {
      console.error('Error fetching past submissions:', error);
      setError(error.message || 'Failed to fetch past submissions');
      toast({
        title: "Error",
        description: "Failed to load past submissions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewSubmission = () => {
    navigate('/new-submission');
  };

  const handleShowAssignedIngredient = async () => {
    if (!supplierID) {
      setIngredientError("No supplier ID found. Please log in again.");
      return;
    }

    setIsLoadingIngredient(true);
    setIngredientError(null);
    
    try {
      const response = await fetch(`https://danjaved008.app.n8n.cloud/webhook/eb9db3b6-b14a-4449-b569-a9114c7a7173?supplier_id=${supplierID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned ingredient');
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (Array.isArray(data) && data.length > 0 && data[0].json) {
        const ingredient = data[0].json;
        console.log('Processing ingredient:', ingredient);
        
        const processedIngredient = {
          id: ingredient.id || '',
          name: ingredient.name || '',
          detergency: Number(ingredient.detergency) || 0,
          foaming: Number(ingredient.foaming) || 0,
          biodegradability: Number(ingredient.biodegradability) || 0,
          purity: Number(ingredient.purity) || 0,
          created_at: ingredient.created_at || '',
          assigned_model: ingredient.assigned_model || ''
        };
        
        console.log('Processed ingredient:', processedIngredient);
        setAssignedIngredient(processedIngredient);
        
        toast({
          title: "Success",
          description: `Your assigned ingredient is: ${processedIngredient.name}`
        });
      } else {
        console.log('No ingredient data found in response:', data);
        setIngredientError("No assigned ingredient found");
        setAssignedIngredient(null);
      }
    } catch (error) {
      console.error('Error fetching assigned ingredient:', error);
      setIngredientError("Failed to load your assigned ingredient. Please try again.");
      setAssignedIngredient(null);
    } finally {
      setIsLoadingIngredient(false);
    }
  };

  const handleViewSupplierDetails = async () => {
    if (!supplierID) {
      setSupplierDetailsError("No supplier ID found. Please log in again.");
      return;
    }

    setIsLoadingSupplierDetails(true);
    setSupplierDetailsError(null);
    
    try {
      const response = await fetch(`https://danjaved008.app.n8n.cloud/webhook/a1ee9fc5-d63b-4b43-a304-8341d698134c?supplier_id=${supplierID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch supplier details');
      }

      const data = await response.json();
      console.log('Supplier details response:', data);
      
      if (Array.isArray(data) && data.length > 0 && data[0].json) {
        const supplierData = data[0].json;
        setSupplierDetails([supplierData]);
        toast({
          title: "Success",
          description: "Supplier details retrieved successfully"
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching supplier details:', error);
      setSupplierDetailsError("Failed to load supplier details. Please try again.");
      setSupplierDetails([]);
      toast({
        title: "Error",
        description: "Failed to load supplier details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSupplierDetails(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
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

  const supplierName = "ACME Chemicals";
  const activePeriod = "Q2 2024";
  const deadline = "June 30, 2024";

  return (
    <div className="min-h-screen flex bg-background">
      <SupplierSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-1 flex flex-col">
        <SupplierHeader supplierName={supplierName} />
        
        <main className="flex-1 p-6 pt-20 md:pt-6">
          <div className="max-w-6xl mx-auto">
            <DashboardHeader activePeriod={activePeriod} deadline={deadline} />
            
            <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
              <Card className="border-l-4 border-l-blue-400 hover:shadow-md transition-all duration-300 md:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-600 border-blue-200">Q2</Badge>
                    Current Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Window</p>
                      <p className="font-medium">May 1 - June 30</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-400 hover:shadow-md transition-all duration-300 md:col-span-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Badge variant="outline" className="mr-2 bg-purple-50 text-purple-600 border-purple-200">👤</Badge>
                    Supplier Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewSupplierDetails}
                        disabled={isLoadingSupplierDetails}
                        className="w-full"
                      >
                        {isLoadingSupplierDetails ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'View Supplier Details'
                        )}
                      </Button>
                      {supplierDetailsError && (
                        <p className="text-sm text-destructive mt-2">{supplierDetailsError}</p>
                      )}
                      {supplierDetails.length > 0 && (
                        <div className="mt-4 space-y-4">
                          <h4 className="text-sm font-medium">Supplier Details:</h4>
                          {supplierDetails.map((detail, index) => (
                            <div key={index} className="bg-muted/30 p-4 rounded-lg space-y-3">
                              {Object.entries(detail).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground capitalize">
                                    {key.replace(/_/g, ' ')}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {typeof value === 'object' 
                                      ? JSON.stringify(value, null, 2)
                                      : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center ml-4">
                      <span className="text-purple-600 text-sm font-medium">SC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-400 hover:shadow-md transition-all duration-300 md:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-50 text-green-600 border-green-200">✓</Badge>
                    Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Your Submissions</p>
                      <p className="font-medium">{pastSubmissions.length || 0} this period</p>
                    </div>
                    <button 
                      onClick={fetchPastSubmissions}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      <History className="h-6 w-6" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Assigned Ingredient Section */}
            <div className="mb-6">
              <Button
                type="button"
                onClick={handleShowAssignedIngredient}
                disabled={isLoadingIngredient}
                className="w-full mb-4"
              >
                {isLoadingIngredient ? (
                  <>
                    <Loader className="animate-spin mr-2" size={18} />
                    Loading...
                  </>
                ) : (
                  'Show Assigned Ingredient'
                )}
              </Button>

              {ingredientError && (
                <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 mb-4">
                  <AlertCircle size={18} />
                  <span>{ingredientError}</span>
                </div>
              )}

              {assignedIngredient && (
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="text-primary" size={20} />
                    <h3 className="text-lg font-semibold">Assigned Ingredient Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Basic Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Name</span>
                            <span className="font-medium">{assignedIngredient.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">ID</span>
                            <span className="font-medium">{assignedIngredient.id}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Created At</span>
                            <span className="font-medium">
                              {formatDate(assignedIngredient.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Performance Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Detergency</span>
                            <span className="font-medium">{assignedIngredient.detergency}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Foaming</span>
                            <span className="font-medium">{assignedIngredient.foaming}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Biodegradability</span>
                            <span className="font-medium">{assignedIngredient.biodegradability}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Purity</span>
                            <span className="font-medium">{assignedIngredient.purity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Assignment Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Assigned Model ID</span>
                          <span className="font-medium">{assignedIngredient.assigned_model}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6 flex flex-wrap gap-3">
              <Button 
                variant="outline"
                onClick={fetchPastSubmissions}
                disabled={loading}
                className="flex items-center gap-2 transition-all duration-300 hover:bg-secondary"
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
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300"
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
            
            {showSubmissions && !loading && !error && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Past Submissions</h2>
                {pastSubmissions.length > 0 ? (
                  <div className="bg-card rounded-lg shadow">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left p-4 text-sm font-medium">Date</th>
                          <th className="text-left p-4 text-sm font-medium">Label</th>
                          <th className="text-left p-4 text-sm font-medium">Batches</th>
                          <th className="text-left p-4 text-sm font-medium">Status</th>
                          <th className="text-left p-4 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastSubmissions.map((submission) => (
                          <tr key={submission.id} className="border-b border-border/50 last:border-0">
                            <td className="p-4 text-sm">{submission.date}</td>
                            <td className="p-4 text-sm font-medium">{submission.label}</td>
                            <td className="p-4 text-sm">{submission.batches}</td>
                            <td className="p-4 text-sm">
                              <span className={submission.statusColor}>{submission.status}</span>
                            </td>
                            <td className="p-4 text-sm">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => navigate(`/submission-results/${submission.id}`)}
                              >
                                View Details
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No submissions found for this period
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDashboard;
