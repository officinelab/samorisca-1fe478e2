
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Hook per calcolare l'altezza REALE dell'header dinamicamente
 */
export const useHeaderHeight = () => {
  const { siteSettings } = useSiteSettings();
  const [headerHeight, setHeaderHeight] = useState(72); // Valore iniziale dal debug
  
  // Calcola l'altezza reale dell'header dal DOM
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        const realHeight = header.offsetHeight;
        setHeaderHeight(realHeight);
      }
    };

    // Calcola subito
    calculateHeaderHeight();
    
    // Ri-calcola quando cambia la finestra (per sicurezza)
    window.addEventListener('resize', calculateHeaderHeight);
    
    // Ri-calcola con un piccolo delay per assicurarsi che il DOM sia aggiornato
    const timeout = setTimeout(calculateHeaderHeight, 100);
    
    return () => {
      window.removeEventListener('resize', calculateHeaderHeight);
      clearTimeout(timeout);
    };
  }, [siteSettings?.showRestaurantNameInMenuBar, siteSettings?.restaurantName]);
  
  const showRestaurantName = siteSettings?.showRestaurantNameInMenuBar !== false;
  
  return {
    headerHeight,
    showRestaurantName,
    baseHeight: headerHeight, // Ora è sempre corretto
    nameHeight: 0 // Non più necessario calcolare separatamente
  };
};
