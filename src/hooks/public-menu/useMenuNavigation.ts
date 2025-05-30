
import { useState, useRef, useEffect, useCallback } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { siteSettings } = useSiteSettings();
  
  // Calcolo unificato dell'altezza header (stesso del CategorySidebar)
  const getHeaderHeight = useCallback(() => {
    // Struttura header:
    // - pt-4 (16px) + logo h-12 (48px) + spazio interno (~20px) = ~84px base
    // - Se showRestaurantNameInMenuBar: aggiunge mt-2 + pb-2 + altezza testo (~24px)
    const baseHeight = 84;
    const showRestaurantName = siteSettings?.showRestaurantNameInMenuBar !== false;
    const nameHeight = showRestaurantName ? 24 : 0;
    
    return baseHeight + nameHeight;
  }, [siteSettings]);
  
  // Set initial category when categories are loaded
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
    }
  };

  // Auto-highlight category based on scroll position
  const setupScrollHighlighting = useCallback(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const totalOffset = getHeaderHeight();

    // Create new intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return;
        
        // Logica per rilevare la categoria più prominente
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            // Priorità alla categoria che è più vicina alla parte superiore del viewport
            const aDistance = Math.abs(a.boundingClientRect.top - totalOffset);
            const bDistance = Math.abs(b.boundingClientRect.top - totalOffset);
            
            // Se una categoria è molto vicina al top offset, ha priorità
            if (aDistance < 50 && bDistance >= 50) return -1;
            if (bDistance < 50 && aDistance >= 50) return 1;
            
            // Altrimenti usa l'intersection ratio
            return b.intersectionRatio - a.intersectionRatio;
          });
        
        if (visibleEntries.length > 0) {
          const categoryId = visibleEntries[0].target.id.replace('category-', '');
          setSelectedCategory(categoryId);
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.3, 0.5, 0.7],
        // rootMargin senza offset aggiuntivi
        rootMargin: `-${totalOffset}px 0px -30% 0px`
      }
    );

    observerRef.current = observer;

    // Setup dell'observer
    const setupObserver = () => {
      const categoryElements = document.querySelectorAll('[id^="category-"]');
      
      if (categoryElements.length === 0) {
        setTimeout(setupObserver, 300);
        return;
      }
      
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    };

    setTimeout(setupObserver, 250);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isManualScroll, getHeaderHeight]);

  // Handle scroll to detect when to show back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Setup intersection observer for auto-highlighting
  useEffect(() => {
    const cleanup = setupScrollHighlighting();
    return cleanup;
  }, [setupScrollHighlighting]);
  
  // Scroll to selected category (manual selection)
  const scrollToCategory = (categoryId: string) => {
    setIsManualScroll(true);
    setSelectedCategory(categoryId);
    
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Usa lo stesso calcolo dell'altezza del CategorySidebar
      const totalOffset = getHeaderHeight();
      
      const y = element.getBoundingClientRect().top + window.pageYOffset - totalOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
    
    // Reset manual scroll flag dopo l'animazione
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScroll(false);
    }, 1500);
  };
  
  // Scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Cleanup timeouts on unmount
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
