
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config';

// Usa variabili d'ambiente o valori di fallback per l'URL e la chiave di Supabase
const supabaseUrl = SUPABASE_URL || 'https://dqkrmewgeeuxhbxrwpjp.supabase.co';
const supabaseKey = SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxa3JtZXdnZWV1eGhieHJ3cGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDg3MDksImV4cCI6MjA2MjE4NDcwOX0.Crs-I0mmm8vEQh8eUQPjWShRl6eTaOFGdwaZKWFG7t0';

// Crea e esporta il client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Add debug console logs for development tracking
console.log('Supabase client initialized with URL:', supabaseUrl);
