
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
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        
        if (visibleEntries.length > 0) {
          // CAMBIA QUI: estrai l'ID dal container invece che dalla section
          const categoryId = visibleEntries[0].target.id.replace('category-container-', '');
          setSelectedCategory(categoryId);
        }
      },
      {
        root: null,
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
      }
    );

    observerRef.current = observer;

    // Osserva tutte le sezioni categoria con un piccolo delay
    setTimeout(() => {
      // CAMBIA QUI: osserva i container invece delle section
      const categoryContainers = document.querySelectorAll('[id^="category-container-"]');
      categoryContainers.forEach((element) => {
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

  // Handle scroll to detect when to show back to top button
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

  // Setup intersection observer for auto-highlighting
  useEffect(() => {
    const cleanup = setupScrollHighlighting();
    return cleanup;
  }, [setupScrollHighlighting]);
  
  // Scroll to selected category (manual selection)
  const scrollToCategory = (categoryId: string) => {
    console.log('🚀 Manual scroll to category:', categoryId);
    
    setIsManualScroll(true);
    setSelectedCategory(categoryId);

    // CAMBIA QUI: target il container invece della section
    const element = document.getElementById(`category-container-${categoryId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('✅ Manual scroll completed');
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
