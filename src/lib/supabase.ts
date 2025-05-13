
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config';

// Usa variabili d'ambiente o valori di fallback per l'URL e la chiave di Supabase
const supabaseUrl = SUPABASE_URL || 'https://dqkrmewgeeuxhbxrwpjp.supabase.co';
const supabaseKey = SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Chiave pubblica fallback

// Crea e esporta il client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
