
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
    
    const text = await response.text();
    console.log('Raw webhook response text:', text);
    
    // Try to parse the text as JSON
    let data;
    try {
      data = JSON.parse(text);
      console.log('Webhook response data (parsed):', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Error parsing webhook response as JSON:', parseError);
      throw new Error('Invalid JSON response from webhook');
    }
    
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
  // Check if response is undefined or null
  if (!webhookData) {
    console.log('No webhook data received');
    return [];
  }
  
  console.log('Processing webhook ingredients data type:', typeof webhookData);
  if (Array.isArray(webhookData)) {
    console.log('Processing webhook array data with length:', webhookData.length);
  } else if (typeof webhookData === 'object') {
    console.log('Processing webhook single object data');
  }
  
  // If the response is already an array, map through it
  if (Array.isArray(webhookData)) {
    console.log('Processing webhook array data with length:', webhookData.length);
    
    const processed = webhookData.map((item: any) => {
      // Extract the actual data from the webhook response which may be nested inside a 'json' property
      const data = item.json || item;
      
      return {
        id: data.id || `ingredient-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name || 'Unknown Ingredient',
        detergency: data.detergency || null,
        foaming: data.foaming || null,
        biodegradability: data.biodegradability || null,
        purity: data.purity || null,
        created_at: data.created_at || new Date().toISOString()
      };
    });
    
    console.log('Processed ingredients:', processed);
    console.log('Processed ingredient names:', processed.map(i => i.name).join(', '));
    return processed;
  }
  
  // If the response is a single object, wrap it in an array
  if (webhookData && typeof webhookData === 'object') {
    console.log('Processing webhook single object data');
    const data = webhookData.json || webhookData;
    
    const processed = [{
      id: data.id || `ingredient-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name || 'Unknown Ingredient',
      detergency: data.detergency || null,
      foaming: data.foaming || null,
      biodegradability: data.biodegradability || null,
      purity: data.purity || null,
      created_at: data.created_at || new Date().toISOString()
    }];
    
    console.log('Processed single ingredient:', processed);
    return processed;
  }
  
  console.log('No valid webhook data found, received:', typeof webhookData);
  return [];
};

/**
 * Process webhook response to extract model data
 * @param webhookData The data returned from the webhook
 * @returns Array of formatted models
 */
export const processWebhookModels = (webhookData: any): any[] => {
  // Check if response is undefined or null
  if (!webhookData) {
    console.log('No webhook model data received');
    return [];
  }
  
  console.log('Processing webhook models data type:', typeof webhookData);
  if (Array.isArray(webhookData)) {
    console.log('Processing webhook models array data with length:', webhookData.length);
  } else if (typeof webhookData === 'object') {
    console.log('Processing webhook models single object data');
  }
  
  // If the response is already an array, map through it
  if (Array.isArray(webhookData)) {
    console.log('Processing webhook model array data with length:', webhookData.length);
    
    const processed = webhookData.map((item: any) => {
      // Extract the actual data from the webhook response which may be nested inside a 'json' property
      const data = item.json || item;
      
      return {
        id: data.id || `model-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name || 'Unknown Model',
        threshold_detergency: data.threshold_detergency || null,
        threshold_foaming: data.threshold_foaming || null,
        threshold_biodegrability: data.threshold_biodegrability || null, // Note: 'biodegrability' is used in the DB schema
        threshold_purity: data.threshold_purity || null,
        created_at: data.created_at || new Date().toISOString()
      };
    });
    
    console.log('Processed models:', processed);
    console.log('Processed model names:', processed.map(m => m.name).join(', '));
    return processed;
  }
  
  // If the response is a single object, wrap it in an array
  if (webhookData && typeof webhookData === 'object') {
    console.log('Processing webhook single model data');
    const data = webhookData.json || webhookData;
    
    const processed = [{
      id: data.id || `model-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name || 'Unknown Model',
      threshold_detergency: data.threshold_detergency || null,
      threshold_foaming: data.threshold_foaming || null,
      threshold_biodegrability: data.threshold_biodegrability || null, // Note: 'biodegrability' is used in the DB schema
      threshold_purity: data.threshold_purity || null,
      created_at: data.created_at || new Date().toISOString()
    }];
    
    console.log('Processed single model:', processed);
    return processed;
  }
  
  console.log('No valid model data found, received:', typeof webhookData);
  return [];
};
