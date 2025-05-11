
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { SiteSettings } from "@/types/siteSettings";

// Storage key for localStorage
const STORAGE_KEY = 'site_settings';

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

export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSiteSettings({
            ...defaultSettings,
            ...parsedSettings
          });
        }
      } catch (err) {
        console.error("Error loading site settings from localStorage:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save a setting to localStorage
  const saveSetting = (key: string, value: any) => {
    try {
      // Update state
      setSiteSettings(prevSettings => {
        const updatedSettings = { ...prevSettings, [key]: value };
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
        
        return updatedSettings;
      });
      
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
    updateSidebarLogo,
    updateMenuLogo,
    updateRestaurantName,
    updateFooterText,
    updateDefaultProductImage
  };
};

export default useSiteSettings;
