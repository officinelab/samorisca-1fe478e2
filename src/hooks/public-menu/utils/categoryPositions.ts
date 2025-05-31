
import { useCallback } from 'react';

export interface CategoryPosition {
  id: string;
  element: HTMLElement;
  top: number;
  bottom: number;
}

export const useCategoryPositions = () => {
  const getCategoryPositions = useCallback((): CategoryPosition[] => {
    const containers = document.querySelectorAll<HTMLElement>('[id^="category-container-"]');
    
    return Array.from(containers).map(element => ({
      id: element.id.replace('category-container-', ''),
      element,
      top: element.offsetTop,
      bottom: element.offsetTop + element.offsetHeight
    }));
  }, []);

  const findActiveCategory = useCallback((scrollY: number, offset: number): string | null => {
    const positions = getCategoryPositions();
    if (positions.length === 0) return null;
    
    // Punto di riferimento per il rilevamento (stesso offset usato per lo scroll)
    const viewportTop = scrollY + offset;
    
    console.log(`Finding active category:`, {
      scrollY,
      offset,
      viewportTop,
      categoriesCount: positions.length
    });
    
    // Trova la categoria che contiene il punto di riferimento
    for (let i = 0; i < positions.length; i++) {
      const current = positions[i];
      const next = positions[i + 1];
      
      // Se siamo nell'ultima categoria o il punto è prima della prossima categoria
      if (!next || viewportTop < next.top) {
        // Verifica che siamo effettivamente nella categoria corrente
        if (viewportTop >= current.top) {
          console.log(`Active category found: ${current.id}`);
          return current.id;
        }
      }
    }
    
    // Fallback: ritorna la prima categoria se siamo sopra tutto
    console.log(`Fallback to first category: ${positions[0].id}`);
    return positions[0].id;
  }, [getCategoryPositions]);

  return {
    getCategoryPositions,
    findActiveCategory
  };
};
