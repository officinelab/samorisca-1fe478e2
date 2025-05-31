
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
  
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
    }
  };

  // INTERSECTION OBSERVER CON DEBUG AGGRESSIVO
  const setupScrollHighlighting = useCallback(() => {
    console.log('🔧 Setting up intersection observer...');
    
    if (observerRef.current) {
      console.log('🗑️ Disconnecting existing observer');
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        console.log(`🚨 INTERSECTION OBSERVER FIRED! Entries: ${entries.length}, Manual scroll: ${isManualScroll}`);
        
        if (isManualScroll) {
          console.log('🚫 Manual scroll in progress, ignoring intersection changes');
          return;
        }
        
        // Trova il container più visibile
        let mostVisible = null;
        let maxVisibility = 0;
        
        entries.forEach(entry => {
          const rect = entry.boundingClientRect;
          const id = entry.target.id;
          
          console.log(`📊 Entry: ${id}, isIntersecting: ${entry.isIntersecting}, ratio: ${entry.intersectionRatio.toFixed(3)}`);
          
          if (entry.isIntersecting) {
            const viewportHeight = window.innerHeight;
            const visibleTop = Math.max(rect.top, 0);
            const visibleBottom = Math.min(rect.bottom, viewportHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibility = visibleHeight / rect.height;
            
            console.log(`   - Visibility: ${(visibility * 100).toFixed(1)}%`);
            
            if (visibility > maxVisibility) {
              maxVisibility = visibility;
              mostVisible = entry.target;
            }
          }
        });
        
        if (mostVisible && maxVisibility > 0.05) { // Soglia bassissima
          const categoryId = mostVisible.id.replace('category-container-', '');
          console.log(`🎯 SELECTING CATEGORY: ${categoryId} (${(maxVisibility * 100).toFixed(1)}% visible)`);
          setSelectedCategory(categoryId);
        } else {
          console.log('❌ No suitable category found');
        }
      },
      {
        root: null,
        threshold: [0, 0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0],
        rootMargin: '0px 0px -100px 0px' // Semplificato
      }
    );

    observerRef.current = observer;

    // Setup immediato con retry
    const setupObserver = () => {
      const categoryContainers = document.querySelectorAll('[id^="category-container-"]');
      console.log(`🔍 Found ${categoryContainers.length} category containers to observe`);
      
      if (categoryContainers.length === 0) {
        console.log('⚠️ No containers found, retrying in 1 second...');
        setTimeout(setupObserver, 1000);
        return;
      }
      
      categoryContainers.forEach((container, index) => {
        if (observerRef.current) {
          observerRef.current.observe(container);
          console.log(`   ✅ Observing: ${container.id}`);
        }
      });
      
      console.log('🎉 Intersection observer setup complete!');
    };

    setupObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isManualScroll]);

  // Test scroll event per verificare che i container esistano
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
      
      // Debug periodico
      if (Math.random() < 0.1) { // 10% delle volte
        const containers = document.querySelectorAll('[id^="category-container-"]');
        console.log(`📍 Scroll debug: ${containers.length} containers exist`);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const cleanup = setupScrollHighlighting();
    return cleanup;
  }, [setupScrollHighlighting]);
  
  const scrollToCategory = (categoryId: string) => {
    console.log('🚀 Manual scroll to category:', categoryId);
    
    setIsManualScroll(true);
    setSelectedCategory(categoryId);

    const element = document.getElementById(`category-container-${categoryId}`);
    if (element) {
      console.log('✅ Element found, scrolling...');
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      console.error('❌ Element not found:', `category-container-${categoryId}`);
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('✅ Manual scroll completed, re-enabling auto-detection');
      setIsManualScroll(false);
    }, 2000); // Timeout più lungo
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
