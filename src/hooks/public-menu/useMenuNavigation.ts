
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
  // Offset per il rilevamento della categoria attiva (più piccolo per maggiore precisione)
  const DETECTION_OFFSET = headerHeight + 10;
  
  const { findActiveCategory } = useCategoryPositions();
  
  const updateActiveCategory = useCallback(() => {
    if (isUserScrolling) return;
    
    const newActiveCategory = findActiveCategory(window.scrollY, DETECTION_OFFSET);
    
    if (newActiveCategory && newActiveCategory !== activeCategory) {
      setActiveCategory(newActiveCategory);
    }
  }, [activeCategory, findActiveCategory, isUserScrolling, DETECTION_OFFSET]);

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
