
import { useCallback } from 'react';

interface UseCategoryManagementProps {
  headerHeight: number;
  isUserScrolling: boolean;
  setIsUserScrolling: (scrolling: boolean) => void;
  setActiveCategory: (category: string) => void;
}

export const useCategoryManagement = ({
  headerHeight,
  isUserScrolling,
  setIsUserScrolling,
  setActiveCategory
}: UseCategoryManagementProps) => {
  const scrollToCategory = useCallback((categoryId: string) => {
    const element = document.getElementById(`category-container-${categoryId}`);
    if (!element) return;
    
    // Attendi che il layout sia stabile prima di scrollare
    const performScroll = () => {
      setIsUserScrolling(true);
      setActiveCategory(categoryId);
      
      // Offset per lo scroll: headerHeight + 20px per margine visivo
      const SCROLL_OFFSET = headerHeight + 20;
      const targetY = element.offsetTop - SCROLL_OFFSET;
      const finalPosition = Math.max(0, targetY);
      
      console.log(`Scrolling to category ${categoryId}:`, {
        elementTop: element.offsetTop,
        headerHeight,
        scrollOffset: SCROLL_OFFSET,
        targetY,
        finalPosition
      });
      
      window.scrollTo({
        top: finalPosition,
        behavior: 'smooth'
      });
      
      // Sistema di retry per garantire precisione
      let retryCount = 0;
      const maxRetries = 3;
      
      const checkScrollComplete = () => {
        const currentScroll = window.scrollY;
        const tolerance = 15; // Tolleranza per il controllo di precisione
        
        console.log(`Scroll check ${retryCount + 1}:`, {
          currentScroll,
          finalPosition,
          difference: Math.abs(currentScroll - finalPosition)
        });
        
        if (Math.abs(currentScroll - finalPosition) <= tolerance) {
          // Scroll completato correttamente
          setTimeout(() => setIsUserScrolling(false), 150);
        } else if (retryCount < maxRetries) {
          // Retry se non siamo nella posizione corretta
          retryCount++;
          setTimeout(() => {
            const newScroll = window.scrollY;
            if (Math.abs(newScroll - currentScroll) < 5) {
              // Lo scroll si è fermato ma non nella posizione corretta, riprova
              console.log(`Retry scroll ${retryCount} for category ${categoryId}`);
              window.scrollTo({
                top: finalPosition,
                behavior: 'smooth'
              });
              setTimeout(checkScrollComplete, 800);
            } else {
              // Lo scroll è ancora in corso
              setTimeout(checkScrollComplete, 300);
            }
          }, 300);
        } else {
          // Massimo tentativi raggiunto, termina comunque
          console.log(`Max retries reached for category ${categoryId}`);
          setIsUserScrolling(false);
        }
      };
      
      // Inizia il controllo dopo un delay per permettere l'inizio dello scroll
      setTimeout(checkScrollComplete, 1000);
    };
    
    // Verifica se il layout è stabile (immagini caricate, elementi renderizzati)
    const checkLayoutStability = () => {
      const images = element.querySelectorAll('img');
      const allImagesLoaded = Array.from(images).every(img => img.complete);
      
      if (allImagesLoaded || images.length === 0) {
        performScroll();
      } else {
        // Attendi il caricamento delle immagini
        setTimeout(performScroll, 200);
      }
    };
    
    // Piccolo delay per permettere il rendering completo
    setTimeout(checkLayoutStability, 100);
  }, [headerHeight, setIsUserScrolling, setActiveCategory]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const initializeCategory = useCallback((categoryId: string | null, activeCategory: string | null) => {
    if (categoryId && !activeCategory) {
      setActiveCategory(categoryId);
    }
  }, [setActiveCategory]);

  return {
    scrollToCategory,
    scrollToTop,
    initializeCategory
  };
};
