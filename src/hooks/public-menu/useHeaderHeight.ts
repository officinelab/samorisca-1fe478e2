
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Hook semplificato per calcolare l'altezza dell'header
 * Usa valori CSS fissi per evitare loop infiniti
 */
export const useHeaderHeight = () => {
  const { siteSettings } = useSiteSettings();
  
  // Valori CSS fissi basati sul design reale
  const BASE_HEADER_HEIGHT = 72; // Header principale fisso
  const RESTAURANT_NAME_HEIGHT = 36; // Altezza aggiuntiva quando c'è il nome
  
  const showRestaurantName = siteSettings?.showRestaurantNameInMenuBar !== false;
  
  // Calcolo semplice e deterministico
  const headerHeight = showRestaurantName 
    ? BASE_HEADER_HEIGHT + RESTAURANT_NAME_HEIGHT 
    : BASE_HEADER_HEIGHT;
  
  return {
    headerHeight,
    showRestaurantName,
    baseHeight: BASE_HEADER_HEIGHT,
    nameHeight: showRestaurantName ? RESTAURANT_NAME_HEIGHT : 0
  };
};
