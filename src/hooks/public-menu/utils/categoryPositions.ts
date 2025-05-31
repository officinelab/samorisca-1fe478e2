
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

  const findActiveCategory = useCallback((scrollY: number, scrollOffset: number): string | null => {
    const positions = getCategoryPositions();
    const targetY = scrollY + scrollOffset;
    
    const activePosition = positions.find(pos => 
      targetY >= pos.top && targetY < pos.bottom
    );
    
    if (activePosition) {
      return activePosition.id;
    }
    
    const categoriesAbove = positions.filter(pos => pos.top <= targetY);
    if (categoriesAbove.length > 0) {
      return categoriesAbove[categoriesAbove.length - 1].id;
    }
    
    return positions[0]?.id || null;
  }, [getCategoryPositions]);

  return {
    getCategoryPositions,
    findActiveCategory
  };
};
