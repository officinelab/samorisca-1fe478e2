
import { useState, useEffect } from "react";
import { useSiteSettings } from "../useSiteSettings";
import { SiteIcon } from "./types";
import { saveIconToLocalStorage, loadIconFromLocalStorage, notifyIconUpdate } from "./iconStorage";
import { updateFaviconInDOM } from "./domUtils";

/**
 * Hook for managing the site favicon icon
 */
export const useSiteIcon = (): SiteIcon => {
  const [siteIcon, setSiteIcon] = useState<string | null>(null);
  const { siteSettings, saveSetting } = useSiteSettings();

  // Load icon from site settings or localStorage fallback
  useEffect(() => {
    const savedIcon = siteSettings?.faviconUrl || loadIconFromLocalStorage();
    if (savedIcon) {
      setSiteIcon(savedIcon);
      // Update favicon in the DOM
      updateFaviconInDOM(savedIcon);
    }
  }, [siteSettings?.faviconUrl]);

  // Update site icon
  const updateSiteIcon = (iconUrl: string): void => {
    setSiteIcon(iconUrl);
    
    if (iconUrl) {
      // Save to localStorage for backwards compatibility
      saveIconToLocalStorage(iconUrl);
      
      // If useSiteSettings is available, update there too
      if (saveSetting) {
        saveSetting('faviconUrl', iconUrl);
      }
      
      notifyIconUpdate();
    } else {
      saveIconToLocalStorage(null);
      
      if (saveSetting) {
        saveSetting('faviconUrl', null);
      }
      
      notifyIconUpdate(true);
    }
    
    // Update favicon in the DOM
    updateFaviconInDOM(iconUrl);
  };

  return {
    siteIcon,
    updateSiteIcon
  };
};

export default useSiteIcon;
