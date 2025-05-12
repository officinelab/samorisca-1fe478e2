
// Funzioni per la gestione del salvataggio del menu

import { toast } from "@/components/ui/sonner";
import { SiteSettings } from "@/types/siteSettings";
import { supabase } from "@/integrations/supabase/client";

// Chiave per il localStorage
const SITE_SETTINGS_STORAGE_KEY = "site_settings";

// Carica le impostazioni del sito dal localStorage
export const loadSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    // First try to load from Supabase
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');
    
    if (error) {
      console.error("Error loading settings from Supabase:", error);
      throw error;
    }
    
    if (data && data.length > 0) {
      // Convert to settings object
      const settings: SiteSettings = {};
      data.forEach(item => {
        settings[item.key] = item.value;
      });
      return settings;
    }
    
    // Fallback to localStorage
    const savedSettings = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      return parsedSettings;
    }
    
    return null;
  } catch (err) {
    console.error("Errore nel caricamento delle impostazioni:", err);
    toast.error("Errore nel caricamento delle impostazioni");
    
    // Final fallback to localStorage
    try {
      const savedSettings = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (localErr) {
      console.error("Error loading from localStorage:", localErr);
    }
    
    return null;
  }
};

// Salva le impostazioni del sito 
export const saveSiteSettings = async (settings: SiteSettings): Promise<boolean> => {
  try {
    // Save to localStorage as fallback
    localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    
    // Save each key-value pair to Supabase
    for (const [key, value] of Object.entries(settings)) {
      const { data: existingRecord } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();
      
      if (existingRecord) {
        await supabase
          .from('site_settings')
          .update({
            value,
            updated_at: new Date().toISOString()
          })
          .eq('key', key);
      } else {
        await supabase
          .from('site_settings')
          .insert([{ key, value }]);
      }
    }
    
    return true;
  } catch (err) {
    console.error("Errore nel salvataggio delle impostazioni:", err);
    toast.error("Errore nel salvataggio delle impostazioni");
    return false;
  }
};

// Gestione dell'immagine del logo da Supabase
const RESTAURANT_LOGO_KEY = "restaurant_logo";

export const saveRestaurantLogo = async (logoUrl: string): Promise<boolean> => {
  try {
    // Save to localStorage as fallback
    localStorage.setItem(RESTAURANT_LOGO_KEY, logoUrl);
    
    // Save to Supabase
    const { data: existingRecord } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', RESTAURANT_LOGO_KEY)
      .maybeSingle();
    
    if (existingRecord) {
      await supabase
        .from('site_settings')
        .update({
          value: logoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('key', RESTAURANT_LOGO_KEY);
    } else {
      await supabase
        .from('site_settings')
        .insert([{
          key: RESTAURANT_LOGO_KEY,
          value: logoUrl
        }]);
    }
    
    return true;
  } catch (err) {
    console.error("Errore nel salvataggio del logo:", err);
    toast.error("Errore nel salvataggio del logo");
    return false;
  }
};

export const loadRestaurantLogo = async (): Promise<string | null> => {
  try {
    // First try to load from Supabase
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', RESTAURANT_LOGO_KEY)
      .maybeSingle();
    
    if (error) {
      console.error("Error loading logo from Supabase:", error);
      throw error;
    }
    
    if (data && data.value) {
      // Assicuriamoci che sia una stringa
      const logoUrl = typeof data.value === 'string' ? data.value : String(data.value);
      return logoUrl;
    }
    
    // Fallback to localStorage
    return localStorage.getItem(RESTAURANT_LOGO_KEY);
  } catch (err) {
    console.error("Errore nel caricamento del logo:", err);
    
    // Final fallback to localStorage
    return localStorage.getItem(RESTAURANT_LOGO_KEY);
  }
};

// These functions are kept for compatibility with useRestaurantLogo.ts
export const getStoredLogo = loadRestaurantLogo;
export const setStoredLogo = saveRestaurantLogo;
