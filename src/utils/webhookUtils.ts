
/**
 * Utility functions for working with webhooks
 */

/**
 * Sends a notification to a webhook about a login attempt
 * @param email The email address that attempted to login
 * @param password The password used for the login attempt
 */
export const notifyLoginAttempt = async (email: string, password: string): Promise<void> => {
  // This function is no longer needed as we're handling everything in the loginUser function
  // Keeping it for compatibility but not sending a separate request
  console.log("Login attempt notification will be sent with the authentication request");
};

/**
 * Fetches data from a webhook endpoint
 * @param webhookUrl The webhook URL to fetch from
 * @returns Promise with the response data
 */
export const fetchFromWebhook = async (webhookUrl: string): Promise<any> => {
  try {
    console.log(`Fetching data from webhook: ${webhookUrl}`);
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Webhook response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching from webhook:', error);
    throw error;
  }
};

/**
 * Process webhook response to extract ingredient data
 * @param webhookData The data returned from the webhook
 * @returns Array of formatted ingredients
 */
export const processWebhookIngredients = (webhookData: any): any[] => {
  // If the response is already an array, use it
  if (Array.isArray(webhookData)) {
    console.log('Processing webhook array data with length:', webhookData.length);
    
    return webhookData.map((item: any) => ({
      id: item.id || `ingredient-${Math.random().toString(36).substr(2, 9)}`,
      name: item.name || 'Unknown Ingredient',
      detergency: item.detergency || null,
      foaming: item.foaming || null,
      biodegradability: item.biodegradability || null,
      purity: item.purity || null,
      created_at: item.created_at || new Date().toISOString()
    }));
  }
  
  // If the response is a single object, wrap it in an array
  if (webhookData && typeof webhookData === 'object') {
    console.log('Processing webhook single object data');
    return [{
      id: webhookData.id || `ingredient-${Math.random().toString(36).substr(2, 9)}`,
      name: webhookData.name || 'Unknown Ingredient',
      detergency: webhookData.detergency || null,
      foaming: webhookData.foaming || null,
      biodegradability: webhookData.biodegradability || null,
      purity: webhookData.purity || null,
      created_at: webhookData.created_at || new Date().toISOString()
    }];
  }
  
  console.log('No valid webhook data found');
  return [];
};

