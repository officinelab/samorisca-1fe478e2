
import { useState, useRef, useEffect, useCallback } from "react";
import { useHeaderHeight } from "./useHeaderHeight";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categoriesMapRef = useRef<Array<{
    id: string;
    startY: number;
    endY: number;
    element: HTMLElement;
  }>>([]);
  
  const { headerHeight } = useHeaderHeight();
  
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
    }
  };

  // COSTRUISCI MAPPA POSIZIONI CATEGORIE
  const buildCategoriesMap = useCallback(() => {
    const containers = document.querySelectorAll('[id^="category-container-"]');
    const categoriesMap: typeof categoriesMapRef.current = [];
    
    containers.forEach((container, index) => {
      const categoryId = container.id.replace('category-container-', '');
      const startY = container.offsetTop;
      
      // Calcola la fine della categoria:
      // - Se è l'ultima categoria: fino alla fine del container
      // - Altrimenti: fino all'inizio della categoria successiva
      let endY;
      if (index === containers.length - 1) {
        // Ultima categoria: fino alla fine del suo container
        endY = startY + container.offsetHeight;
      } else {
        // Altre categorie: fino all'inizio della categoria successiva
        const nextContainer = containers[index + 1] as HTMLElement;
        endY = nextContainer.offsetTop;
      }
      
      categoriesMap.push({
        id: categoryId,
        startY,
        endY,
        element: container as HTMLElement
      });
    });
    
    categoriesMapRef.current = categoriesMap;
    console.log('📋 Mappa categorie costruita:', categoriesMap.map(c => ({
      id: c.id,
      start: c.startY,
      end: c.endY,
      height: c.endY - c.startY
    })));
    
    return categoriesMap;
  }, []);

  // CALCOLA CATEGORIA ATTUALE BASATA SU POSIZIONE SCROLL
  const calculateCurrentCategory = useCallback(() => {
    if (isManualScroll) return;
    
    const categoriesMap = categoriesMapRef.current;
    if (categoriesMap.length === 0) {
      buildCategoriesMap();
      return;
    }
    
    // Posizione di riferimento: scroll + offset header + margine
    const referenceY = window.scrollY + headerHeight + 50;
    
    // Trova la categoria che contiene la posizione di riferimento
    let currentCategory = null;
    
    for (const category of categoriesMap) {
      if (referenceY >= category.startY && referenceY < category.endY) {
        currentCategory = category.id;
        break;
      }
    }
    
    // Se non trovata, usa l'ultima categoria visibile
    if (!currentCategory) {
      // Trova l'ultima categoria che inizia prima della posizione di riferimento
      const visibleCategories = categoriesMap.filter(c => c.startY <= referenceY);
      if (visibleCategories.length > 0) {
        currentCategory = visibleCategories[visibleCategories.length - 1].id;
      }
    }
    
    if (currentCategory) {
      setSelectedCategory(prevCategory => {
        if (prevCategory !== currentCategory) {
          console.log(`🎯 Categoria aggiornata: ${prevCategory} → ${currentCategory} (scroll: ${window.scrollY}px, ref: ${referenceY}px)`);
          return currentCategory;
        }
        return prevCategory;
      });
    }
  }, [isManualScroll, headerHeight, buildCategoriesMap]);

  // SCROLL LISTENER OTTIMIZZATO
  const setupScrollHighlighting = useCallback(() => {
    // Costruisci mappa iniziale
    buildCategoriesMap();
    
    let ticking = false;
    
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateCurrentCategory();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Calcola categoria iniziale
    setTimeout(() => {
      calculateCurrentCategory();
    }, 100);
    
    // Listener scroll
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Ricostruisci mappa su resize
    const resizeHandler = () => {
      setTimeout(buildCategoriesMap, 200);
    };
    window.addEventListener('resize', resizeHandler);
    
    console.log('✅ Sistema scroll posizionale attivato');
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [calculateCurrentCategory, buildCategoriesMap]);

  // SCROLL VERSO CATEGORIA
  const scrollToCategory = (categoryId: string) => {
    console.log('🚀 Manual scroll to category:', categoryId);
    
    setIsManualScroll(true);
    setSelectedCategory(categoryId);

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
      console.log('✅ Manual scroll completed, re-enabling auto-detection');
      setIsManualScroll(false);
      // Ricostruisci mappa dopo scroll manuale
      buildCategoriesMap();
      setTimeout(calculateCurrentCategory, 200);
    }, 1500);
  };

  // GESTIONE BACK TO TOP
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

  // SETUP SISTEMA SCROLL
  useEffect(() => {
    const cleanup = setupScrollHighlighting();
    return cleanup;
  }, [setupScrollHighlighting]);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // CLEANUP
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
