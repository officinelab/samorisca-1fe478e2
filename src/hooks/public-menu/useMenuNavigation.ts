
import { useState, useCallback, useMemo } from 'react';
import { useHeaderHeight } from './useHeaderHeight';
import { useCategoryPositions } from './utils/categoryPositions';
import { useScrollHandling } from './utils/scrollHandling';
import { useCategoryManagement } from './utils/categoryManagement';

export const useMenuNavigation = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  const { headerHeight } = useHeaderHeight();
  const SCROLL_OFFSET = useMemo(() => headerHeight + 100, [headerHeight]);
  
  const { findActiveCategory } = useCategoryPositions();
  
  const updateActiveCategory = useCallback(() => {
    if (isUserScrolling) return;
    
    const newActiveCategory = findActiveCategory(window.scrollY, SCROLL_OFFSET);
    
    if (newActiveCategory && newActiveCategory !== activeCategory) {
      setActiveCategory(newActiveCategory);
    }
  }, [activeCategory, findActiveCategory, isUserScrolling, SCROLL_OFFSET]);

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
    menuRef: { current: null }, // Compatibility with existing interface
    scrollToCategory,
    scrollToTop,
    initializeCategory: handleInitializeCategory,
    setupScrollHighlighting: () => () => {} // Compatibility method
  };
};
