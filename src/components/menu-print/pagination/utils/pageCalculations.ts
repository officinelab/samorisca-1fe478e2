
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { estimateCategoryTitleHeight, estimateProductHeight } from '@/hooks/pagination/useTextMeasurement';
import { MM_TO_PX } from '@/hooks/menu-layouts/constants';

/**
 * Calcola l'altezza disponibile in una pagina
 */
export const calculateAvailableHeight = (
  pageIndex: number, 
  A4_HEIGHT_MM: number, 
  customLayout?: PrintLayout | null
): number => {
  if (!customLayout) {
    // Default margins: top 20mm, bottom 20mm
    return (A4_HEIGHT_MM - 20 - 20) * MM_TO_PX;
  }
  
  let marginTop = customLayout.page.marginTop;
  let marginBottom = customLayout.page.marginBottom;
  
  if (customLayout.page.useDistinctMarginsForPages) {
    // Pagina dispari (pageIndex 0, 2, 4... corrispondono alle pagine 1, 3, 5...)
    if (pageIndex % 2 === 0) {
      marginTop = customLayout.page.oddPages?.marginTop ?? marginTop;
      marginBottom = customLayout.page.oddPages?.marginBottom ?? marginBottom;
    } else {
      // Pagina pari (pageIndex 1, 3, 5... corrispondono alle pagine 2, 4, 6...)
      marginTop = customLayout.page.evenPages?.marginTop ?? marginTop;
      marginBottom = customLayout.page.evenPages?.marginBottom ?? marginBottom;
    }
  }
  
  // Converti da mm a pixel
  return (A4_HEIGHT_MM - marginTop - marginBottom) * MM_TO_PX;
};

/**
 * Filtra le categorie in base alla selezione
 */
export const getFilteredCategories = (
  categories: Category[], 
  selectedCategories: string[]
): Category[] => {
  if (!selectedCategories || selectedCategories.length === 0) {
    return categories;
  }
  
  return categories.filter(category => selectedCategories.includes(category.id));
};

/**
 * Utilizza le funzioni di misurazione del testo per stimare l'altezza del titolo di categoria
 */
export { estimateCategoryTitleHeight };

/**
 * Utilizza le funzioni di misurazione del testo per stimare l'altezza del prodotto
 */
export { estimateProductHeight };
