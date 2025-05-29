
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
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return; // Skip auto-update during manual scroll
        
        console.log('IntersectionObserver entries:', entries.map(e => ({
          id: e.target.id,
          isIntersecting: e.isIntersecting,
          intersectionRatio: e.intersectionRatio
        })));
        
        // Find the category that's most visible
        let mostVisibleEntry = null;
        let maxRatio = 0;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        });
        
        if (mostVisibleEntry) {
          const categoryId = mostVisibleEntry.target.id.replace('category-', '');
          console.log('Auto-highlighting category:', categoryId);
          setSelectedCategory(categoryId);
        }
      },
      {
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '-80px 0px -40% 0px'
      }
    );

    // Wait for DOM to be ready, then observe all category sections
    const observeCategories = () => {
      const categoryElements = document.querySelectorAll('[id^="category-"]');
      console.log('Found category elements:', categoryElements.length);
      
      categoryElements.forEach((element) => {
        console.log('Observing element:', element.id);
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    };

    // Use a timeout to ensure DOM is ready
    const timeoutId = setTimeout(observeCategories, 100);
    
    // Also try immediately in case DOM is already ready
    observeCategories();

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [isManualScroll]);

  // Handle scroll to detect when to show back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (menuRef.current) {
        const scrollTop = menuRef.current.scrollTop;
        setShowBackToTop(scrollTop > 300);
      }
    };
    
    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (menuElement) {
        menuElement.removeEventListener('scroll', handleScroll);
      }
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
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    
    // Reset manual scroll flag after scroll animation
    setTimeout(() => {
      console.log('Resetting manual scroll flag');
      setIsManualScroll(false);
    }, 1500);
  };
  
  // Scroll to top of menu
  const scrollToTop = () => {
    if (menuRef.current) {
      menuRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  return {
    selectedCategory,
    setSelectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    initializeCategory
  };
};
