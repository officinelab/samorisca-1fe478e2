
import { useRef } from "react";
import { waitForDOMReady, calculateStickyOffset } from "./utils/domCalculations";

export const useScrollNavigation = (
  setSelectedCategory: (categoryId: string) => void,
  setIsManualScroll: (value: boolean) => void
) => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToCategory = async (categoryId: string) => {
    console.log('Manual scroll to category:', categoryId);
    setIsManualScroll(true);
    setSelectedCategory(categoryId);
    
    const element = document.getElementById(`category-${categoryId}`);
    if (!element) {
      console.error('Element not found:', `category-${categoryId}`);
      setIsManualScroll(false);
      return;
    }

    // Funzione di scroll migliorata
    const performScroll = async (): Promise<void> => {
      try {
        // Aspetta che il DOM sia pronto (più veloce di waitForImages)
        await waitForDOMReady();
        
        // Calcola l'offset dinamicamente
        const dynamicOffset = await calculateStickyOffset();
        
        // Calcola la posizione finale
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const scrollToPosition = Math.max(0, absoluteElementTop - dynamicOffset);
        
        console.log('Scroll calculation:', {
          elementTop: elementRect.top,
          pageYOffset: window.pageYOffset,
          dynamicOffset,
          scrollToPosition,
          elementId: element.id
        });
        
        // Scroll immediato e preciso
        window.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        });
        
      } catch (error) {
        console.error('Error during scroll:', error);
      }
    };
    
    // Avvia lo scroll con un delay minimo
    setTimeout(() => performScroll(), 50);
    
    // Reset manual scroll flag con timeout ridotto
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('Resetting manual scroll flag');
      setIsManualScroll(false);
    }, 1500); // Ridotto da 3000ms a 1500ms
  };

  const scrollToTop = () => {
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
