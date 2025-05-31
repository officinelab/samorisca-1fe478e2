
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useHeaderHeight } from './useHeaderHeight';

interface CategoryPosition {
  id: string;
  element: HTMLElement;
  top: number;
  bottom: number;
}

export const useMenuNavigation = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  const { headerHeight } = useHeaderHeight();
  
  const SCROLL_OFFSET = useMemo(() => headerHeight + 100, [headerHeight]);
  
  const getCategoryPositions = useCallback((): CategoryPosition[] => {
    const containers = document.querySelectorAll<HTMLElement>('[id^="category-container-"]');
    
    return Array.from(containers).map(element => ({
      id: element.id.replace('category-container-', ''),
      element,
      top: element.offsetTop,
      bottom: element.offsetTop + element.offsetHeight
    }));
  }, []);
  
  const findActiveCategory = useCallback((scrollY: number): string | null => {
    const positions = getCategoryPositions();
    const targetY = scrollY + SCROLL_OFFSET;
    
    const activePosition = positions.find(pos => 
      targetY >= pos.top && targetY < pos.bottom
    );
    
    if (activePosition) {
      return activePosition.id;
    }
    
    const categoriesAbove = positions.filter(pos => pos.top <= targetY);
    if (categoriesAbove.length > 0) {
      return categoriesAbove[categoriesAbove.length - 1].id;
    }
    
    return positions[0]?.id || null;
  }, [SCROLL_OFFSET, getCategoryPositions]);
  
  const updateActiveCategory = useCallback(() => {
    if (isUserScrolling) return;
    
    const newActiveCategory = findActiveCategory(window.scrollY);
    
    if (newActiveCategory && newActiveCategory !== activeCategory) {
      setActiveCategory(newActiveCategory);
    }
  }, [activeCategory, findActiveCategory, isUserScrolling]);
  
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
  }, [headerHeight]);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const initializeCategory = useCallback((categoryId: string | null) => {
    if (categoryId && !activeCategory) {
      setActiveCategory(categoryId);
    }
  }, [activeCategory]);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateActiveCategory, 50);
    };
    
    updateActiveCategory();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [updateActiveCategory]);
  
  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateActiveCategory, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateActiveCategory]);
  
  return {
    selectedCategory: activeCategory,
    setSelectedCategory: setActiveCategory,
    showBackToTop,
    menuRef: { current: null }, // Compatibility with existing interface
    scrollToCategory,
    scrollToTop,
    initializeCategory,
    setupScrollHighlighting: () => () => {} // Compatibility method
  };
};
