
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

    // Calcola l'altezza dinamica dell'header + category sidebar
    const calculateOffsets = () => {
      const header = document.querySelector('header');
      const mobileCategorySidebar = document.querySelector('#mobile-category-sidebar');
      
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
        
        // Trova le categorie visibili con una logica migliorata
        const visibleEntries = entries
          .filter(entry => {
            // Una categoria è considerata visibile se:
            // 1. È intersecting
            // 2. Ha almeno il 10% visibile OPPURE è la prima categoria visibile dall'alto
            return entry.isIntersecting && (
              entry.intersectionRatio > 0.1 ||
              entry.boundingClientRect.top <= totalOffset + 50
            );
          })
          .sort((a, b) => {
            // Priorità alla categoria più vicina al top del viewport
            const aTop = Math.abs(a.boundingClientRect.top);
            const bTop = Math.abs(b.boundingClientRect.top);
            
            // Se una categoria è molto vicina al top (entro 100px), ha massima priorità
            if (aTop < 100 && bTop >= 100) return -1;
            if (bTop < 100 && aTop >= 100) return 1;
            
            // Altrimenti priorità a quella con maggiore intersectionRatio
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
        // Soglie più granulari per un rilevamento migliore
        threshold: [0, 0.1, 0.2, 0.3, 0.5],
        // rootMargin aggiustato dinamicamente
        rootMargin: `-${totalOffset}px 0px -20% 0px`
      }
    );

    observerRef.current = observer;

    // Osserva tutte le sezioni categoria con delay aumentato
    setTimeout(() => {
      const categoryElements = document.querySelectorAll('[id^="category-"]');
      console.log('Found category elements:', categoryElements.length);
      
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
          console.log('Observing category:', element.id);
        }
      });
      
      // Se non troviamo categorie, riprova dopo un altro delay
      if (categoryElements.length === 0) {
        console.warn('No category elements found, retrying...');
        setTimeout(() => {
          const retryElements = document.querySelectorAll('[id^="category-"]');
          retryElements.forEach((element) => {
            if (observerRef.current) {
              observerRef.current.observe(element);
            }
          });
        }, 500);
      }
    }, 200); // Aumentato da 100ms

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
      // Calcola l'offset considerando header + category sidebar mobile
      const header = document.querySelector('header');
      const mobileCategorySidebar = document.querySelector('#mobile-category-sidebar');
      
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
    
    // Reset manual scroll flag dopo l'animazione con delay più lungo
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('Resetting manual scroll flag');
      setIsManualScroll(false);
    }, 1500); // Aumentato da 1000ms
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
