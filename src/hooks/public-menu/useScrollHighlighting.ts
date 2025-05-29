
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
      console.log('Setting up intersection observer for scroll highlighting');

      // Calcola gli offset in modo più semplice
      const header = document.querySelector('header');
      const mobileSidebar = document.getElementById('mobile-category-sidebar');
      
      const headerHeight = header ? header.offsetHeight : 104;
      const sidebarHeight = mobileSidebar ? mobileSidebar.offsetHeight : 64;
      const totalOffset = headerHeight + sidebarHeight;
      
      console.log('Calculated offsets:', { headerHeight, sidebarHeight, totalOffset });

      const observer = new IntersectionObserver(
        (entries) => {
          if (isManualScroll) {
            console.log('Skipping scroll highlighting - manual scroll in progress');
            return;
          }
          
          // Trova tutte le categorie attualmente visibili
          const visibleCategories = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => {
              const categoryId = entry.target.id.replace('category-', '');
              const rect = entry.boundingClientRect;
              return {
                id: categoryId,
                top: rect.top,
                ratio: entry.intersectionRatio,
                element: entry.target
              };
            })
            .sort((a, b) => a.top - b.top); // Ordina per posizione dall'alto
          
          if (visibleCategories.length === 0) return;
          
          // Seleziona la categoria più in alto che è visibile sopra il punto di riferimento
          const referencePoint = totalOffset + 20;
          
          // Trova la categoria che dovrebbe essere attiva
          let selectedCategory = null;
          
          // Prima cerca categorie che sono sopra il punto di riferimento
          for (const category of visibleCategories) {
            if (category.top <= referencePoint) {
              selectedCategory = category;
            } else {
              break; // Se questa categoria è sotto il punto di riferimento, fermati
            }
          }
          
          // Se nessuna categoria è sopra il punto di riferimento, prendi la prima visibile
          if (!selectedCategory && visibleCategories.length > 0) {
            selectedCategory = visibleCategories[0];
          }
          
          if (selectedCategory && selectedCategory.id !== lastSelectedRef.current) {
            lastSelectedRef.current = selectedCategory.id;
            console.log('Auto-selecting category via scroll:', selectedCategory.id);
            setSelectedCategory(selectedCategory.id);
            
            // Aggiorna l'URL hash
            const targetHash = `#category-${selectedCategory.id}`;
            if (window.location.hash !== targetHash) {
              window.history.replaceState(null, '', targetHash);
            }
          }
        },
        {
          root: null,
          threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0],
          // Usa un rootMargin più conservativo
          rootMargin: `-${totalOffset + 10}px 0px -50% 0px`
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

    // Setup con un breve delay
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
