
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [isLoading, setIsLoading] = useState(true);
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
