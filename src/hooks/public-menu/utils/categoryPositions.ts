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
    
    // Trova la categoria il cui top è più vicino (e non supera) il viewportTop
    let activeCategory = positions[0].id; // Default: prima categoria
    let closestDistance = Math.abs(positions[0].top - viewportTop);
    
    for (let i = 0; i < positions.length; i++) {
      const category = positions[i];
      
      // Se il top della categoria è dopo il viewportTop, abbiamo superato la categoria attiva
      if (category.top > viewportTop) {
        break;
      }
      
      // Questa categoria è visibile, potrebbe essere quella attiva
      const distance = Math.abs(category.top - viewportTop);
      if (distance < closestDistance || category.top <= viewportTop) {
        activeCategory = category.id;
        closestDistance = distance;
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