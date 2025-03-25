import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";

export interface Detergent {
  id: string;
  name: string;
  detergency: number;
  foaming: number;
  biodegradability: number;
  purity: number;
  created_at: string;
  assigned_model: string;
}

interface DetergentSelectorProps {
  onDetergentSelect: (detergent: Detergent) => void;
}

const DetergentSelector: React.FC<DetergentSelectorProps> = ({ onDetergentSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [assignedDetergent, setAssignedDetergent] = useState<Detergent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { supplierID } = useAuth();

  const handleShowAssignedDetergent = async () => {
    if (!supplierID) {
      setError("No supplier ID found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://danjaved008.app.n8n.cloud/webhook/eb9db3b6-b14a-4449-b569-a9114c7a7173?supplier_id=${supplierID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned detergent');
      }

      const data = await response.json();
      console.log('Response data:', data); // For debugging
      
      if (data && Array.isArray(data) && data.length > 0) {
        const detergent: Detergent = {
          id: data[0].id || '',
          name: data[0].name || '',
          detergency: Number(data[0].detergency) || 0,
          foaming: Number(data[0].foaming) || 0,
          biodegradability: Number(data[0].biodegradability) || 0,
          purity: Number(data[0].purity) || 0,
          created_at: data[0].created_at || '',
          assigned_model: data[0].assigned_model || ''
        };
        
        console.log('Processed detergent:', detergent); // For debugging
        setAssignedDetergent(detergent);
        onDetergentSelect(detergent);
        
        toast.success("Assigned Detergent Loaded", {
          description: `Your assigned detergent is: ${detergent.name}`
        });
      } else {
        setError("No assigned ingredient found");
        setAssignedDetergent(null);
      }
    } catch (error) {
      console.error('Error fetching assigned detergent:', error);
      setError("Failed to load your assigned detergent. Please try again.");
      setAssignedDetergent(null);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={handleShowAssignedDetergent}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader className="animate-spin mr-2" size={18} />
            Loading...
          </>
        ) : (
          'Show Assigned Detergent'
        )}
      </Button>

      {error && (
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {assignedDetergent && (
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
                    <span className="font-medium">{assignedDetergent.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ID</span>
                    <span className="font-medium">{assignedDetergent.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Created At</span>
                    <span className="font-medium">
                      {formatDate(assignedDetergent.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Detergency</span>
                    <span className="font-medium">{assignedDetergent.detergency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Foaming</span>
                    <span className="font-medium">{assignedDetergent.foaming}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Biodegradability</span>
                    <span className="font-medium">{assignedDetergent.biodegradability}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Purity</span>
                    <span className="font-medium">{assignedDetergent.purity}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Assignment Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assigned Model ID</span>
                  <span className="font-medium">{assignedDetergent.assigned_model}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetergentSelector;
