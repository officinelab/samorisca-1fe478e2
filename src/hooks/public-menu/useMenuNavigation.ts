
import { useState, useRef, useEffect, useCallback } from "react";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
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

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return; // Skip auto-update during manual scroll
        
        // Trova tutte le sezioni visibili
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            // Ordina per posizione verticale (top)
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
        
        // Seleziona la prima sezione visibile
        if (visibleSections.length > 0) {
          const firstVisibleSection = visibleSections[0];
          const categoryId = firstVisibleSection.target.id.replace('category-', '');
          setSelectedCategory(categoryId);
        }
      },
      {
        // Usa il viewport principale come root
        root: null,
        threshold: [0, 0.1, 0.5, 0.9],
        // Considera una sezione visibile quando entra nel 10% superiore del viewport
        rootMargin: '-10% 0px -40% 0px'
      }
    );

    observerRef.current = observer;

    // Observe all category sections dopo un breve delay per assicurarsi che il DOM sia pronto
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
      const yOffset = -80; // Offset per header sticky
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
    
    // Reset manual scroll flag dopo l'animazione
    setTimeout(() => {
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
  
  return {
    selectedCategory,
    setSelectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    initializeCategory,
    setupScrollHighlighting // Export per permettere re-setup quando cambiano le categorie
  };
};
