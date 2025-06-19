// hooks/menu-print/useMenuPrintLayoutSync.ts
import { useEffect } from 'react';

/**
 * Hook che ascolta gli eventi di aggiornamento del layout e forza il refresh
 */
export const useMenuPrintLayoutSync = (onLayoutUpdate: () => void) => {
  useEffect(() => {
    const handleLayoutUpdate = (event: CustomEvent) => {
      console.log('🔄 Layout aggiornato, refresh in corso...', event.detail);
      // Piccolo delay per assicurarsi che il DB sia aggiornato
      setTimeout(() => {
        onLayoutUpdate();
      }, 100);
    };

    // Ascolta l'evento personalizzato
    window.addEventListener('layoutUpdated', handleLayoutUpdate as EventListener);

    return () => {
      window.removeEventListener('layoutUpdated', handleLayoutUpdate as EventListener);
    };
  }, [onLayoutUpdate]);
};