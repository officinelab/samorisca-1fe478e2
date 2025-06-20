
import { useCallback } from 'react';
import { PageBreaksConfig } from '@/types/printLayout';

export const usePageBreaksTab = (
  pageBreaks: PageBreaksConfig,
  onPageBreaksChange: (pageBreaks: PageBreaksConfig) => void
) => {
  const handleCategoryToggle = useCallback((categoryId: string, checked: boolean) => {
    const currentIds = pageBreaks.categoryIds;
    
    let newCategoryIds: string[];
    if (checked) {
      // Aggiungi la categoria se non è già presente
      newCategoryIds = currentIds.includes(categoryId) 
        ? currentIds 
        : [...currentIds, categoryId];
    } else {
      // Rimuovi la categoria
      newCategoryIds = currentIds.filter(id => id !== categoryId);
    }
    
    onPageBreaksChange({
      categoryIds: newCategoryIds
    });
  }, [pageBreaks.categoryIds, onPageBreaksChange]);

  return {
    handleCategoryToggle
  };
};
