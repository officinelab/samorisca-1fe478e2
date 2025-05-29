
import { useRef, useCallback } from "react";
import { waitForDOMReady, calculateStickyOffset } from "./utils/domCalculations";

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

    // Setup dell'observer più veloce
    const setupObserver = async () => {
      // Aspetta che il DOM sia pronto
      await waitForDOMReady();
      
      // Calcola l'offset dinamico
      const dynamicOffset = await calculateStickyOffset();
      const rootMargin = `-${dynamicOffset}px 0px -40% 0px`;
      console.log('Using rootMargin:', rootMargin);

      // Create new intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          // Blocca l'observer durante lo scroll manuale in modo più aggressivo
          if (isManualScroll) {
            console.log('Blocking observer during manual scroll');
            return;
          }
          
          // Trova tutte le categorie visibili
          const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => {
              // Se una categoria è al top del viewport (o molto vicina), ha priorità
              const aTop = a.boundingClientRect.top;
              const bTop = b.boundingClientRect.top;
              
              // Priorità alla categoria più vicina al top del viewport
              if (Math.abs(aTop) < 50) return -1;
              if (Math.abs(bTop) < 50) return 1;
              
              // Altrimenti ordina per posizione verticale
              return aTop - bTop;
            });
          
          if (visibleEntries.length > 0) {
            const categoryId = visibleEntries[0].target.id.replace('category-', '');
            console.log('Auto-selecting category:', categoryId);
            setSelectedCategory(categoryId);
          }
        },
        {
          root: null,
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
          rootMargin: rootMargin
        }
      );

      observerRef.current = observer;

      // Osserva tutte le sezioni categoria
      const categoryElements = document.querySelectorAll('[id^="category-"]');
      console.log('Observing', categoryElements.length, 'category elements');
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    };

    // Delay ridotto per essere più reattivo
    setTimeout(setupObserver, 200);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isManualScroll, setSelectedCategory]);

  return { setupScrollHighlighting };
};
