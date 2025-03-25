
/**
 * Utility for debugging Supabase responses
 */
export const logSupabaseResponse = (
  operation: string, 
  data: any, 
  error: any
) => {
  console.group(`Supabase ${operation}`);
  console.log('Data:', data);
  if (error) {
    console.error('Error:', error);
  }
  console.groupEnd();
  
  return { data, error };
};
