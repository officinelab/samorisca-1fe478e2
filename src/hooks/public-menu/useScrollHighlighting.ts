import { useRef, useCallback } from "react";

export const useScrollHighlighting = (
  isManualScroll: boolean,
  setSelectedCategory: (categoryId: string) => void
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastSelectedRef = useRef<string | null>(null);

  const setupScrollHighlighting = useCallback(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const setupObserver = () => {
      console.log('Setting up intersection observer (once)');

      // Ottieni le altezze reali degli elementi sticky
      const header = document.querySelector('header');
      const mobileSidebar = document.getElementById('mobile-category-sidebar');
      
      const headerHeight = header ? header.offsetHeight : 104;
      const sidebarHeight = mobileSidebar ? mobileSidebar.offsetHeight : 64;
      const totalOffset = headerHeight + sidebarHeight;
      
      console.log('Calculated offsets:', { headerHeight, sidebarHeight, totalOffset });

      const observer = new IntersectionObserver(
        (entries) => {
          if (isManualScroll) {
            return;
          }
          
          // Raccogli tutte le entries visibili
          const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => ({
              id: entry.target.id.replace('category-', ''),
              rect: entry.boundingClientRect,
              ratio: entry.intersectionRatio
            }));
          
          if (visibleEntries.length === 0) return;
          
          // Trova la categoria che occupa più spazio vicino al top
          // Consideriamo un "punto di riferimento" subito sotto gli elementi sticky
          const referencePoint = totalOffset + 100;
          
          let bestCategory = null;
          let bestScore = -1;
          
          visibleEntries.forEach(entry => {
            // Calcola quanto della categoria è visibile sotto il punto di riferimento
            const topVisible = Math.max(0, entry.rect.top - referencePoint);
            const bottomVisible = Math.min(window.innerHeight, entry.rect.bottom) - referencePoint;
            const visibleHeight = bottomVisible - topVisible;
            
            // Score basato su quanto è visibile e quanto è vicina al punto di riferimento
            const distanceFromReference = Math.abs(entry.rect.top - referencePoint);
            const score = visibleHeight - (distanceFromReference * 0.1);
            
            if (score > bestScore) {
              bestScore = score;
              bestCategory = entry;
            }
          });
          
          if (bestCategory && bestCategory.id !== lastSelectedRef.current) {
            lastSelectedRef.current = bestCategory.id;
            console.log('Auto-selecting category:', bestCategory.id);
            setSelectedCategory(bestCategory.id);
            
            // Aggiorna l'URL hash senza scroll
            const targetHash = `#category-${bestCategory.id}`;
            if (window.location.hash !== targetHash) {
              window.history.replaceState(null, '', targetHash);
            }
          }
        },
        {
          root: null,
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
          rootMargin: `-${totalOffset + 20}px 0px -30% 0px`
        }
      );

      observerRef.current = observer;

      // Osserva tutte le sezioni categoria
      const categoryElements = document.querySelectorAll('[data-category-id]');
      console.log('Observing', categoryElements.length, 'category elements');
      categoryElements.forEach((element) => {
        observer.observe(element);
      });
    };

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