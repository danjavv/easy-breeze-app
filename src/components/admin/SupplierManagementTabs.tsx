
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import AddSupplierForm from './AddSupplierForm';
import AssignSupplierForm from './AssignSupplierForm';
import SupplierList from './SupplierList';
import { Supplier } from './SupplierList';

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

  return (
    <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="add">Add Supplier</TabsTrigger>
        <TabsTrigger value="assign">Assign Supplier</TabsTrigger>
        <TabsTrigger value="delete">Delete Supplier</TabsTrigger>
      </TabsList>
      
      <TabsContent value="add" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <AddSupplierForm onAddSupplier={onAddSupplier} onSuccess={() => setActiveTab('delete')} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="assign" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <AssignSupplierForm suppliers={suppliers} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="delete" className="space-y-4">
        <Card>
          <CardContent className="pt-6 pb-2">
            <h3 className="text-lg font-medium mb-4">Delete Supplier</h3>
            <SupplierList 
              suppliers={suppliers} 
              isLoading={false}
              error={null}
              isMockData={false}
              onViewSupplier={() => {}}
              onDeleteSupplier={(supplier, e) => {
                e.stopPropagation();
                onDelete(supplier.id);
              }}
              onRetry={() => {}}
              showDeleteOnly={true}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SupplierManagementTabs;
