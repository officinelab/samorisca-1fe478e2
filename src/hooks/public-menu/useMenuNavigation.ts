
import { useState, useRef, useEffect, useCallback } from "react";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Set initial category when categories are loaded
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
    }
  };

  // Auto-highlight category based on scroll position
  const setupScrollHighlighting = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return; // Skip auto-update during manual scroll
        
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
          setSelectedCategory(categoryId);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7],
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    // Observe all category sections
    const categoryElements = document.querySelectorAll('[id^="category-"]');
    categoryElements.forEach((element) => observer.observe(element));

    return () => {
      categoryElements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
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
      setIsManualScroll(false);
    }, 1000);
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
