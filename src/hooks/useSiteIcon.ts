
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useSiteSettings } from "./useSiteSettings";

export const useSiteIcon = () => {
  const [siteIcon, setSiteIcon] = useState<string | null>(null);
  const { siteSettings, saveSetting } = useSiteSettings();

  // Load icon from site settings or localStorage fallback
  useEffect(() => {
    const savedIcon = siteSettings?.faviconUrl || localStorage.getItem('siteIcon');
    if (savedIcon) {
      setSiteIcon(savedIcon);
      // Update favicon in the DOM
      updateFavicon(savedIcon);
    }
  }, [siteSettings?.faviconUrl]);

  // Update site icon
  const updateSiteIcon = (iconUrl: string) => {
    setSiteIcon(iconUrl);
    
    if (iconUrl) {
      // Save to localStorage for backwards compatibility
      localStorage.setItem('siteIcon', iconUrl);
      
      // If useSiteSettings is available, update there too
      if (saveSetting) {
        saveSetting('faviconUrl', iconUrl);
      }
      
      toast.success("Icona del sito aggiornata");
    } else {
      localStorage.removeItem('siteIcon');
      
      if (saveSetting) {
        saveSetting('faviconUrl', null);
      }
      
      toast.success("Icona del sito rimossa");
    }
    
    // Update favicon in the DOM
    updateFavicon(iconUrl);
  };

  // Function to update favicon in the DOM
  const updateFavicon = (iconUrl: string) => {
    if (!iconUrl) return;
    
    // Look for existing favicon link element
    let link: HTMLLinkElement | null = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    
    // Create one if it doesn't exist
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    // Update href and type
    link.href = iconUrl;
    link.type = 'image/svg+xml';
  };

  return {
    siteIcon,
    updateSiteIcon
  };
};

export default useSiteIcon;
