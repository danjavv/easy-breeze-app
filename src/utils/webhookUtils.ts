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
