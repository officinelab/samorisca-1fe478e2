
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { SiteSettings, SiteSettingRecord } from "@/types/siteSettings";
import { supabase } from "@/integrations/supabase/client";

// Default settings
const defaultSettings: SiteSettings = {
  sidebarLogo: null,
  menuLogo: null,
  restaurantName: "Sa Morisca",
  footerText: `© ${new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati`,
  defaultProductImage: null,
  siteName: "Sa Morisca",
  siteDescription: "Ristorante Sa Morisca",
};

// Storage key per localStorage fallback
const STORAGE_KEY = 'site_settings';

export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Carica le impostazioni da Supabase o localStorage come fallback
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Prima prova a caricare da Supabase
        const { data: supabaseSettings, error } = await supabase
          .from('site_settings')
          .select('*');
        
        if (error) {
          console.error("Error loading settings from Supabase:", error);
          throw error;
        }
        
        if (supabaseSettings && supabaseSettings.length > 0) {
          // Converti gli elementi dal formato database al formato dell'applicazione
          const settingsObject: SiteSettings = {};
          
          supabaseSettings.forEach((record: SiteSettingRecord) => {
            settingsObject[record.key] = record.value;
          });
          
          setSiteSettings({
            ...defaultSettings,
            ...settingsObject
          });
        } else {
          // Fallback su localStorage
          const savedSettings = localStorage.getItem(STORAGE_KEY);
          
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSiteSettings({
              ...defaultSettings,
              ...parsedSettings
            });
            
            // Migra le impostazioni da localStorage a Supabase
            try {
              const keys = Object.keys(parsedSettings);
              for (const key of keys) {
                await saveSetting(key, parsedSettings[key]);
              }
              console.log("Settings migrated from localStorage to Supabase");
            } catch (migrateError) {
              console.error("Failed to migrate settings:", migrateError);
            }
          }
        }
      } catch (err) {
        console.error("Error loading site settings:", err);
        
        // Fallback finale su localStorage
        try {
          const savedSettings = localStorage.getItem(STORAGE_KEY);
          if (savedSettings) {
            setSiteSettings({
              ...defaultSettings,
              ...JSON.parse(savedSettings)
            });
          }
        } catch (localErr) {
          console.error("Error loading from localStorage:", localErr);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Funzione per salvare un'impostazione in Supabase e aggiornare lo stato locale
  const saveSetting = async (key: string, value: any): Promise<boolean> => {
    try {
      // Aggiorna lo stato locale
      setSiteSettings(prevSettings => {
        const updatedSettings = { ...prevSettings, [key]: value };
        
        // Salva anche su localStorage come backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
        
        return updatedSettings;
      });

      // Verifica se l'impostazione esiste già
      const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key);
      
      // Se esiste, aggiorna, altrimenti inserisci
      if (existingSettings && existingSettings.length > 0) {
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
      
      return true;
    } catch (err) {
      console.error(`Error saving setting ${key}:`, err);
      return false;
    }
  };

  // Update functions for specific settings
  const updateSidebarLogo = (logoUrl: string) => {
    if (saveSetting('sidebarLogo', logoUrl)) {
      toast.success("Logo della sidebar aggiornato");
    }
  };

  const updateMenuLogo = (logoUrl: string) => {
    if (saveSetting('menuLogo', logoUrl)) {
      toast.success("Logo del menu aggiornato");
    }
  };

  const updateRestaurantName = (name: string) => {
    if (saveSetting('restaurantName', name)) {
      toast.success("Nome del ristorante aggiornato");
    }
  };

  const updateFooterText = (text: string) => {
    if (saveSetting('footerText', text)) {
      toast.success("Testo del footer aggiornato");
    }
  };

  const updateDefaultProductImage = (imageUrl: string) => {
    if (saveSetting('defaultProductImage', imageUrl)) {
      toast.success("Immagine predefinita per i prodotti aggiornata");
    }
  };

  return {
    siteSettings,
    isLoading,
    saveSetting,
    updateSidebarLogo,
    updateMenuLogo,
    updateRestaurantName,
    updateFooterText,
    updateDefaultProductImage
  };
};

export default useSiteSettings;
