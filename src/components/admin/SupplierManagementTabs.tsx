import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import AddSupplierForm from './AddSupplierForm';
import SupplierList from './SupplierList';
import { Supplier } from './SupplierList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';

interface SupplierManagementTabsProps {
  suppliers: Supplier[];
  onClose: () => void;
  onDelete: (supplierId: string) => void;
  onAddSupplier: (newSupplier: Omit<Supplier, 'id' | 'created_at'>) => void;
}

const SupplierManagementTabs: React.FC<SupplierManagementTabsProps> = ({
  suppliers,
  onClose,
  onDelete,
  onAddSupplier
}) => {
  const [activeTab, setActiveTab] = useState('add');
  const [loadedSuppliers, setLoadedSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadSuppliers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook/944a3d31-08ac-4446-9c67-9e543a85aa40', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load suppliers: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Raw API response:', responseText);
      
      // Parse the response text manually to handle potential issues
      let rawData;
      try {
        rawData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      // Ensure we're working with an array
      let suppliersArray = [];
      
      if (Array.isArray(rawData)) {
        suppliersArray = rawData;
      } else if (typeof rawData === 'object' && rawData !== null) {
        // Check if it's a single object with numeric keys (which would indicate an object map of suppliers)
        const keys = Object.keys(rawData);
        if (keys.length > 0 && keys.some(key => !isNaN(Number(key)))) {
          // This appears to be an object map with numeric keys, convert to array
          suppliersArray = Object.values(rawData);
        } else {
          // It's a single supplier object
          suppliersArray = [rawData];
        }
      }
      
      console.log('Suppliers array after conversion:', suppliersArray);
      
      // Transform the data into the Supplier format
      const formattedSuppliers = suppliersArray.map((supplier: any) => ({
        id: supplier.id || supplier.supplierID || crypto.randomUUID(),
        company_name: supplier.company_name || supplier.companyName || 'Unknown Company',
        email: supplier.email || 'no-email@example.com',
        status: (supplier.status || 'Pending').replace(/"/g, ''), // Remove extra quotes if present
        created_at: supplier.created_at || new Date().toISOString(),
      }));
      
      console.log('Formatted suppliers:', formattedSuppliers);
      setLoadedSuppliers(formattedSuppliers);
      
      toast({
        title: "Suppliers Loaded",
        description: `Successfully loaded ${formattedSuppliers.length} suppliers.`,
      });
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setError(error instanceof Error ? error.message : 'Failed to load suppliers');
      
      toast({
        title: "Failed to Load Suppliers",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-1 mb-4">
        <TabsTrigger value="add">Add Supplier</TabsTrigger>
      </TabsList>
      
      <TabsContent value="add" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <AddSupplierForm onAddSupplier={onAddSupplier} onSuccess={() => {}} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SupplierManagementTabs;
