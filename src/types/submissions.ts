
export interface BatchResult {
  status: string;
  metrics: {
    purity: number;
    foaming: number;
    detergency: number;
    biodegradability: number;
  };
  batch_label: string;
  failure_reasons?: string[];
}

export interface Submission {
  submissionid: string;
  submission_label: string | null;
  created_at: string;
  supplierid: string;
  total_batches: number | null;
  passed_batches: number | null;
  failed_batches: number | null;
  supplier_name?: string;
  results?: BatchResult[];
}
