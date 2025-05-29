
import { useState, useRef, useEffect, useCallback } from "react";
import { useScrollHighlighting } from "./useScrollHighlighting";
import { useScrollNavigation } from "./useScrollNavigation";
import { useBackToTop } from "./useBackToTop";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const setupCompleteRef = useRef(false);
  
  const { showBackToTop } = useBackToTop();
  
  // Memoizza setupScrollHighlighting per evitare ricreazioni
  const { setupScrollHighlighting } = useScrollHighlighting(
    isManualScroll,
    setSelectedCategory
  );
  
  const { scrollToCategory, scrollToTop, scrollTimeoutRef } = useScrollNavigation(
    setSelectedCategory,
    setIsManualScroll
  );
  
  // Set initial category when categories are loaded
  const initializeCategory = useCallback((categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
      // Imposta l'anchor iniziale senza scroll
      window.history.replaceState(null, '', `#category-${categoryId}`);
    }
  }, [selectedCategory]);

  // Setup intersection observer quando il componente è pronto
  useEffect(() => {
    // Evita setup multipli
    if (setupCompleteRef.current) return;
    
    // Attendi che il DOM sia completamente caricato
    const timeoutId = setTimeout(() => {
      console.log('Setting up scroll highlighting for the first time');
      const cleanup = setupScrollHighlighting();
      setupCompleteRef.current = true;
      
      return cleanup;
    }, 300);
    
    return () => {
      clearTimeout(timeoutId);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [setupScrollHighlighting]);
  
  return {
    selectedCategory,
    setSelectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    initializeCategory,
    setupScrollHighlighting: useCallback(() => {
      // Previeni setup multipli
      if (!setupCompleteRef.current) {
        return setupScrollHighlighting();
      }
      return () => {};
    }, [setupScrollHighlighting])
  };
};
