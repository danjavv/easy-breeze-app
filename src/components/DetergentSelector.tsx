import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { fetchFromWebhook, processWebhookIngredients } from '@/utils/webhookUtils';

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
      const webhookData = await fetchFromWebhook('https://danjaved008.app.n8n.cloud/webhook-test/b65a9a50-5a55-462a-a29b-7f6572aa2dcc');
      
      const formattedDetergents = processWebhookIngredients(webhookData);
      
      if (formattedDetergents.length > 0) {
        setDetergents(formattedDetergents);
        
        toast.success("Detergents Loaded", {
          description: `Successfully loaded ${formattedDetergents.length} detergents from external source.`
        });

        // Also save to Supabase
        for (const detergent of formattedDetergents) {
          const { error } = await supabase
            .from('ingredients')
            .upsert({ 
              id: detergent.id, 
              name: detergent.name,
              detergency: detergent.detergency,
              foaming: detergent.foaming,
              biodegradability: detergent.biodegradability,
              purity: detergent.purity
            }, { onConflict: 'id' });
          
          if (error) {
            console.error('Error saving detergent to Supabase:', error);
          }
        }
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
    <div className="space-y-5 p-4 rounded-lg border border-border/50 bg-gradient-to-br from-background to-muted/30">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={loadDetergentsFromWebhook}
          className="mb-2 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
          disabled={isLoadingWebhook}
        >
          <Download className="mr-2 h-4 w-4" />
          {isLoadingWebhook ? 'Loading...' : 'Load Detergents'}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="detergent-search" className="text-sm font-medium">Search Detergents</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="detergent-search"
            type="search"
            placeholder="Search by name..."
            className="pl-8 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="detergent-select" className="text-sm font-medium">Select Detergent</Label>
        <Select 
          value={selectedDetergent || ""} 
          onValueChange={handleSelect}
          disabled={isLoading}
        >
          <SelectTrigger id="detergent-select" className="w-full bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder="Select a detergent" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {filteredDetergents.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {isLoading ? "Loading..." : "No detergents found"}
              </div>
            ) : (
              filteredDetergents.map((detergent) => (
                <SelectItem 
                  key={detergent.id} 
                  value={detergent.id}
                  className="cursor-pointer transition-colors hover:bg-muted"
                >
                  {detergent.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          {detergents.length > 0 ? `${detergents.length} detergents available` : "No detergents loaded"}
        </p>
      </div>
    </div>
  );
};

export default DetergentSelector;
