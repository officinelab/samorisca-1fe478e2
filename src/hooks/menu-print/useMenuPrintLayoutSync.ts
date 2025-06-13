
import { useEffect } from 'react';

export const useMenuPrintLayoutSync = (forceRefresh: () => void) => {
  useEffect(() => {
    const handleLayoutUpdate = (event: CustomEvent) => {
      console.log("Layout aggiornato, ricarico i layout...", event.detail);
      forceRefresh();
    };

    // Listen for the custom event dispatched when layouts are saved
    window.addEventListener('layoutUpdated', handleLayoutUpdate as EventListener);
    
    return () => {
      window.removeEventListener('layoutUpdated', handleLayoutUpdate as EventListener);
    };
  }, [forceRefresh]);
};
