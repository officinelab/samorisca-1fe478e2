import { useState, useRef, useEffect, useCallback } from "react";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
        
        // Trova la categoria più in alto che è almeno parzialmente visibile
        let topMostCategory = null;
        let topMostPosition = Infinity;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.target.getBoundingClientRect();
            // Considera solo elementi che sono nella parte superiore del viewport
            if (rect.top < window.innerHeight / 2 && rect.top < topMostPosition) {
              topMostPosition = rect.top;
              topMostCategory = entry.target;
            }
          }
        });
        
        if (topMostCategory) {
          const section = topMostCategory.closest('[id^="category-"]');
          if (section) {
            const categoryId = section.id.replace('category-', '');
            setSelectedCategory(categoryId);
          }
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.5, 1],
        // Margini diversi per mobile e desktop
        rootMargin: isMobile ? '-150px 0px -50% 0px' : '-100px 0px -50% 0px'
      }
    );

    observerRef.current = observer;

    // Osserva le sezioni complete invece dei soli titoli
    // per catturare meglio quando una categoria è attiva
    setTimeout(() => {
      const categoryElements = document.querySelectorAll('[id^="category-"]');
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
  }, [isManualScroll, isMobile]);

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
      // Trova il titolo h2 all'interno della sezione
      const titleElement = element.querySelector('h2');
      const targetElement = titleElement || element;
      
      // Calcola l'offset dinamicamente
      const header = document.querySelector('header');
      const categorySidebar = document.querySelector('[class*="sticky"][class*="top-"]');
      
      let offset = 20; // padding base
      if (header) offset += header.offsetHeight;
      if (isMobile && categorySidebar) offset += categorySidebar.offsetHeight;
      
      // Calcola la posizione
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const targetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    
    // Reset manual scroll flag dopo l'animazione
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScroll(false);
    }, 1200);
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