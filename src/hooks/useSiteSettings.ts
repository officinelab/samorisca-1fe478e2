
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
  updateShowRestaurantNameInMenuBar,
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

  // Funzione per aggiornare il limite mensile dei token
  const updateMonthlyTokensLimit = async (limit: string): Promise<boolean> => {
    const success = await saveSetting("monthlyTokensLimit", limit);
    if (success) {
      setSiteSettings(prev => ({
        ...prev,
        monthlyTokensLimit: limit
      }));
      // Trigger refresh dei token per aggiornare i valori nel sistema
      window.dispatchEvent(new CustomEvent("refresh-tokens"));
    }
    return success;
  };

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
    updateShowRestaurantNameInMenuBar,
    updateMonthlyTokensLimit, // Nuova funzione per gestire il limite mensile
  };
};

export default useSiteSettings;
