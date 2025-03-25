
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
    // Use the webhook for login - this already sends the notification
    const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook-test/3f878768-29d0-43f6-a567-c5f127ff8855';
    
    try {
      console.log("Attempting webhook authentication...");
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'login_attempt',
          email,
          password,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        console.error("Webhook response not OK:", response.status);
        throw new Error('Webhook authentication failed');
      }
      
      const responseData = await response.json();
      console.log("Webhook authentication response:", responseData);
      
      // Handle array or single object response
      const data = Array.isArray(responseData) ? responseData[0] : responseData;
      
      // Explicitly log the full response to debug
      console.log("Full webhook response data:", data);
      
      // Make sure we're checking for lowercase 'supplierid'
      if (data && data.supplierid) {
        console.log("Found supplierid in response:", data.supplierid);
        return {
          success: true,
          message: "Login successful via webhook",
          supplierID: data.supplierid // Important: we're returning as supplierID (camelCase)
        };
      } else {
        console.log("No supplierid found in webhook response:", data);
        console.log("Webhook didn't return a supplierid, falling back to Supabase");
      }
    } catch (webhookError) {
      console.error("Webhook authentication error:", webhookError);
      console.log("Falling back to Supabase authentication");
    }
    
    // Only try Supabase as a fallback if webhook doesn't return a valid supplierid
    console.log("Attempting Supabase authentication...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error("Supabase authentication error:", authError);
      return {
        success: false,
        message: authError.message || "Invalid email or password"
      };
    }
    
    if (authData.user) {
      console.log("Authenticated with Supabase:", authData.user);
      
      // Fetch supplier information
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('id, company_name, status')
        .eq('email', email)
        .single();
        
      if (supplierError && supplierError.code !== 'PGRST116') {
        console.error("Error fetching supplier:", supplierError);
        return {
          success: false,
          message: "Could not verify supplier account"
        };
      }
      
      if (supplierData) {
        return {
          success: true,
          message: "Login successful via Supabase",
          supplierID: supplierData.id
        };
      } else {
        return {
          success: false,
          message: "No supplier account found for this user"
        };
      }
    } else {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred during login"
    };
  }
};
