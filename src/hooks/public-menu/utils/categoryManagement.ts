
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
    
    const targetY = element.offsetTop - headerHeight - 16;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
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
