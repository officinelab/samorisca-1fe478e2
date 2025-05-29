
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
    }
  };

  // Setup intersection observer for auto-highlighting con delay ridotto
  useEffect(() => {
    const cleanup = setupScrollHighlighting();
    return cleanup;
  }, [setupScrollHighlighting]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollTimeoutRef]);
  
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
