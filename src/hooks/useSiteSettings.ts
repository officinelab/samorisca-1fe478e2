
import { useState, useEffect, useCallback } from "react";
import { SiteSettings } from "./site-settings/types";
import { loadSettings, saveSetting } from "./site-settings/settingsStorage";
import { defaultSettings } from "./site-settings/defaultSettings";
import {
  updateSidebarLogo,
  updateMenuLogo,
  updateRestaurantName,
  updateFooterText,
  updateDefaultProductImage,
  updateAdminTitle,
  updateShowRestaurantNameInMenuBar, // aggiunto!
} from "./site-settings/updateFunctions";

/**
 * Hook to manage site settings
 */
export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Funzione per ricaricare i settings da Supabase
  const refetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedSettings = await loadSettings();
      setSiteSettings({
        ...defaultSettings,
        ...(loadedSettings || {})
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load settings on component mount
  useEffect(() => {
    refetchSettings();
    
    // Listen for settings updates from other components
    const handleSettingsUpdate = (event: CustomEvent) => {
      const { key, value } = event.detail;
      setSiteSettings(prev => ({
        ...prev,
        [key]: value
      }));
    };
    
    // Add event listener for settings updates
    window.addEventListener('siteSettingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('siteSettingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, [refetchSettings]);

  return {
    siteSettings,
    isLoading,
    saveSetting,
    refetchSettings,
    updateSidebarLogo,
    updateMenuLogo,
    updateRestaurantName,
    updateFooterText,
    updateDefaultProductImage,
    updateAdminTitle,
    updateShowRestaurantNameInMenuBar, // aggiunto qui!
  };
};

export default useSiteSettings;
