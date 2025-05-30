
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Hook per calcolare l'altezza dell'header in modo unificato
 * Considera la visibilità del nome del ristorante
 */
export const useHeaderHeight = () => {
  const { siteSettings } = useSiteSettings();
  
  const calculateHeaderHeight = (): number => {
    // Altezza base dell'header (pt-4 + logo + pb-2 + spazi)
    const baseHeight = 70;
    
    // Altezza aggiuntiva se il nome del ristorante è visibile
    const showRestaurantName = siteSettings?.showRestaurantNameInMenuBar !== false;
    const nameHeight = showRestaurantName ? 32 : 0; // mt-2 + text-xl + my-0
    
    return baseHeight + nameHeight;
  };
  
  return {
    headerHeight: calculateHeaderHeight(),
    showRestaurantName: siteSettings?.showRestaurantNameInMenuBar !== false
  };
};
