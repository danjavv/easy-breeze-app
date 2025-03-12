
import { Supplier } from '@/components/admin/SupplierList';
import { toast } from '@/hooks/use-toast';

// Default suppliers data that will be used as fallback
export const defaultSuppliers: Supplier[] = [
  {
    "id": "2ba035af-e4ad-4a7b-aaca-cd318b7c8647",
    "company_name": "LOL",
    "email": "lol@gmail.com",
    "notification_email": "lol@gmail.com",
    "password_hash": "LOL",
    "status": "Approved",
    "created_at": "2025-03-07T15:25:50.84047"
  },
  {
    "id": "32a5f1d3-003b-4955-8a81-9f90406136a9",
    "company_name": "ABC",
    "email": "abc@gmail.com",
    "notification_email": "abc@gmail.com",
    "password_hash": "ABCDE",
    "status": "Approved",
    "created_at": "2025-03-07T15:18:47.899904"
  },
  {
    "id": "439ba9f0-6184-49cf-97e1-4d872a0799da",
    "company_name": "Reliance",
    "email": "reliance@gmail.com",
    "notification_email": "reliance@gmail.com",
    "password_hash": "ABCDE",
    "status": "Approved",
    "created_at": "2025-03-07T16:54:27.934076"
  },
  {
    "id": "43bf87df-c7b7-407f-9680-7e8a330e9b44",
    "company_name": "AMC",
    "email": "amc@gmail.com",
    "notification_email": "amc@gmail.com",
    "password_hash": "AMCDE",
    "status": "Approved",
    "created_at": "2025-03-07T16:47:29.680506"
  },
  {
    "id": "5c144d9f-a1be-4d66-97c6-dcb978a26bb4",
    "company_name": "Compannyyy",
    "email": "company@company.com",
    "notification_email": "company@company.com",
    "password_hash": "COMPANY",
    "status": "Approved",
    "created_at": "2025-03-07T20:02:03.891065"
  },
  {
    "id": "0d4c60e2-56b4-49a3-bb0f-7d4c3378c641",
    "company_name": "Reliance",
    "email": "reliance@outlook.com",
    "notification_email": "reliance@outlook.com",
    "password_hash": "ABCXX",
    "status": "Approved",
    "created_at": "2025-03-10T08:40:36.54133"
  },
  {
    "id": "97afef35-53fd-4bc5-8f37-806a9a53c4cc",
    "company_name": "RANDOM",
    "email": "random@gmail.com",
    "notification_email": "random@gmail.com",
    "password_hash": "RANDOM",
    "status": "Approved",
    "created_at": "2025-03-10T09:23:43.308399"
  },
  {
    "id": "506dbd69-177a-4f0b-b210-ae9b7259d1da",
    "company_name": "Danish",
    "email": "danjaved007@gmail.com",
    "notification_email": "danjaved007@gmail.com",
    "password_hash": "DANISH",
    "status": "Approved",
    "created_at": "2025-03-10T09:51:09.384387"
  },
  {
    "id": "36a7d8c8-3230-40af-b2fe-87c8d911c8c5",
    "company_name": "ABCDE",
    "email": "abcde@gmail.com",
    "notification_email": "abcde@gmail.com",
    "password_hash": "ABCDE",
    "status": "Approved",
    "created_at": "2025-03-10T12:49:11.829208"
  }
];

export const fetchSupplierData = async (): Promise<{ 
  suppliers: Supplier[], 
  isMockData: boolean, 
  error: string | null 
}> => {
  // Return default suppliers directly without making an API call
  toast({
    title: "Suppliers loaded",
    description: `Successfully loaded ${defaultSuppliers.length} suppliers.`,
    variant: "default"
  });
  
  return {
    suppliers: defaultSuppliers,
    isMockData: true,
    error: null
  };
};
