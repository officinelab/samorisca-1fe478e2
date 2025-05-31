
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
  // Usa lo stesso offset unificato in tutto il sistema
  const UNIFIED_OFFSET = headerHeight + 20;
  
  const { findActiveCategory } = useCategoryPositions();
  
  const updateActiveCategory = useCallback(() => {
    // Non aggiornare se l'utente sta scrollando programmaticamente
    if (isUserScrolling) {
      console.log('Skipping category update - user is scrolling programmatically');
      return;
    }
    
    const newActiveCategory = findActiveCategory(window.scrollY, UNIFIED_OFFSET);
    
    if (newActiveCategory && newActiveCategory !== activeCategory) {
      console.log(`Natural scroll - updating active category to: ${newActiveCategory}`);
      setActiveCategory(newActiveCategory);
    }
  }, [activeCategory, findActiveCategory, isUserScrolling, UNIFIED_OFFSET]);

  const { scrollToCategory, scrollToTop, initializeCategory } = useCategoryManagement({
    headerHeight,
    isUserScrolling,
    setIsUserScrolling,
    setActiveCategory
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
