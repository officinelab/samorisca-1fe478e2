import { useState, useRef, useEffect, useCallback } from "react";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

    // Create new intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return;
        
        // Trova tutte le categorie visibili
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            // Se una categoria è al top del viewport (o molto vicina), ha priorità
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            
            // Priorità alla categoria più vicina al top del viewport
            if (Math.abs(aTop) < 50) return -1;
            if (Math.abs(bTop) < 50) return 1;
            
            // Altrimenti ordina per posizione verticale
            return aTop - bTop;
          });
        
        if (visibleEntries.length > 0) {
          // Trova la sezione padre che contiene l'ID
          const section = visibleEntries[0].target.closest('[id^="category-"]');
          if (section) {
            const categoryId = section.id.replace('category-', '');
            setSelectedCategory(categoryId);
          }
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        // Aggiusta il rootMargin per considerare l'header sticky
        rootMargin: '-140px 0px -40% 0px'
      }
    );

    observerRef.current = observer;

    // Osserva i titoli h2 invece delle sezioni
    setTimeout(() => {
      const categoryElements = document.querySelectorAll('[id^="category-"] h2');
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 100);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isManualScroll]);

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
      // Approccio semplificato: usa scrollIntoView nativo
      // La classe scroll-mt-28 nel CategorySection gestisce già l'offset
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Reset manual scroll flag dopo l'animazione
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScroll(false);
    }, 1000);
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