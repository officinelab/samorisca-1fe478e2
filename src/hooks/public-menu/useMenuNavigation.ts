
import { useState, useRef, useEffect } from "react";
import { useScrollHighlighting } from "./useScrollHighlighting";
import { useScrollNavigation } from "./useScrollNavigation";
import { useBackToTop } from "./useBackToTop";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { showBackToTop } = useBackToTop();
  
  const { setupScrollHighlighting } = useScrollHighlighting(
    isManualScroll,
    setSelectedCategory
  );
  
  const { scrollToCategory, scrollToTop, scrollTimeoutRef } = useScrollNavigation(
    setSelectedCategory,
    setIsManualScroll
  );
  
  // Set initial category when categories are loaded
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
      // Imposta l'anchor iniziale senza scroll
      window.history.replaceState(null, '', `#category-${categoryId}`);
    }
  };

  // Setup intersection observer semplificato
  useEffect(() => {
    // Delay minimo per permettere il rendering del DOM
    const timeoutId = setTimeout(() => {
      const cleanup = setupScrollHighlighting();
      return cleanup;
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [setupScrollHighlighting, scrollTimeoutRef]);
  
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
