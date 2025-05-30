
import { useState, useRef, useEffect, useCallback } from "react";
import { useHeaderHeight } from "./useHeaderHeight";

const MOBILE_SIDEBAR_HEIGHT = 73;
const SCROLL_MARGIN = 16;

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { headerHeight } = useHeaderHeight();
  
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
    }
  };

  // Calcola offset totale una sola volta per evitare re-render
  const getTotalOffset = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    return headerHeight + (isMobile ? MOBILE_SIDEBAR_HEIGHT : 0) + SCROLL_MARGIN;
  }, [headerHeight]);

  // Sistema di scroll migliorato con debouncing
  const scrollToCategory = useCallback((categoryId: string) => {
    console.log('🚀 Scrolling to category:', categoryId);
    
    // Imposta immediatamente lo stato per evitare interferenze
    setIsManualScroll(true);
    setSelectedCategory(categoryId);

    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const totalOffset = getTotalOffset();
      const elementTop = element.offsetTop;
      const scrollPosition = Math.max(0, elementTop - totalOffset);
      
      console.log('📍 Scroll data:', {
        categoryId,
        headerHeight,
        totalOffset,
        elementTop,
        scrollPosition
      });
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }

    // Debouncing per il flag manual scroll
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('✅ Manual scroll completed');
      setIsManualScroll(false);
    }, 1000);
  }, [headerHeight, getTotalOffset]);

  // Intersection Observer semplificato e robusto
  const setupScrollHighlighting = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const totalOffset = getTotalOffset();
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) {
          console.log('🚫 Manual scroll active, skipping observer');
          return;
        }
        
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            const aDistance = Math.abs(a.boundingClientRect.top - totalOffset);
            const bDistance = Math.abs(b.boundingClientRect.top - totalOffset);
            return aDistance - bDistance;
          });
        
        if (visibleEntries.length > 0) {
          const categoryId = visibleEntries[0].target.id.replace('category-', '');
          console.log('🎯 Observer selecting category:', categoryId);
          setSelectedCategory(categoryId);
        }
      },
      {
        root: null,
        threshold: [0, 0.2, 0.5],
        rootMargin: `-${totalOffset}px 0px -50% 0px`
      }
    );

    observerRef.current = observer;

    // Ritardo fisso per stabilità
    setTimeout(() => {
      const categoryElements = document.querySelectorAll('[id^="category-"]');
      console.log(`🔍 Observing ${categoryElements.length} categories`);
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 300);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [getTotalOffset, isManualScroll]);

  // Setup degli event listener
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

  // Setup observer - solo quando cambiano le dipendenze essenziali
  useEffect(() => {
    const cleanup = setupScrollHighlighting();
    return cleanup;
  }, [setupScrollHighlighting]);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Cleanup finale
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
    setupScrollHighlighting,
    getTotalOffset // Esporta per uso esterno
  };
};
