
import { useRef } from "react";

export const useScrollNavigation = (
  setSelectedCategory: (categoryId: string) => void,
  setIsManualScroll: (value: boolean) => void
) => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToCategory = (categoryId: string) => {
    console.log('Manual scroll to category using native anchor:', categoryId);
    setIsManualScroll(true);
    setSelectedCategory(categoryId);
    
    // Usa il sistema di anchor nativo del browser
    const targetHash = `#category-${categoryId}`;
    
    // Aggiorna l'URL senza triggerare un reload
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
    
    // Trova l'elemento target
    const element = document.getElementById(`category-${categoryId}`);
    if (!element) {
      console.error('Element not found:', `category-${categoryId}`);
      setIsManualScroll(false);
      return;
    }

    // Usa scrollIntoView nativo con offset per l'header
    const headerHeight = 76; // Header fisso
    const sidebarHeight = 80; // CategorySidebar mobile approssimativo
    const totalOffset = headerHeight + sidebarHeight + 20; // padding extra
    
    // Calcola la posizione target
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const scrollToPosition = Math.max(0, absoluteElementTop - totalOffset);
    
    console.log('Native scroll to position:', scrollToPosition);
    
    // Scroll nativo e immediato
    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth'
    });
    
    // Reset manual scroll flag con timeout ridotto
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('Resetting manual scroll flag');
      setIsManualScroll(false);
    }, 1000); // Ridotto ulteriormente
  };

  const scrollToTop = () => {
    // Rimuovi hash dall'URL
    window.history.replaceState(null, '', window.location.pathname);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return {
    scrollToCategory,
    scrollToTop,
    scrollTimeoutRef
  };
};
