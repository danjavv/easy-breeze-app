
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

export interface Detergent {
  id: string;
  name: string;
}

interface DetergentSelectorProps {
  onDetergentSelect: (detergent: Detergent | null) => void;
}

const DetergentSelector: React.FC<DetergentSelectorProps> = ({ onDetergentSelect }) => {
  const [detergents, setDetergents] = useState<Detergent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWebhook, setIsLoadingWebhook] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetergent, setSelectedDetergent] = useState<string | null>(null);

  useEffect(() => {
    fetchDetergents();
  }, []);

  const fetchDetergents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, name')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setDetergents(data);
      }
    } catch (error) {
      console.error('Error fetching detergents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDetergentsFromWebhook = async () => {
    setIsLoadingWebhook(true);
    try {
      const response = await fetch('https://danjaved008.app.n8n.cloud/webhook-test/b65a9a50-5a55-462a-a29b-7f6572aa2dcc');
      
      if (!response.ok) {
        throw new Error('Failed to fetch detergents from webhook');
      }
      
      let data = await response.json();
      
      // Handle if the data isn't an array (e.g., if it's a single object)
      if (!Array.isArray(data)) {
        // If it's a single object, convert it to an array
        if (data && typeof data === 'object') {
          data = [data];
        } else {
          data = [];
        }
      }
      
      if (data.length > 0) {
        // Process and save the detergents data
        const formattedDetergents = data.map((item: any) => ({
          id: item.id || `detergent-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name || 'Unknown Detergent'
        }));
        
        setDetergents(formattedDetergents);
        
        toast.success("Detergents Loaded", {
          description: `Successfully loaded ${formattedDetergents.length} detergents from external source.`
        });
      } else {
        toast.error("No Detergents Found", {
          description: "The webhook didn't return any detergent data."
        });
      }
    } catch (error) {
      console.error('Error loading detergents from webhook:', error);
      toast.error("Failed to Load Detergents", {
        description: "Could not fetch detergents from the external source. Please try again."
      });
    } finally {
      setIsLoadingWebhook(false);
    }
  };

  const filteredDetergents = searchQuery 
    ? detergents.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : detergents;

  const handleSelect = (value: string) => {
    setSelectedDetergent(value);
    const selected = detergents.find(d => d.id === value) || null;
    onDetergentSelect(selected);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={loadDetergentsFromWebhook}
          className="mb-2"
          disabled={isLoadingWebhook}
        >
          <Download className="mr-2 h-4 w-4" />
          {isLoadingWebhook ? 'Loading...' : 'Load Detergents'}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="detergent-search">Search Detergents</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="detergent-search"
            type="search"
            placeholder="Search by name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="detergent-select">Select Detergent</Label>
        <Select 
          value={selectedDetergent || ""} 
          onValueChange={handleSelect}
          disabled={isLoading}
        >
          <SelectTrigger id="detergent-select" className="w-full">
            <SelectValue placeholder="Select a detergent" />
          </SelectTrigger>
          <SelectContent>
            {filteredDetergents.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {isLoading ? "Loading..." : "No detergents found"}
              </div>
            ) : (
              filteredDetergents.map((detergent) => (
                <SelectItem key={detergent.id} value={detergent.id}>
                  {detergent.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DetergentSelector;
