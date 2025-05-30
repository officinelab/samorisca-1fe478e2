
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Hook unificato per la gestione del device view
 * Elimina le inconsistenze tra deviceView prop e useIsMobile
 */
export const useDeviceView = (deviceViewProp?: 'mobile' | 'desktop') => {
  const isMobileHook = useIsMobile();
  
  // Se è fornito un prop specifico, usalo, altrimenti usa il hook
  const isMobile = deviceViewProp ? deviceViewProp === 'mobile' : isMobileHook;
  const deviceView = isMobile ? 'mobile' : 'desktop';
  
  return {
    isMobile,
    isDesktop: !isMobile,
    deviceView
  };
};
