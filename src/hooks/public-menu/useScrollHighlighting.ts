
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

    // Setup dell'observer semplificato
    const setupObserver = () => {
      console.log('Setting up simplified intersection observer');

      // Create new intersection observer con configurazione semplificata
      const observer = new IntersectionObserver(
        (entries) => {
          // Blocca completamente l'observer durante lo scroll manuale
          if (isManualScroll) {
            console.log('Observer blocked during manual scroll');
            return;
          }
          
          // Trova la categoria più visibile al centro del viewport
          const visibleEntries = entries
            .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.1)
            .sort((a, b) => {
              // Priorità alla categoria più vicina al centro del viewport
              const aCenter = Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2);
              const bCenter = Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2);
              return aCenter - bCenter;
            });
          
          if (visibleEntries.length > 0) {
            const categoryId = visibleEntries[0].target.id.replace('category-', '');
            console.log('Auto-selecting category:', categoryId);
            setSelectedCategory(categoryId);
            
            // Aggiorna l'URL hash senza scroll
            const targetHash = `#category-${categoryId}`;
            if (window.location.hash !== targetHash) {
              window.history.replaceState(null, '', targetHash);
            }
          }
        },
        {
          root: null,
          threshold: [0.1, 0.3, 0.5, 0.7],
          rootMargin: '-100px 0px -50% 0px' // Offset fisso semplificato
        }
      );

      observerRef.current = observer;

      // Osserva tutte le sezioni categoria
      const categoryElements = document.querySelectorAll('[data-category-id]');
      console.log('Observing', categoryElements.length, 'category elements');
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    };

    // Setup immediato senza delay
    setupObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isManualScroll, setSelectedCategory]);

  return { setupScrollHighlighting };
};
