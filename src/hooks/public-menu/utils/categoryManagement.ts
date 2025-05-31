
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
    
    setIsUserScrolling(true);
    setActiveCategory(categoryId);
    
    // Usa lo stesso offset che usa findActiveCategory per consistency
    const targetY = element.offsetTop - headerHeight - 100;
    const finalPosition = Math.max(0, targetY);
    
    window.scrollTo({
      top: finalPosition,
      behavior: 'smooth'
    });
    
    // Usa un approccio più robusto per detectare quando lo scroll è finito
    const checkScrollComplete = () => {
      const currentScroll = window.scrollY;
      const tolerance = 30; // Tolleranza ridotta
      
      if (Math.abs(currentScroll - finalPosition) <= tolerance) {
        // Scroll completato correttamente
        setTimeout(() => setIsUserScrolling(false), 100);
      } else {
        // Verifica se lo scroll si è fermato (anche se non nella posizione esatta)
        setTimeout(() => {
          const newScroll = window.scrollY;
          if (Math.abs(newScroll - currentScroll) < 5) {
            // Lo scroll si è fermato, riattiva auto-detection
            setIsUserScrolling(false);
          } else {
            // Lo scroll è ancora in corso, ricontrolla
            checkScrollComplete();
          }
        }, 200);
      }
    };
    
    // Inizia il controllo dopo un delay iniziale
    setTimeout(checkScrollComplete, 1000);
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
