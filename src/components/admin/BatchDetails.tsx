
import React from 'react';
import { Info } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BatchResult } from '@/types/submissions';

interface BatchDetailsProps {
  results: BatchResult[];
  submissionLabel: string;
}

const BatchDetails: React.FC<BatchDetailsProps> = ({ results, submissionLabel }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="destructive" 
          className="flex items-center gap-1" 
          size="sm"
        >
          <Info className="h-4 w-4" />
          Batches
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto p-0">
        <div className="p-4 border-b">
          <h4 className="font-semibold">Batch Details</h4>
          <p className="text-sm text-muted-foreground">{submissionLabel}</p>
        </div>
        <div className="divide-y">
          {results.map((batch, idx) => (
            <div key={idx} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{batch.batch_label || `Batch ${idx + 1}`}</span>
                <Badge variant={batch.status === 'PASS' ? 'success' : 'destructive'}>
                  {batch.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Purity: <span className="font-medium">{batch.metrics.purity}</span></div>
                <div>Foaming: <span className="font-medium">{batch.metrics.foaming}</span></div>
                <div>Detergency: <span className="font-medium">{batch.metrics.detergency}</span></div>
                <div>Biodegradability: <span className="font-medium">{batch.metrics.biodegradability}</span></div>
              </div>
              {batch.failure_reasons && batch.failure_reasons.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-destructive">Failure Reasons:</p>
                  <ul className="text-xs text-destructive list-disc pl-4">
                    {batch.failure_reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BatchDetails;
