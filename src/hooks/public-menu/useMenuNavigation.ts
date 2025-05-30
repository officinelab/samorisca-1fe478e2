
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

  // INTERSECTION OBSERVER CORRETTO con valori reali
  const setupScrollHighlighting = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // VALORI CORRETTI dal debug:
    // Desktop: Header(72px) + margine(16px) = 88px
    // Mobile: Header(72px) + Sidebar(73px) + margine(16px) = 161px
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const topMargin = isMobile ? 161 : 88;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return;
        
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            
            // Priorità alla categoria più vicina alla posizione target
            const targetPos = topMargin;
            const aDistance = Math.abs(aTop - targetPos);
            const bDistance = Math.abs(bTop - targetPos);
            
            return aDistance - bDistance;
          });
        
        if (visibleEntries.length > 0) {
          const categoryId = visibleEntries[0].target.id.replace('category-', '');
          setSelectedCategory(categoryId);
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.3, 0.5],
        // ROOTMARGIN CORRETTO basato sui valori reali
        rootMargin: `-${topMargin}px 0px -50% 0px`
      }
    );

    observerRef.current = observer;

    setTimeout(() => {
      const categoryElements = document.querySelectorAll('[id^="category-"]');
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
  }, [isManualScroll]);

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
  
  // SCROLL CORRETTO - usa valori reali dal debug
  const scrollToCategory = (categoryId: string) => {
    setIsManualScroll(true);
    setSelectedCategory(categoryId);

    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Usa i calcoli corretti dal debug:
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 161 : 88; // Valori reali: mobile(145+16) desktop(72+16)
      
      const elementTop = element.offsetTop;
      const scrollPosition = Math.max(0, elementTop - offset);
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScroll(false);
    }, 600); // Ridotto per migliore responsività
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
