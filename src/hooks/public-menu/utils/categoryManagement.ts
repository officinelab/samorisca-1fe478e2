
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
    
    const targetY = element.offsetTop - headerHeight - 32;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      // Verifica che siamo nella posizione corretta prima di riattivare l'auto-detection
      const currentScroll = window.scrollY;
      const expectedPosition = Math.max(0, targetY);
      const tolerance = 50; // Tolleranza di 50px
      
      if (Math.abs(currentScroll - expectedPosition) <= tolerance) {
        setIsUserScrolling(false);
      } else {
        // Se non siamo nella posizione corretta, aspetta ancora un po'
        setTimeout(() => {
          setIsUserScrolling(false);
        }, 500);
      }
    }, 2000);
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
