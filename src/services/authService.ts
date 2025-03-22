
import { supabase } from '@/integrations/supabase/client';
import { notifyLoginAttempt } from '@/utils/webhookUtils';

interface LoginResult {
  success: boolean;
  message: string;
  supplierID?: string;
}

/**
 * Attempts to log in a user with email and password
 */
export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  if (!email.trim() || !password) {
    return {
      success: false,
      message: "Please fill out all fields"
    };
  }
  
  try {
    // Send notification about login attempt
    await notifyLoginAttempt(email);
    
    // First, try to authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error("Authentication error:", authError);
      throw new Error(authError.message || "Authentication failed");
    }
    
    if (authData.user) {
      console.log("Authenticated with Supabase:", authData.user);
      
      // Now fetch supplier information
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('id, company_name, status')
        .eq('email', email)
        .single();
        
      if (supplierError && supplierError.code !== 'PGRST116') {
        console.error("Error fetching supplier:", supplierError);
        throw new Error("Could not verify supplier account");
      }
      
      if (supplierData) {
        return {
          success: true,
          message: "Login successful",
          supplierID: supplierData.id
        };
      } else {
        // Fallback to try the webhook approach if no supplier record is found
        try {
          const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook-test/3f878768-29d0-43f6-a567-c5f127ff8855';
          
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password
            })
          });
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const responseData = await response.json();
          console.log("Login response:", responseData);
          
          const data = Array.isArray(responseData) ? responseData[0] : responseData;
          
          if (data && data.supplierid) {
            return {
              success: true,
              message: "Login successful",
              supplierID: data.supplierid
            };
          } else {
            return {
              success: false,
              message: "Invalid email or password"
            };
          }
        } catch (webhookError) {
          console.error("Webhook fallback error:", webhookError);
          throw new Error("Login service is currently unavailable");
        }
      }
    } else {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }
  } catch (error: any) {
    throw new Error(error.message || "An unexpected error occurred during login");
  }
};
