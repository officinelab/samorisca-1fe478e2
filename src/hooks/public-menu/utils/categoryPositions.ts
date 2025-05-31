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
    
    // Il punto di riferimento è la parte superiore della viewport + offset
    // Questo corrisponde a dove appare il top della categoria dopo lo scroll
    const viewportTop = scrollY + offset;
    
    console.log(`Finding active category:`, {
      scrollY,
      offset,
      viewportTop,
      categoriesCount: positions.length
    });
    
    // Trova la categoria che è attualmente visibile nella viewport
    let activeCategory = positions[0].id;
    
    for (let i = positions.length - 1; i >= 0; i--) {
      const category = positions[i];
      
      // Se il top della categoria è al di sopra o esattamente al viewportTop,
      // questa è la categoria attiva
      if (category.top <= viewportTop) {
        activeCategory = category.id;
        break;
      }
    }
    
    console.log(`Active category found: ${activeCategory}`);
    return activeCategory;
  }, [getCategoryPositions]);

  return {
    getCategoryPositions,
    findActiveCategory
  };
};