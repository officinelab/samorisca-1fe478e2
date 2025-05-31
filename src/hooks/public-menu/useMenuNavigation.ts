
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

    // INTERSECTION OBSERVER COMPLETAMENTE RICOSTRUITO
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) {
          console.log('🚫 Manual scroll in progress, ignoring intersection changes');
          return;
        }
        
        console.log(`👁️ Intersection Observer triggered with ${entries.length} entries`);
        
        // Trova il container più visibile usando calcolo diretto
        let mostVisible = null;
        let maxVisibility = 0;
        
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;
            
            // Calcola visibilità più accurato
            const visibleTop = Math.max(rect.top, 0);
            const visibleBottom = Math.min(rect.bottom, viewportHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibility = visibleHeight / rect.height;
            
            console.log(`   - ${entry.target.id}: ${(visibility * 100).toFixed(1)}% visible`);
            
            if (visibility > maxVisibility && visibility > 0.1) { // Soglia molto bassa
              maxVisibility = visibility;
              mostVisible = entry.target;
            }
          }
        });
        
        if (mostVisible && maxVisibility > 0.1) {
          const categoryId = mostVisible.id.replace('category-container-', '');
          console.log(`🎯 Updating category to: ${categoryId} (${(maxVisibility * 100).toFixed(1)}% visible)`);
          setSelectedCategory(categoryId);
        }
      },
      {
        root: null,
        // SOGLIE MULTIPLE per catturare ogni cambiamento
        threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        // ROOT MARGIN più permissivo
        rootMargin: '-50px 0px -200px 0px'
      }
    );

    observerRef.current = observer;

    // SETUP IMMEDIATO senza delay
    const categoryContainers = document.querySelectorAll('[id^="category-container-"]');
    console.log(`🔍 Setting up observer for ${categoryContainers.length} category containers`);
    
    categoryContainers.forEach((container, index) => {
      if (observerRef.current) {
        observerRef.current.observe(container);
        console.log(`   - Observing: ${container.id}`);
      }
    });

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
