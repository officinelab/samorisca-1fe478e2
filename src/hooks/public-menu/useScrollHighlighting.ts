
import { useRef, useCallback } from "react";

export const useScrollHighlighting = (
  isManualScroll: boolean,
  setSelectedCategory: (categoryId: string) => void
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupScrollHighlighting = useCallback(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const setupObserver = () => {
      console.log('Setting up simplified intersection observer');

      // Calcolo offset semplificato
      const header = document.querySelector('header');
      const mobileSidebar = document.getElementById('mobile-category-sidebar');
      
      const headerHeight = header ? header.offsetHeight : 104;
      const sidebarHeight = mobileSidebar ? mobileSidebar.offsetHeight : 64;
      const totalOffset = headerHeight + sidebarHeight + 20; // 20px buffer
      
      console.log('Using offset:', totalOffset);

      const observer = new IntersectionObserver(
        (entries) => {
          if (isManualScroll) {
            console.log('Skipping - manual scroll active');
            return;
          }
          
          // Trova la categoria più visibile nella parte superiore dello schermo
          let bestCategory = null;
          let bestRatio = 0;
          
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
              const categoryId = entry.target.id.replace('category-', '');
              const rect = entry.boundingClientRect;
              
              // Preferisci categorie che sono nella parte superiore visibile
              if (rect.top <= totalOffset + 100) { // 100px di tolleranza
                bestCategory = categoryId;
                bestRatio = entry.intersectionRatio;
              }
            }
          });
          
          if (bestCategory) {
            console.log('Auto-selecting category:', bestCategory);
            setSelectedCategory(bestCategory);
            
            // Aggiorna URL
            const targetHash = `#category-${bestCategory}`;
            if (window.location.hash !== targetHash) {
              window.history.replaceState(null, '', targetHash);
            }
          }
        },
        {
          root: null,
          threshold: [0, 0.1, 0.3, 0.5],
          rootMargin: `-${totalOffset}px 0px -40% 0px` // Più permissivo
        }
      );

      observerRef.current = observer;

      // Osserva tutte le sezioni categoria
      const categoryElements = document.querySelectorAll('[data-category-id]');
      console.log('Observing category elements:', categoryElements.length);
      categoryElements.forEach((element) => {
        observer.observe(element);
      });
    };

    // Setup immediato
    setupObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [isManualScroll, setSelectedCategory]);

  return { setupScrollHighlighting };
};
