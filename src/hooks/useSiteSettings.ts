
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  sidebarLogo: string | null;
  menuLogo: string | null;
  restaurantName: string | null;
  footerText: string | null;
  defaultProductImage: string | null;
}

const defaultSettings: SiteSettings = {
  sidebarLogo: null,
  menuLogo: null,
  restaurantName: "Sa Morisca",
  footerText: `© ${new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati`,
  defaultProductImage: null
};

// Chiavi per il localStorage e per Supabase
const KEYS = {
  SIDEBAR_LOGO: 'sidebarLogo',
  MENU_LOGO: 'menuLogo',
  RESTAURANT_NAME: 'restaurantName',
  FOOTER_TEXT: 'footerText',
  DEFAULT_PRODUCT_IMAGE: 'defaultProductImage'
};

export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Carica le impostazioni da Supabase e fallback su localStorage se necessario
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Recupera le impostazioni da Supabase
        const { data, error } = await supabase
          .from('site_settings')
          .select('*');

        if (error) {
          console.error("Errore nel recupero delle impostazioni da Supabase:", error);
          loadFromLocalStorage();
          return;
        }

        if (data && data.length > 0) {
          // Converti i dati da Supabase in un oggetto SiteSettings
          const settingsMap = data.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
          }, {});

          const settings: SiteSettings = {
            sidebarLogo: settingsMap[KEYS.SIDEBAR_LOGO] || null,
            menuLogo: settingsMap[KEYS.MENU_LOGO] || null,
            restaurantName: settingsMap[KEYS.RESTAURANT_NAME] || defaultSettings.restaurantName,
            footerText: settingsMap[KEYS.FOOTER_TEXT] || defaultSettings.footerText,
            defaultProductImage: settingsMap[KEYS.DEFAULT_PRODUCT_IMAGE] || null
          };

          setSiteSettings(settings);
        } else {
          // Se non ci sono impostazioni in Supabase, carica da localStorage e migra
          loadFromLocalStorage();
          // Migra le impostazioni a Supabase
          migrateToSupabase();
        }

      } catch (err) {
        console.error("Errore durante il caricamento delle impostazioni:", err);
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Carica le impostazioni dal localStorage
  const loadFromLocalStorage = () => {
    const settings: SiteSettings = {
      sidebarLogo: localStorage.getItem(KEYS.SIDEBAR_LOGO),
      menuLogo: localStorage.getItem(KEYS.MENU_LOGO),
      restaurantName: localStorage.getItem(KEYS.RESTAURANT_NAME),
      footerText: localStorage.getItem(KEYS.FOOTER_TEXT),
      defaultProductImage: localStorage.getItem(KEYS.DEFAULT_PRODUCT_IMAGE)
    };
    
    setSiteSettings(settings);
  };

  // Migra le impostazioni da localStorage a Supabase
  const migrateToSupabase = async () => {
    try {
      // Crea un array di oggetti per l'inserimento in Supabase
      const settingsToInsert = Object.keys(KEYS).map(keyName => {
        const key = KEYS[keyName];
        const value = localStorage.getItem(key);
        return { key, value };
      }).filter(item => item.value !== null);

      if (settingsToInsert.length > 0) {
        const { error } = await supabase
          .from('site_settings')
          .insert(settingsToInsert);

        if (error) {
          console.error("Errore durante la migrazione delle impostazioni a Supabase:", error);
        }
      }
    } catch (err) {
      console.error("Errore durante la migrazione delle impostazioni:", err);
    }
  };

  // Salva un'impostazione su Supabase e in localStorage come backup
  const saveSetting = async (key: string, value: string) => {
    try {
      // Salva in localStorage come backup
      localStorage.setItem(key, value);

      // Verifica se l'impostazione esiste già
      const { data, error: checkError } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key);

      if (checkError) {
        console.error(`Errore durante la verifica dell'impostazione ${key}:`, checkError);
        return;
      }

      if (data && data.length > 0) {
        // Aggiorna l'impostazione esistente
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({ value })
          .eq('key', key);

        if (updateError) {
          console.error(`Errore durante l'aggiornamento dell'impostazione ${key}:`, updateError);
        }
      } else {
        // Inserisci una nuova impostazione
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert({ key, value });

        if (insertError) {
          console.error(`Errore durante l'inserimento dell'impostazione ${key}:`, insertError);
        }
      }
    } catch (err) {
      console.error(`Errore durante il salvataggio dell'impostazione ${key}:`, err);
    }
  };

  // Funzioni di aggiornamento
  const updateSidebarLogo = async (logoUrl: string) => {
    await saveSetting(KEYS.SIDEBAR_LOGO, logoUrl);
    setSiteSettings(prev => ({ ...prev, sidebarLogo: logoUrl }));
  };

  const updateMenuLogo = async (logoUrl: string) => {
    await saveSetting(KEYS.MENU_LOGO, logoUrl);
    setSiteSettings(prev => ({ ...prev, menuLogo: logoUrl }));
  };

  const updateRestaurantName = async (name: string) => {
    await saveSetting(KEYS.RESTAURANT_NAME, name);
    setSiteSettings(prev => ({ ...prev, restaurantName: name }));
  };

  const updateFooterText = async (text: string) => {
    await saveSetting(KEYS.FOOTER_TEXT, text);
    setSiteSettings(prev => ({ ...prev, footerText: text }));
  };

  const updateDefaultProductImage = async (imageUrl: string) => {
    await saveSetting(KEYS.DEFAULT_PRODUCT_IMAGE, imageUrl);
    setSiteSettings(prev => ({ ...prev, defaultProductImage: imageUrl }));
  };

  return {
    siteSettings,
    isLoading,
    updateSidebarLogo,
    updateMenuLogo,
    updateRestaurantName,
    updateFooterText,
    updateDefaultProductImage
  };
};

export default useSiteSettings;
