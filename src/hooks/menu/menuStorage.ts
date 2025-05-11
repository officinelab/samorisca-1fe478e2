
import { supabase } from "@/integrations/supabase/client";

// Handle restaurant logo in local storage and Supabase
export const getStoredLogo = async (): Promise<string | null> => {
  try {
    // Prima cerca nelle impostazioni del sito in Supabase
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'restaurantLogo')
      .single();
    
    if (error) {
      console.error("Errore nel recupero del logo da Supabase:", error);
      // Fallback su localStorage
      return localStorage.getItem('restaurantLogo');
    }
    
    if (data && data.value) {
      return data.value;
    }
    
    // Fallback su localStorage
    return localStorage.getItem('restaurantLogo');
  } catch (err) {
    console.error("Errore durante il recupero del logo:", err);
    return localStorage.getItem('restaurantLogo');
  }
};

export const setStoredLogo = async (logoUrl: string): Promise<void> => {
  try {
    // Salva in Supabase
    const { data, error } = await supabase
      .from('site_settings')
      .select('id')
      .eq('key', 'restaurantLogo');
    
    if (error) {
      console.error("Errore nel controllo dell'esistenza del logo:", error);
    } else {
      if (data && data.length > 0) {
        // Aggiorna il record esistente
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({ value: logoUrl })
          .eq('key', 'restaurantLogo');
        
        if (updateError) {
          console.error("Errore nell'aggiornamento del logo:", updateError);
        }
      } else {
        // Inserisci un nuovo record
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert({ key: 'restaurantLogo', value: logoUrl });
        
        if (insertError) {
          console.error("Errore nell'inserimento del logo:", insertError);
        }
      }
    }
    
    // Salva anche in localStorage come fallback
    localStorage.setItem('restaurantLogo', logoUrl);
  } catch (err) {
    console.error("Errore durante il salvataggio del logo:", err);
    // Salva in localStorage come fallback
    localStorage.setItem('restaurantLogo', logoUrl);
  }
};
