
import { useCallback, useRef } from 'react';

interface UseCategoryManagementProps {
  headerHeight: number;
  isUserScrolling: boolean;
  setIsUserScrolling: (scrolling: boolean) => void;
  setActiveCategory: (category: string) => void;
  calculateTotalOffset: () => number;
}

export const useCategoryManagement = ({
  headerHeight,
  isUserScrolling,
  setIsUserScrolling,
  setActiveCategory,
  calculateTotalOffset
}: UseCategoryManagementProps) => {
  
  // Ref per tracciare se è il primo scroll
  const isFirstScrollRef = useRef(true);
  
  // Funzione helper per attendere che il DOM sia stabile - versione più aggressiva
  const waitForStableDOM = async (): Promise<void> => {
    return new Promise((resolve) => {
      // Attendi che tutte le immagini nella viewport siano caricate
      const images = document.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      });
      
      // Attendi anche che i font siano pronti
      const fontPromise = document.fonts?.ready || Promise.resolve();
      
      // Timeout di sicurezza ridotto per maggiore reattività
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 500));
      
      // Attendi il primo tra: tutte le immagini + font o timeout
      Promise.race([
        Promise.all([...imagePromises, fontPromise]),
        timeoutPromise
      ]).then(() => {
        // Aggiungi un piccolo delay aggiuntivo per assicurarsi che il layout sia stabile
        setTimeout(resolve, 50);
      });
    });
  };

  const scrollToCategory = useCallback(async (categoryId: string) => {
    const element = document.getElementById(`category-container-${categoryId}`);
    if (!element) {
      console.error(`Category element not found: ${categoryId}`);
      return;
    }
    
    console.log(`Starting scroll to category ${categoryId}`);
    
    // Imposta immediatamente la categoria come attiva
    setActiveCategory(categoryId);
    setIsUserScrolling(true);
    
    // Se è il primo scroll, attendi che il DOM sia stabile
    if (isFirstScrollRef.current) {
      console.log('First scroll detected, waiting for stable DOM...');
      await waitForStableDOM();
      isFirstScrollRef.current = false;
    } else {
      // Per gli scroll successivi, un piccolo delay per il layout
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Funzione per eseguire lo scroll con retry
    const performScroll = (attempt: number = 1): void => {
      const maxAttempts = 3;
      
      // Forza un reflow per assicurarsi che le dimensioni siano aggiornate
      element.offsetHeight;
      
      // Ricalcola la posizione ad ogni tentativo con offset dinamico più preciso
      const currentOffset = calculateTotalOffset();
      const rect = element.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const targetY = absoluteTop - currentOffset;
      // Aggiunge 3px per posizionare leggermente dentro la categoria
      const finalPosition = Math.max(0, targetY + 3);
      
      console.log(`Scroll attempt ${attempt}:`, {
        elementRect: rect,
        currentScrollY: window.scrollY,
        absoluteTop,
        calculatedOffset: currentOffset,
        targetY,
        finalPosition
      });
      
      // Usa scrollIntoView con offset personalizzato
      if ('scrollBehavior' in document.documentElement.style) {
        // Browser moderni: usa smooth scroll nativo
        window.scrollTo({
          top: finalPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback per browser più vecchi
        window.scrollTo(0, finalPosition);
      }
      
      // Verifica se lo scroll è andato a buon fine con delay ridotto
      setTimeout(() => {
        const currentScroll = window.scrollY;
        const difference = Math.abs(currentScroll - finalPosition);
        const tolerance = 5; // Tolleranza molto stretta
        
        console.log(`Scroll verification:`, {
          currentScroll,
          finalPosition,
          difference,
          tolerance,
          success: difference <= tolerance
        });
        
        if (difference > tolerance && attempt < maxAttempts) {
          // Retry se non siamo nella posizione giusta
          console.log(`Scroll not accurate, retrying (attempt ${attempt + 1})...`);
          performScroll(attempt + 1);
        } else {
          // Scroll completato o massimo numero di tentativi raggiunto
          console.log(`Scroll ${difference <= tolerance ? 'completed successfully' : 'completed with best effort'} for category ${categoryId}`);
          
          // Rilascia il controllo con delay ridotto
          setTimeout(() => {
            setIsUserScrolling(false);
          }, 150);
        }
      }, 200); // Delay ridotto da 600ms a 200ms per verifiche più rapide
    };
    
    // Esegui lo scroll
    performScroll();
    
  }, [headerHeight, setIsUserScrolling, setActiveCategory, calculateTotalOffset]);

  const scrollToTop = useCallback(() => {
    setIsUserScrolling(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsUserScrolling(false), 1000);
  }, [setIsUserScrolling]);

  const initializeCategory = useCallback((categoryId: string | null, activeCategory: string | null) => {
    if (categoryId && !activeCategory) {
      setActiveCategory(categoryId);
    }
  }, [setActiveCategory]);

  return {
    scrollToCategory,
    scrollToTop,
    initializeCategory
  };
};
