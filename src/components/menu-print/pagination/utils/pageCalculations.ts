
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";

/**
 * Calcola l'altezza disponibile per il contenuto (rispettando i margini)
 */
export const calculateAvailableHeight = (
  pageIndex: number, 
  A4_HEIGHT_MM: number, 
  customLayout?: PrintLayout | null
): number => {
  const MM_TO_PX = 3.78; // Fattore di conversione approssimativo
  
  let marginTop = 20;
  let marginBottom = 20;
  
  if (customLayout) {
    if (customLayout.page.useDistinctMarginsForPages) {
      if (pageIndex % 2 === 0) {
        // Pagina dispari (1,3,5)
        marginTop = customLayout.page.oddPages?.marginTop || customLayout.page.marginTop;
        marginBottom = customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom;
      } else {
        // Pagina pari (2,4,6)
        marginTop = customLayout.page.evenPages?.marginTop || customLayout.page.marginTop;
        marginBottom = customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom;
      }
    } else {
      marginTop = customLayout.page.marginTop;
      marginBottom = customLayout.page.marginBottom;
    }
  }
  
  return (A4_HEIGHT_MM - marginTop - marginBottom) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 30;
  
  return (customLayout.elements.category.fontSize * 1.5) + customLayout.spacing.categoryTitleBottomMargin;
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
): number => {
  const hasDescription = !!product.description || !!product[`description_${language}`];
  return (hasDescription ? 60 : 30) + (product.has_multiple_prices ? 20 : 0);
};

/**
 * Filtra le categorie selezionate dall'elenco completo
 */
export const getFilteredCategories = (
  categories: Category[],
  selectedCategories: string[]
): Category[] => {
  return categories.filter(cat => selectedCategories.includes(cat.id));
};
