
// Funzioni per la gestione del salvataggio del menu

import { toast } from "@/components/ui/sonner";
import { SiteSettings } from "@/types/siteSettings";

// Chiave per il localStorage
const SITE_SETTINGS_STORAGE_KEY = "site_settings";

// Carica le impostazioni del sito dal localStorage
export const loadSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const savedSettings = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      return parsedSettings;
    }
    
    return null;
  } catch (err) {
    console.error("Errore nel caricamento delle impostazioni:", err);
    toast.error("Errore nel caricamento delle impostazioni");
    return null;
  }
};

// Salva le impostazioni del sito nel localStorage
export const saveSiteSettings = async (settings: SiteSettings): Promise<boolean> => {
  try {
    localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error("Errore nel salvataggio delle impostazioni:", err);
    toast.error("Errore nel salvataggio delle impostazioni");
    return false;
  }
};

// Gestione dell'immagine del logo da localStorage
const RESTAURANT_LOGO_KEY = "restaurant_logo";

export const saveRestaurantLogo = async (logoUrl: string): Promise<boolean> => {
  try {
    localStorage.setItem(RESTAURANT_LOGO_KEY, logoUrl);
    return true;
  } catch (err) {
    console.error("Errore nel salvataggio del logo:", err);
    toast.error("Errore nel salvataggio del logo");
    return false;
  }
};

export const loadRestaurantLogo = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(RESTAURANT_LOGO_KEY);
  } catch (err) {
    console.error("Errore nel caricamento del logo:", err);
    return null;
  }
};

// These functions are kept for compatibility with useRestaurantLogo.ts
export const getStoredLogo = loadRestaurantLogo;
export const setStoredLogo = saveRestaurantLogo;
