
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

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

// Chiavi per il localStorage
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

  // Carica le impostazioni dal localStorage all'avvio
  useEffect(() => {
    const loadSettings = () => {
      const settings: SiteSettings = {
        sidebarLogo: localStorage.getItem(KEYS.SIDEBAR_LOGO),
        menuLogo: localStorage.getItem(KEYS.MENU_LOGO),
        restaurantName: localStorage.getItem(KEYS.RESTAURANT_NAME),
        footerText: localStorage.getItem(KEYS.FOOTER_TEXT),
        defaultProductImage: localStorage.getItem(KEYS.DEFAULT_PRODUCT_IMAGE)
      };
      
      setSiteSettings(settings);
      setIsLoading(false);
    };
    
    loadSettings();
  }, []);

  // Funzioni di aggiornamento
  const updateSidebarLogo = (logoUrl: string) => {
    localStorage.setItem(KEYS.SIDEBAR_LOGO, logoUrl);
    setSiteSettings(prev => ({ ...prev, sidebarLogo: logoUrl }));
  };

  const updateMenuLogo = (logoUrl: string) => {
    localStorage.setItem(KEYS.MENU_LOGO, logoUrl);
    setSiteSettings(prev => ({ ...prev, menuLogo: logoUrl }));
  };

  const updateRestaurantName = (name: string) => {
    localStorage.setItem(KEYS.RESTAURANT_NAME, name);
    setSiteSettings(prev => ({ ...prev, restaurantName: name }));
  };

  const updateFooterText = (text: string) => {
    localStorage.setItem(KEYS.FOOTER_TEXT, text);
    setSiteSettings(prev => ({ ...prev, footerText: text }));
  };

  const updateDefaultProductImage = (imageUrl: string) => {
    localStorage.setItem(KEYS.DEFAULT_PRODUCT_IMAGE, imageUrl);
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
