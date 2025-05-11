
import { useState, useEffect } from "react";
import { SiteSettings } from "./site-settings/types";
import { loadSettings, saveSetting } from "./site-settings/settingsStorage";
import { defaultSettings } from "./site-settings/defaultSettings";
import {
  updateSidebarLogo,
  updateMenuLogo,
  updateRestaurantName,
  updateFooterText,
  updateDefaultProductImage
} from "./site-settings/updateFunctions";

/**
 * Hook to manage site settings
 */
export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const loadedSettings = await loadSettings();
        
        setSiteSettings({
          ...defaultSettings,
          ...(loadedSettings || {})
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

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
