
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

interface Ingredient {
  id: string;
  name: string;
  detergency?: number | null;
  foaming?: number | null;
  biodegrability?: number | null;
  purity?: number | null;
  created_at?: string;
}

const AdminIngredientModels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [configName, setConfigName] = useState('Model 1');
  const [isActive, setIsActive] = useState(false);
  
  // State for base values
  const [baseValues, setBaseValues] = useState({
    detergency: 320,
    foaming: 250,
    biodegradability: 500,
    purity: 40,
  });

  // State for threshold values
  const [thresholdValues, setThresholdValues] = useState({
    detergency: 500,
    foaming: 300,
    biodegradability: 600,
    purity: 60,
  });

  // Fetch ingredients from Supabase on component mount
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
        
        // Check if ingredients were passed via location state
        if (location.state?.ingredients && location.state.ingredients.length > 0) {
          setIngredients(location.state.ingredients);
        } else {
          // If not, fetch from Supabase
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

  const handleBaseValueChange = (key: keyof typeof baseValues, value: string) => {
    setBaseValues(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleThresholdValueChange = (key: keyof typeof thresholdValues, value: string) => {
    setThresholdValues(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare model data
      const modelData = {
        name: configName,
        detergency: baseValues.detergency,
        foaming: baseValues.foaming,
        biodegrability: baseValues.biodegradability,
        purity: baseValues.purity
      };

      // Save to Supabase
      const { error } = await supabase
        .from('ingredients')
        .insert(modelData);

      if (error) {
        throw error;
      }

      toast.success('Ingredient model saved successfully');
      if (isActive) {
        toast.info('Model set as active');
      }
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error saving model:', error);
      toast.error('Failed to save model');
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
            <CardTitle className="text-2xl">Ingredient Model</CardTitle>
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
                <h3 className="text-lg font-medium">Base Values</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Property</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(baseValues).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium capitalize">{key}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Input 
                              type="number"
                              value={value}
                              onChange={(e) => handleBaseValueChange(key as keyof typeof baseValues, e.target.value)}
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
      </main>
    </div>
  );
};

export default AdminIngredientModels;
