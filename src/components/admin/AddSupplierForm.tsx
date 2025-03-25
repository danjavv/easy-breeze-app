
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Supplier } from './SupplierList';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Define form validation schema
const formSchema = z.object({
  company_name: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password_hash: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

interface AddSupplierFormProps {
  onAddSupplier: (supplier: Omit<Supplier, 'id' | 'created_at'>) => void;
  onSuccess?: () => void;
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({ onAddSupplier, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: '',
      email: '',
      password_hash: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Using the webhook that was previously in SupplierRegistrationForm
      const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook/11174ce3-72a2-4e03-b981-5b0e3d9ecd53';
      
      const params = new URLSearchParams({
        company_name: values.company_name,
        email: values.email,
        notification_email: values.email, // Use same email for notification
        password_hash: values.password_hash
      });
      
      const response = await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit registration');
      }
      
      // After successful webhook call, add the supplier locally
      const newSupplier: Omit<Supplier, 'id' | 'created_at'> = {
        company_name: values.company_name,
        email: values.email,
        notification_email: values.email, // Use same email for notification
        password_hash: values.password_hash,
        status: 'Pending',
      };
      
      await onAddSupplier(newSupplier);
      
      toast({
        title: "Supplier Added",
        description: `${values.company_name} has been added successfully.`,
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast({
        title: "Error",
        description: "Failed to add supplier. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Add New Supplier</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="supplier@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password_hash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Set password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Supplier...
              </>
            ) : (
              'Add Supplier'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddSupplierForm;
