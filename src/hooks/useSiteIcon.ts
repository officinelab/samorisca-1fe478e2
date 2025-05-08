
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export const useSiteIcon = () => {
  const [siteIcon, setSiteIcon] = useState<string | null>(null);

  // Carica l'icona del sito dal localStorage all'avvio
  useEffect(() => {
    const savedIcon = localStorage.getItem('siteIcon');
    if (savedIcon) {
      setSiteIcon(savedIcon);
    }
  }, []);

  // Aggiorna l'icona del sito
  const updateSiteIcon = (iconUrl: string) => {
    setSiteIcon(iconUrl);
    
    if (iconUrl) {
      localStorage.setItem('siteIcon', iconUrl);
      toast.success("Icona del sito aggiornata");
    } else {
      localStorage.removeItem('siteIcon');
      toast.success("Icona del sito rimossa");
    }
    
    // Aggiorna anche il favicon nel DOM
    updateFavicon(iconUrl);
  };

  // Funzione per aggiornare il favicon del sito
  const updateFavicon = (iconUrl: string) => {
    if (!iconUrl) return;
    
    // Cerca un elemento link con rel="icon" esistente, usando un cast esplicito a HTMLLinkElement
    let link: HTMLLinkElement | null = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    
    // Se non esiste, creane uno nuovo
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    // Imposta l'href dell'elemento link al nuovo URL dell'icona
    link.href = iconUrl;
    link.type = 'image/svg+xml';
  };

  return {
    siteIcon,
    updateSiteIcon
  };
};

export default useSiteIcon;
