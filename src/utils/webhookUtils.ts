
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
