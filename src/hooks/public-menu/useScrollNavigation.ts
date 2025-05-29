
import { useRef } from "react";
import { waitForImages, calculateStickyOffset } from "./utils/domCalculations";

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

    // Funzione di scroll con retry
    const performScroll = async (attempt: number = 1): Promise<void> => {
      try {
        // Aspetta che tutto sia pronto
        await waitForImages();
        
        // Calcola l'offset dinamicamente
        const dynamicOffset = await calculateStickyOffset();
        
        // Calcola la posizione finale
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const scrollToPosition = absoluteElementTop - dynamicOffset;
        
        console.log(`Scroll attempt ${attempt}:`, {
          elementTop: elementRect.top,
          pageYOffset: window.pageYOffset,
          dynamicOffset,
          scrollToPosition,
          elementId: element.id
        });
        
        // Scroll con animazione
        window.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        });
        
        // Verifica se lo scroll è andato a buon fine dopo l'animazione
        setTimeout(async () => {
          const newScrollPosition = window.pageYOffset;
          const tolerance = 50; // tolleranza di 50px
          
          if (Math.abs(newScrollPosition - scrollToPosition) > tolerance && attempt < 3) {
            console.log(`Scroll attempt ${attempt} failed, retrying...`);
            await performScroll(attempt + 1);
          } else {
            console.log(`Scroll completed after ${attempt} attempt(s)`);
          }
        }, 1000); // Aspetta che l'animazione finisca
        
      } catch (error) {
        console.error('Error during scroll:', error);
      }
    };
    
    // Avvia lo scroll con un piccolo delay
    setTimeout(() => performScroll(), 150);
    
    // Reset manual scroll flag dopo più tempo per permettere i retry
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('Resetting manual scroll flag');
      setIsManualScroll(false);
    }, 3000); // Aumentato per permettere i retry
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
