
import { useCallback, useRef } from 'react';

interface UseCategoryManagementProps {
  headerHeight: number;
  isUserScrolling: boolean;
  setIsUserScrolling: (scrolling: boolean) => void;
  setActiveCategory: (category: string) => void;
}

export const useCategoryManagement = ({
  headerHeight,
  isUserScrolling,
  setIsUserScrolling,
  setActiveCategory
}: UseCategoryManagementProps) => {
  
  // Offset unificato per tutto il sistema
  const UNIFIED_OFFSET = headerHeight + 20;
  
  // Ref per tracciare se è il primo scroll
  const isFirstScrollRef = useRef(true);
  
  // Funzione helper per attendere che il DOM sia stabile
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
      
      // Timeout di sicurezza di 1 secondo
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
      
      // Attendi il primo tra: tutte le immagini + font o timeout
      Promise.race([
        Promise.all([...imagePromises, fontPromise]),
        timeoutPromise
      ]).then(() => resolve());
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
    }
    
    // Funzione per eseguire lo scroll con retry
    const performScroll = (attempt: number = 1): void => {
      const maxAttempts = 3;
      
      // Ricalcola la posizione ad ogni tentativo
      const rect = element.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const targetY = absoluteTop - UNIFIED_OFFSET;
      const finalPosition = Math.max(0, targetY);
      
      console.log(`Scroll attempt ${attempt}:`, {
        elementRect: rect,
        currentScrollY: window.scrollY,
        absoluteTop,
        unifiedOffset: UNIFIED_OFFSET,
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
      
      // Verifica se lo scroll è andato a buon fine
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
          
          // Rilascia il controllo dopo un breve delay
          setTimeout(() => {
            setIsUserScrolling(false);
          }, 300);
        }
      }, 600); // Attendi più a lungo per lo smooth scroll
    };
    
    // Esegui lo scroll
    performScroll();
    
  }, [headerHeight, UNIFIED_OFFSET, setIsUserScrolling, setActiveCategory]);

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