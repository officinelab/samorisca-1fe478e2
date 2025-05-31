import { useState, useCallback } from 'react';
import { useHeaderHeight } from './useHeaderHeight';
import { useCategoryPositions } from './utils/categoryPositions';
import { useScrollHandling } from './utils/scrollHandling';
import { useCategoryManagement } from './utils/categoryManagement';

export const useMenuNavigation = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  const { headerHeight } = useHeaderHeight();
  
  // Calcola l'offset completo dinamicamente
  const calculateTotalOffset = useCallback(() => {
    const header = document.querySelector('header') as HTMLElement;
    const sidebar = document.querySelector('#mobile-category-sidebar') as HTMLElement;
    const headerH = header?.offsetHeight || headerHeight;
    const sidebarH = sidebar?.offsetHeight || 0;
    return headerH + sidebarH + 20; // 20px padding
  }, [headerHeight]);
  
  const { findActiveCategory } = useCategoryPositions();
  
  const updateActiveCategory = useCallback(() => {
    // Non aggiornare se l'utente sta scrollando programmaticamente
    if (isUserScrolling) {
      console.log('Skipping category update - user is scrolling programmatically');
      return;
    }
    
    const currentOffset = calculateTotalOffset();
    const newActiveCategory = findActiveCategory(window.scrollY, currentOffset);
    
    if (newActiveCategory && newActiveCategory !== activeCategory) {
      console.log(`Natural scroll - updating active category to: ${newActiveCategory}`);
      setActiveCategory(newActiveCategory);
    }
  }, [activeCategory, findActiveCategory, isUserScrolling, calculateTotalOffset]);

  const { scrollToCategory, scrollToTop, initializeCategory } = useCategoryManagement({
    headerHeight,
    isUserScrolling,
    setIsUserScrolling,
    setActiveCategory,
    calculateTotalOffset
  });

  useScrollHandling({
    updateActiveCategory,
    setShowBackToTop
  });

  const handleInitializeCategory = useCallback((categoryId: string | null) => {
    initializeCategory(categoryId, activeCategory);
  }, [initializeCategory, activeCategory]);

  return {
    selectedCategory: activeCategory,
    setSelectedCategory: setActiveCategory,
    showBackToTop,
    menuRef: { current: null },
    scrollToCategory,
    scrollToTop,
    initializeCategory: handleInitializeCategory,
    setupScrollHighlighting: () => () => {}
  };
};