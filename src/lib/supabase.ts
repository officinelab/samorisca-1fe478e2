
import { createClient } from '@supabase/supabase-js';

// Hard-coded Supabase URL and keys
const supabaseUrl = "https://dqkrmewgeeuxhbxrwpjp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxa3JtZXdnZWV1eGhieHJ3cGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDg3MDksImV4cCI6MjA2MjE4NDcwOX0.Crs-I0mmm8vEQh8eUQPjWShRl6eTaOFGdwaZKWFG7t0";
const supabaseServiceKey = ""; // We'll use anon key as fallback if service key is not provided

// Client standard per uso pubblico (con chiave anonima)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Client per operazioni admin (con chiave di servizio)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

// Helper per il controllo degli errori comuni
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return 'Si è verificato un errore durante l\'operazione';
};
