
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

    // Calcola l'altezza dinamica dell'header + category sidebar con type casting
    const calculateOffsets = () => {
      const header = document.querySelector('header') as HTMLElement;
      const mobileCategorySidebar = document.querySelector('#mobile-category-sidebar') as HTMLElement;
      
      let totalOffset = 120; // Fallback per desktop
      
      if (header) {
        totalOffset = header.offsetHeight;
      }
      
      if (mobileCategorySidebar) {
        totalOffset += mobileCategorySidebar.offsetHeight;
      }
      
      console.log('Calculated total offset for observer:', totalOffset);
      return totalOffset;
    };

    const totalOffset = calculateOffsets();

    // Create new intersection observer con configurazione migliorata
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return;
        
        console.log('Observer entries:', entries.map(e => ({
          id: e.target.id,
          isIntersecting: e.isIntersecting,
          intersectionRatio: e.intersectionRatio,
          boundingRect: e.boundingClientRect
        })));
        
        // Logica migliorata per rilevare la categoria più prominente
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
          console.log('Setting active category:', categoryId);
          setSelectedCategory(categoryId);
        }
      },
      {
        root: null,
        // Soglie più semplici ma efficaci
        threshold: [0, 0.1, 0.3, 0.5, 0.7],
        // rootMargin migliorato per il rilevamento
        rootMargin: `-${totalOffset + 10}px 0px -30% 0px`
      }
    );

    observerRef.current = observer;

    // Setup dell'observer con retry automatico
    const setupObserver = () => {
      const categoryElements = document.querySelectorAll('[id^="category-"]');
      console.log('Found category elements:', categoryElements.length);
      
      if (categoryElements.length === 0) {
        console.warn('No category elements found, retrying in 300ms...');
        setTimeout(setupObserver, 300);
        return;
      }
      
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
          console.log('Observing category:', element.id);
        }
      });
    };

    // Delay iniziale più lungo per assicurarsi che tutto sia renderizzato
    setTimeout(setupObserver, 250);

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
      // Calcola l'offset considerando header + category sidebar mobile con type casting
      const header = document.querySelector('header') as HTMLElement;
      const mobileCategorySidebar = document.querySelector('#mobile-category-sidebar') as HTMLElement;
      
      let yOffset = -120; // Fallback
      
      if (header) {
        yOffset = -(header.offsetHeight + 10);
      }
      
      if (mobileCategorySidebar) {
        yOffset -= mobileCategorySidebar.offsetHeight;
      }
      
      console.log('Scrolling with offset:', yOffset);
      
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
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
      console.log('Resetting manual scroll flag');
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
