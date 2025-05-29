
import { useState, useRef, useEffect, useCallback } from "react";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Funzione per calcolare dinamicamente l'offset totale
  const calculateStickyOffset = () => {
    let totalOffset = 0;
    
    // Header principale
    const header = document.querySelector('header');
    if (header) {
      totalOffset += header.offsetHeight;
      console.log('Header height:', header.offsetHeight);
    }
    
    // CategorySidebar mobile
    const categorySidebar = document.querySelector('.sticky.top-\\[88px\\]') || 
                           document.querySelector('[class*="sticky"][class*="top-"]');
    if (categorySidebar) {
      totalOffset += categorySidebar.offsetHeight;
      console.log('CategorySidebar height:', categorySidebar.offsetHeight);
    }
    
    // Padding extra per sicurezza
    const extraPadding = 20;
    totalOffset += extraPadding;
    
    console.log('Total calculated offset:', totalOffset);
    return totalOffset;
  };
  
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

    // Calcola dinamicamente il rootMargin
    const dynamicOffset = calculateStickyOffset();
    const rootMargin = `-${dynamicOffset}px 0px -40% 0px`;
    console.log('Using rootMargin:', rootMargin);

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
          const categoryId = visibleEntries[0].target.id.replace('category-', '');
          console.log('Auto-selecting category:', categoryId);
          setSelectedCategory(categoryId);
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: rootMargin
      }
    );

    observerRef.current = observer;

    // Osserva tutte le sezioni categoria con un piccolo delay per permettere il rendering
    setTimeout(() => {
      const categoryElements = document.querySelectorAll('[id^="category-"]');
      console.log('Observing', categoryElements.length, 'category elements');
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 200); // Aumentato il delay

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
    console.log('Manual scroll to category:', categoryId);
    setIsManualScroll(true);
    setSelectedCategory(categoryId);
    
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Usa il calcolo dinamico dell'offset
      const dynamicOffset = calculateStickyOffset();
      
      // Calcola la posizione finale
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const scrollToPosition = absoluteElementTop - dynamicOffset;
      
      console.log('Scroll calculation:', {
        elementTop: elementRect.top,
        pageYOffset: window.pageYOffset,
        dynamicOffset,
        scrollToPosition,
        elementId: element.id
      });
      
      // Aggiungi un piccolo delay per permettere eventuali cambiamenti di layout
      setTimeout(() => {
        window.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        });
      }, 50);
    } else {
      console.error('Element not found:', `category-${categoryId}`);
    }
    
    // Reset manual scroll flag dopo l'animazione
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('Resetting manual scroll flag');
      setIsManualScroll(false);
    }, 1500); // Aumentato il tempo
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
