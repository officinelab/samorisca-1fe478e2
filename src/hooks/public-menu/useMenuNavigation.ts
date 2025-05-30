
import { useState, useRef, useEffect, useCallback } from "react";
import { useHeaderHeight } from "./useHeaderHeight";

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

  // INTERSECTION OBSERVER con protezione completa dalla race condition
  const setupScrollHighlighting = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Calcola l'offset per mobile (considerando la sidebar)
    const isMobile = window.innerWidth < 768;
    const mobileSidebarHeight = isMobile ? 73 : 0; // Dal debug precedente
    const totalOffset = headerHeight + mobileSidebarHeight + 16; // +16px di margine
    
    const observer = new IntersectionObserver(
      (entries) => {
        // PROTEZIONE CRITICA: non cambiare categoria durante scroll manuale
        if (isManualScroll) {
          console.log('🚫 Manual scroll in progress, ignoring intersection changes');
          return;
        }
        
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            
            // Priorità alla categoria più vicina alla posizione target
            const targetPos = totalOffset;
            const aDistance = Math.abs(aTop - targetPos);
            const bDistance = Math.abs(bTop - targetPos);
            
            return aDistance - bDistance;
          });
        
        if (visibleEntries.length > 0) {
          const categoryId = visibleEntries[0].target.id.replace('category-', '');
          console.log('🎯 Auto-selecting category:', categoryId);
          setSelectedCategory(categoryId);
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.3, 0.5],
        // Usa l'offset totale calcolato dinamicamente
        rootMargin: `-${totalOffset}px 0px -50% 0px`
      }
    );

    observerRef.current = observer;

    // Delay maggiore per assicurare che il DOM sia stabile
    setTimeout(() => {
      const categoryElements = document.querySelectorAll('[id^="category-"]');
      console.log(`🔍 Setting up observer for ${categoryElements.length} categories`);
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 500); // Aumentato a 500ms

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isManualScroll, headerHeight]);

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
  
  // SCROLL CORRETTO con protezione dalla race condition
  const scrollToCategory = (categoryId: string) => {
    console.log('🚀 Manual scroll to category:', categoryId);
    
    // PROTEZIONE 1: Setta il flag prima di tutto
    setIsManualScroll(true);
    setSelectedCategory(categoryId);

    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Calcola l'offset dinamicamente
      const isMobile = window.innerWidth < 768;
      const mobileSidebarHeight = isMobile ? 73 : 0;
      const totalOffset = headerHeight + mobileSidebarHeight + 16;
      
      const elementTop = element.offsetTop;
      const scrollPosition = Math.max(0, elementTop - totalOffset);
      
      console.log('📍 Scroll calculation:', {
        headerHeight,
        mobileSidebarHeight,
        totalOffset,
        elementTop,
        scrollPosition
      });
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }

    // PROTEZIONE 2: Timeout più lungo per evitare interferenze
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('✅ Manual scroll completed, re-enabling auto-detection');
      setIsManualScroll(false);
    }, 1500); // Aumentato a 1500ms per evitare interferenze
  };
  
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
