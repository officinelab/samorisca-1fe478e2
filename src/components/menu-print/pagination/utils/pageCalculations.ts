
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";

// Fattore di conversione più preciso da millimetri a pixel
const MM_TO_PX = 3.78;

/**
 * Calcola l'altezza disponibile per il contenuto (rispettando i margini)
 */
export const calculateAvailableHeight = (
  pageIndex: number, 
  A4_HEIGHT_MM: number, 
  customLayout?: PrintLayout | null
): number => {
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
  
  // Sottrai un margine di sicurezza più grande per evitare che elementi si estendano oltre il bordo
  const safetyMargin = 10;
  return (A4_HEIGHT_MM - marginTop - marginBottom - safetyMargin) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 30;
  
  // Aumenta significativamente il valore per assicurarsi che ci sia spazio sufficiente
  const baseFontSize = customLayout.elements.category.fontSize * 1.8;
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin;
  
  return (baseFontSize + marginBottom) * 1.5;
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche
 * Con un margine di sicurezza aumentato
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
): number => {
  // Base height for all products - aumentata
  let height = 35;
  
  // Increase height if there's a description
  const hasDescription = !!product.description || !!product[`description_${language}`];
  if (hasDescription) {
    const descriptionText = (product[`description_${language}`] as string) || product.description || "";
    const descriptionLength = descriptionText.length;
    
    // Stime aumentate per evitare che il testo si estenda oltre il margine
    if (descriptionLength > 200) {
      height += 70; // Descrizioni molto lunghe
    } else if (descriptionLength > 100) {
      height += 50; // Descrizioni lunghe
    } else if (descriptionLength > 50) {
      height += 30; // Descrizioni medie
    } else {
      height += 20; // Descrizioni brevi
    }
  }
  
  // Increase height for multiple price variants
  if (product.has_multiple_prices) {
    height += 25;
  }
  
  // Increase height if product has allergens
  if (product.allergens && product.allergens.length > 0) {
    height += 15;
  }
  
  return height;
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
