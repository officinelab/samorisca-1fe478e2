
import { useState, useRef, useEffect, useCallback } from "react";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Set initial category when categories are loaded
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
    }
  };
  
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

  // IntersectionObserver per rilevare le categorie visibili
  useEffect(() => {
    if (!menuRef.current || isManualScrolling) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Trova la categoria più visibile
        let mostVisibleEntry = entries[0];
        let maxRatio = 0;

        entries.forEach(entry => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        });

        // Aggiorna la categoria selezionata se ce n'è una sufficientemente visibile
        if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0.3) {
          const categoryId = mostVisibleEntry.target.id.replace('category-', '');
          setSelectedCategory(categoryId);
        }
      },
      {
        root: menuRef.current,
        rootMargin: '-10% 0px -60% 0px', // Considera visibile quando è nella parte superiore del viewport
        threshold: [0.1, 0.3, 0.5, 0.7]
      }
    );

    // Osserva tutte le sezioni categoria esistenti
    const categoryElements = menuRef.current.querySelectorAll('[id^="category-"]');
    categoryElements.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, [isManualScrolling]);
  
  // Scroll to selected category
  const scrollToCategory = useCallback((categoryId: string) => {
    setIsManualScrolling(true);
    setSelectedCategory(categoryId);
    
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      
      // Reset manual scrolling flag dopo un delay
      setTimeout(() => {
        setIsManualScrolling(false);
      }, 1000);
    }
  }, []);
  
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
