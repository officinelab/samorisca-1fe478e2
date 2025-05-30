
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Hook per calcolare l'altezza unificata dell'header
 * Considera la visibilità del nome del ristorante
 */
export const useHeaderHeight = () => {
  const { siteSettings } = useSiteSettings();
  
  // Altezza base dell'header (pt-4 + logo + spazi)
  const BASE_HEIGHT = 70;
  
  // Altezza aggiuntiva se il nome del ristorante è visibile (mt-2 + testo + pb-2)
  const NAME_HEIGHT = 32;
  
  // Calcola se il nome è visibile (default: true se non specificato)
  const showRestaurantName = siteSettings?.showRestaurantNameInMenuBar !== false;
  
  // Altezza totale
  const headerHeight = BASE_HEIGHT + (showRestaurantName ? NAME_HEIGHT : 0);
  
  return {
    headerHeight,
    showRestaurantName,
    baseHeight: BASE_HEIGHT,
    nameHeight: showRestaurantName ? NAME_HEIGHT : 0
  };
};
