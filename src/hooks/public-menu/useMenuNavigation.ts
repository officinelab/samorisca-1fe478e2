
import { useState, useRef, useEffect, useCallback } from "react";
import { useHeaderHeight } from "./useHeaderHeight";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categoriesMapRef = useRef<Array<{
    id: string;
    startY: number;
    endY: number;
    element: HTMLElement;
  }>>([]);
  
  const { headerHeight } = useHeaderHeight();
  
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
    }
  };

  const buildCategoriesMap = useCallback(() => {
    const containers = document.querySelectorAll('[id^="category-container-"]');
    const categoriesMap: typeof categoriesMapRef.current = [];
    
    containers.forEach((container, index) => {
      const htmlElement = container as HTMLElement;
      const categoryId = container.id.replace('category-container-', '');
      const startY = htmlElement.offsetTop;
      
      let endY;
      if (index === containers.length - 1) {
        endY = startY + htmlElement.offsetHeight;
      } else {
        const nextContainer = containers[index + 1] as HTMLElement;
        endY = nextContainer.offsetTop;
      }
      
      categoriesMap.push({
        id: categoryId,
        startY,
        endY,
        element: htmlElement
      });
    });
    
    categoriesMapRef.current = categoriesMap;
    console.log('Categories map built:', categoriesMap.map(c => ({
      id: c.id,
      start: c.startY,
      end: c.endY,
      height: c.endY - c.startY
    })));
    
    return categoriesMap;
  }, []);

  const calculateCurrentCategory = useCallback(() => {
    if (isManualScroll) return;
    
    const categoriesMap = categoriesMapRef.current;
    if (categoriesMap.length === 0) {
      buildCategoriesMap();
      return;
    }
    
    const referenceY = window.scrollY + headerHeight + 50;
    let currentCategory = null;
    
    for (const category of categoriesMap) {
      if (referenceY >= category.startY && referenceY < category.endY) {
        currentCategory = category.id;
        break;
      }
    }
    
    if (!currentCategory) {
      const visibleCategories = categoriesMap.filter(c => c.startY <= referenceY);
      if (visibleCategories.length > 0) {
        currentCategory = visibleCategories[visibleCategories.length - 1].id;
      }
    }
    
    if (currentCategory) {
      setSelectedCategory(prevCategory => {
        if (prevCategory !== currentCategory) {
          console.log(`Category updated: ${prevCategory} -> ${currentCategory}`);
          return currentCategory;
        }
        return prevCategory;
      });
    }
  }, [isManualScroll, headerHeight, buildCategoriesMap]);

  const setupScrollHighlighting = useCallback(() => {
    buildCategoriesMap();
    
    let ticking = false;
    
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateCurrentCategory();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    setTimeout(() => {
      calculateCurrentCategory();
    }, 100);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    const resizeHandler = () => {
      setTimeout(buildCategoriesMap, 200);
    };
    window.addEventListener('resize', resizeHandler);
    
    console.log('Positional scroll system activated');
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [calculateCurrentCategory, buildCategoriesMap]);

  const scrollToCategory = (categoryId: string) => {
    console.log('Manual scroll to category:', categoryId);
    
    setIsManualScroll(true);
    setSelectedCategory(categoryId);

    const element = document.getElementById(`category-container-${categoryId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('Manual scroll completed, re-enabling auto-detection');
      setIsManualScroll(false);
      buildCategoriesMap();
      setTimeout(calculateCurrentCategory, 200);
    }, 1500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const cleanup = setupScrollHighlighting();
    return cleanup;
  }, [setupScrollHighlighting]);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    selectedCategory,
    setSelectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    initializeCategory,
    setupScrollHighlighting
  };
};
