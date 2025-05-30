
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Hook per calcolare l'altezza unificata dell'header
 * VALORI CORRETTI basati sui dati reali dal debug
 */
export const useHeaderHeight = () => {
  const { siteSettings } = useSiteSettings();
  
  // VALORI REALI dal debug:
  // - Header principale: 72px
  // - Mobile sidebar quando presente: 73px aggiuntivi
  const HEADER_HEIGHT = 72;
  const MOBILE_SIDEBAR_HEIGHT = 73;
  
  const showRestaurantName = siteSettings?.showRestaurantNameInMenuBar !== false;
  
  // Per mobile, considera anche la sidebar
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const totalHeaderHeight = isMobile 
    ? HEADER_HEIGHT + MOBILE_SIDEBAR_HEIGHT // 145px su mobile
    : HEADER_HEIGHT; // 72px su desktop
  
  return {
    headerHeight: totalHeaderHeight,
    showRestaurantName,
    baseHeight: HEADER_HEIGHT,
    mobileSidebarHeight: isMobile ? MOBILE_SIDEBAR_HEIGHT : 0
  };
};
