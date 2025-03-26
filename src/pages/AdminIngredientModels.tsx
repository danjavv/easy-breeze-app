import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ModelAssignmentSection from '@/components/admin/ModelAssignmentSection';

interface Ingredient {
  id: string;
  name: string;
  detergency?: number | null;
  foaming?: number | null;
  biodegradability?: number | null;
  purity?: number | null;
  created_at?: string;
}

interface WebhookResponse {
  id?: string;
  name?: string;
  threshold_detergency?: number | null;
  threshold_foaming?: number | null;
  threshold_biodegradability?: number | null;
  threshold_purity?: number | null;
  scale_detergency?: number | null;
  scale_foaming?: number | null;
  scale_biodegradability?: number | null;
  scale_purity?: number | null;
  created_at?: string;
}

const AdminIngredientModels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [configName, setConfigName] = useState('Model 1');
  const [isActive, setIsActive] = useState(false);
  const [thresholdValues, setThresholdValues] = useState({
    detergency: 500,
    foaming: 300,
    biodegradability: 600,
    purity: 60,
  });
  const [scaleValues, setScaleValues] = useState({
    detergency: 1,
    foaming: 1,
    biodegradability: 1,
    purity: 1,
  });

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
        
        if (location.state?.ingredients && location.state.ingredients.length > 0) {
          setIngredients(location.state.ingredients);
        } else {
          const { data, error } = await supabase
            .from('ingredients')
            .select('*');
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setIngredients(data);
          }
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        toast.error('Failed to fetch ingredients');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIngredients();
  }, [location.state]);

  const handleThresholdValueChange = (key: keyof typeof thresholdValues, value: string) => {
    setThresholdValues(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleScaleValueChange = (key: keyof typeof scaleValues, value: string) => {
    setScaleValues(prev => ({
      ...prev,
      [key]: parseInt(value) || 1
    }));
  };

  const handleSave = async () => {
    try {
      const webhookData = {
        name: configName,
        thresholds: {
          detergency: thresholdValues.detergency,
          foaming: thresholdValues.foaming,
          biodegradability: thresholdValues.biodegradability,
          purity: thresholdValues.purity
        },
        scales: {
          detergency: scaleValues.detergency,
          foaming: scaleValues.foaming,
          biodegradability: scaleValues.biodegradability,
          purity: scaleValues.purity
        },
        isActive: isActive
      };

      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook/9ec560b0-44db-4f4f-84e3-bb1b4f9acb82', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        try {
          const responseData: WebhookResponse = await response.json();
          
          if (responseData && responseData.id) {
            console.log('Webhook response:', responseData);
            
            const { error } = await supabase
              .from('models')
              .insert({
                name: configName,
                threshold_detergency: thresholdValues.detergency,
                threshold_foaming: thresholdValues.foaming,
                threshold_biodegrability: thresholdValues.biodegradability,
                threshold_purity: thresholdValues.purity,
                scale_detergency: scaleValues.detergency,
                scale_foaming: scaleValues.foaming,
                scale_biodegradability: scaleValues.biodegradability,
                scale_purity: scaleValues.purity
              });

            if (error) {
              console.error('Supabase error:', error);
            }

            toast.success('Ingredient model saved successfully');
            if (isActive) {
              toast.info('Model set as active');
            }
            navigate('/admin-dashboard');
          } else {
            toast.error('Invalid response from server');
            console.error('Invalid webhook response:', responseData);
          }
        } catch (jsonError) {
          toast.error('Failed to parse server response');
          console.error('JSON parsing error:', jsonError);
        }
      } else {
        toast.error('Failed to save configuration');
        console.error('Failed to save configuration:', await response.text());
      }
    } catch (error) {
      toast.error('Error saving configuration');
      console.error('Error saving configuration:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-xl font-medium flex items-center">
              <span className="mr-1 text-2xl">●</span>
              <span className="font-semibold">Essence</span>
            </a>
            <span className="ml-4 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              Admin Dashboard
            </span>
          </div>
          <Select defaultValue="admin">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Admin: John Doe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin: John Doe</SelectItem>
              <SelectItem value="profile">Profile</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => navigate('/admin-dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="config-name">Name</Label>
                <Input 
                  id="config-name"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pass/Fail Thresholds</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Property</TableHead>
                      <TableHead>Required Minimum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(thresholdValues).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium capitalize">{key}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Input 
                              type="number"
                              value={value}
                              onChange={(e) => handleThresholdValueChange(key as keyof typeof thresholdValues, e.target.value)}
                              className="w-[120px]"
                            />
                            {key === 'purity' && <span className="ml-2">%</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Scaling Factors</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust how each parameter contributes to the overall score. Higher values mean greater impact.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Property</TableHead>
                      <TableHead>Scale Factor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(scaleValues).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium capitalize">{key}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Input 
                              type="number"
                              step="1"
                              min="1"
                              value={value}
                              onChange={(e) => handleScaleValueChange(key as keyof typeof scaleValues, e.target.value)}
                              className="w-[120px]"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="active" 
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked as boolean)}
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Set as Active
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <ModelAssignmentSection />
      </main>
    </div>
  );
};

export default AdminIngredientModels;
