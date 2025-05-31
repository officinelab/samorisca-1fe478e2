
import { useCallback } from 'react';

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

  const scrollToCategory = useCallback((categoryId: string) => {
    const element = document.getElementById(`category-container-${categoryId}`);
    if (!element) return;
    
    console.log(`Starting scroll to category ${categoryId}`);
    
    // Imposta immediatamente la categoria come attiva
    setActiveCategory(categoryId);
    setIsUserScrolling(true);
    
    // Calcola la posizione target usando l'offset unificato
    const targetY = element.offsetTop - UNIFIED_OFFSET;
    const finalPosition = Math.max(0, targetY);
    
    console.log(`Scroll calculation:`, {
      elementTop: element.offsetTop,
      unifiedOffset: UNIFIED_OFFSET,
      targetY,
      finalPosition
    });
    
    // Scroll con comportamento smooth
    window.scrollTo({
      top: finalPosition,
      behavior: 'smooth'
    });
    
    // Sistema di controllo preciso del completamento scroll
    let checkCount = 0;
    const maxChecks = 20; // Massimo 4 secondi di controllo
    const tolerance = 15; // Tolleranza ridotta per maggiore precisione
    
    const checkScrollCompletion = () => {
      const currentScroll = window.scrollY;
      const difference = Math.abs(currentScroll - finalPosition);
      
      console.log(`Scroll check ${checkCount + 1}:`, {
        currentScroll,
        finalPosition,
        difference,
        tolerance
      });
      
      if (difference <= tolerance) {
        // Scroll completato - mantieni la categoria selezionata e sblocca il sistema
        console.log(`Scroll completed successfully for category ${categoryId}`);
        setTimeout(() => {
          setIsUserScrolling(false);
        }, 200); // Delay maggiore per evitare interferenze
        return;
      }
      
      checkCount++;
      if (checkCount < maxChecks) {
        // Continua a controllare
        setTimeout(checkScrollCompletion, 200);
      } else {
        // Timeout raggiunto - forza il completamento
        console.log(`Scroll timeout reached for category ${categoryId}, forcing completion`);
        setIsUserScrolling(false);
      }
    };
    
    // Inizia il controllo dopo un delay per permettere l'inizio dello scroll
    setTimeout(checkScrollCompletion, 500);
    
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
