import { useRef } from "react";

export const useScrollNavigation = (
  setSelectedCategory: (categoryId: string) => void,
  setIsManualScroll: (value: boolean) => void
) => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToCategory = (categoryId: string) => {
    console.log('Manual scroll to category:', categoryId);
    setIsManualScroll(true);
    setSelectedCategory(categoryId);
    
    // Aggiorna l'URL
    const targetHash = `#category-${categoryId}`;
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

    // Calcola dinamicamente gli offset reali
    const header = document.querySelector('header');
    const mobileSidebar = document.getElementById('mobile-category-sidebar');
    
    const headerHeight = header ? header.offsetHeight : 104;
    const sidebarHeight = mobileSidebar ? mobileSidebar.offsetHeight : 64;
    const totalOffset = headerHeight + sidebarHeight + 20; // 20px padding
    
    // Calcola la posizione target
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const scrollToPosition = Math.max(0, absoluteElementTop - totalOffset);
    
    console.log('Scrolling to position:', scrollToPosition, 'with offset:', totalOffset);
    
    // Scroll con smooth behavior
    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth'
    });
    
    // Reset manual scroll flag dopo l'animazione
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('Resetting manual scroll flag');
      setIsManualScroll(false);
    }, 800); // Tempo sufficiente per completare lo scroll smooth
  };

  const scrollToTop = () => {
    setIsManualScroll(true);
    
    // Rimuovi hash dall'URL
    window.history.replaceState(null, '', window.location.pathname);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Reset dopo lo scroll
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScroll(false);
    }, 800);
  };

  return {
    scrollToCategory,
    scrollToTop,
    scrollTimeoutRef
  };
};