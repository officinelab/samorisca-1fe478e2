
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
      
      console.log('Calculated offsets for scroll highlighting:', { headerHeight, sidebarHeight, totalOffset });

      const observer = new IntersectionObserver(
        (entries) => {
          if (isManualScroll) {
            console.log('Skipping scroll highlighting - manual scroll in progress');
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
          
          // Trova la categoria più vicina al punto di riferimento (subito sotto gli elementi sticky)
          const referencePoint = totalOffset + 50; // Punto di riferimento più preciso
          
          let bestCategory = null;
          let bestScore = -1;
          
          visibleEntries.forEach(entry => {
            // Calcola la distanza dal punto di riferimento
            const distanceFromReference = Math.abs(entry.rect.top - referencePoint);
            
            // Score inversamente proporzionale alla distanza (più vicina = score migliore)
            // e proporzionale al ratio di visibilità
            const score = (1000 - distanceFromReference) * entry.ratio;
            
            console.log(`Category ${entry.id}: distance=${distanceFromReference.toFixed(2)}, ratio=${entry.ratio.toFixed(2)}, score=${score.toFixed(2)}`);
            
            if (score > bestScore) {
              bestScore = score;
              bestCategory = entry;
            }
          });
          
          if (bestCategory && bestCategory.id !== lastSelectedRef.current) {
            lastSelectedRef.current = bestCategory.id;
            console.log('Auto-selecting category via scroll:', bestCategory.id);
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
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
          // Aggiorna il rootMargin per essere più preciso con il nuovo posizionamento
          rootMargin: `-${totalOffset}px 0px -40% 0px`
        }
      );

      observerRef.current = observer;

      // Osserva tutte le sezioni categoria
      const categoryElements = document.querySelectorAll('[data-category-id]');
      console.log('Observing', categoryElements.length, 'category elements for scroll highlighting');
      categoryElements.forEach((element) => {
        observer.observe(element);
      });
    };

    // Aspetta un momento per assicurarsi che tutti gli elementi siano renderizzati
    setTimeout(setupObserver, 100);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [isManualScroll, setSelectedCategory]);

  return { setupScrollHighlighting };
};
