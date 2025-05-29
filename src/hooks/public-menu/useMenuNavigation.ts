import { useState, useRef, useEffect } from "react";
import { useScrollHighlighting } from "./useScrollHighlighting";
import { useScrollNavigation } from "./useScrollNavigation";
import { useBackToTop } from "./useBackToTop";

// Costanti per gli offset - CENTRALIZZATE
export const HEADER_HEIGHTS = {
  mobile: {
    base: 76,      // Height base dell'header
    withName: 104, // Height con il nome del ristorante
    sidebar: 64    // Height della category sidebar mobile
  },
  desktop: {
    base: 76,
    withName: 104
  }
};

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [calculatedOffsets, setCalculatedOffsets] = useState({
    header: HEADER_HEIGHTS.mobile.withName,
    sidebar: HEADER_HEIGHTS.mobile.sidebar,
    total: HEADER_HEIGHTS.mobile.withName + HEADER_HEIGHTS.mobile.sidebar
  });
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { showBackToTop } = useBackToTop();
  
  // Calcola dinamicamente gli offset reali
  useEffect(() => {
    const calculateOffsets = () => {
      const header = document.querySelector('header');
      const mobileSidebar = document.getElementById('mobile-category-sidebar');
      
      if (header) {
        const headerHeight = header.offsetHeight;
        const sidebarHeight = mobileSidebar ? mobileSidebar.offsetHeight : 0;
        
        setCalculatedOffsets({
          header: headerHeight,
          sidebar: sidebarHeight,
          total: headerHeight + sidebarHeight
        });
        
        console.log('Calculated offsets:', {
          header: headerHeight,
          sidebar: sidebarHeight,
          total: headerHeight + sidebarHeight
        });
      }
    };

    // Calcola inizialmente
    calculateOffsets();

    // Ricalcola quando la finestra viene ridimensionata
    window.addEventListener('resize', calculateOffsets);
    
    // Ricalcola dopo un breve delay per assicurarsi che tutto sia renderizzato
    const timeoutId = setTimeout(calculateOffsets, 300);

    return () => {
      window.removeEventListener('resize', calculateOffsets);
      clearTimeout(timeoutId);
    };
  }, []);
  
  const { setupScrollHighlighting } = useScrollHighlighting(
    isManualScroll,
    setSelectedCategory,
    calculatedOffsets
  );
  
  const { scrollToCategory, scrollToTop, scrollTimeoutRef } = useScrollNavigation(
    setSelectedCategory,
    setIsManualScroll,
    calculatedOffsets
  );
  
  // Set initial category when categories are loaded
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
      // Imposta l'anchor iniziale senza scroll
      window.history.replaceState(null, '', `#category-${categoryId}`);
    }
  };

  // Setup intersection observer con delay minimo
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let cleanup: (() => void) | undefined;

    const setup = () => {
      cleanup = setupScrollHighlighting();
    };

    // Delay per permettere il rendering completo
    timeoutId = setTimeout(setup, 200);
    
    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [setupScrollHighlighting, scrollTimeoutRef, calculatedOffsets]);
  
  return {
    selectedCategory,
    setSelectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    initializeCategory,
    setupScrollHighlighting,
    calculatedOffsets
  };
};