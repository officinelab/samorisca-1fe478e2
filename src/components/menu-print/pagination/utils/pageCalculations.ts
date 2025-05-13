
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
  
  // Sottrai un margine di sicurezza esplicito per evitare overflow
  const safetyMargin = 8; // 8mm di margine di sicurezza
  return (A4_HEIGHT_MM - marginTop - marginBottom - safetyMargin) * MM_TO_PX;
};

/**
 * Calcola la larghezza disponibile per il contenuto (rispettando i margini)
 */
export const calculateAvailableWidth = (
  pageIndex: number, 
  A4_WIDTH_MM: number, 
  customLayout?: PrintLayout | null
): number => {
  let marginLeft = 15;
  let marginRight = 15;
  
  if (customLayout) {
    if (customLayout.page.useDistinctMarginsForPages) {
      if (pageIndex % 2 === 0) {
        // Pagina dispari (1,3,5)
        marginLeft = customLayout.page.oddPages?.marginLeft || customLayout.page.marginLeft;
        marginRight = customLayout.page.oddPages?.marginRight || customLayout.page.marginRight;
      } else {
        // Pagina pari (2,4,6)
        marginLeft = customLayout.page.evenPages?.marginLeft || customLayout.page.marginLeft;
        marginRight = customLayout.page.evenPages?.marginRight || customLayout.page.marginRight;
      }
    } else {
      marginLeft = customLayout.page.marginLeft;
      marginRight = customLayout.page.marginRight;
    }
  }
  
  // Sottrai un piccolo margine di sicurezza laterale
  const safetyMargin = 3; // 3mm di margine di sicurezza laterale
  return (A4_WIDTH_MM - marginLeft - marginRight - safetyMargin) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 * @deprecated Usa useTextMeasurement.estimateCategoryTitleHeight invece
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 30;
  
  // Aumenta leggermente il valore per assicurarsi che ci sia spazio sufficiente
  const baseFontSize = customLayout.elements.category.fontSize * 1.5;
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin;
  
  return (baseFontSize + marginBottom) * 1.2;
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche
 * @deprecated Usa useTextMeasurement.estimateProductHeight invece
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
): number => {
  // Base height for all products
  let height = 30;
  
  // Increase height if there's a description
  const hasDescription = !!product.description || !!product[`description_${language}`];
  if (hasDescription) {
    const descriptionText = (product[`description_${language}`] as string) || product.description || "";
    const descriptionLength = descriptionText.length;
    
    // Stima l'altezza della descrizione in base alla lunghezza del testo
    if (descriptionLength > 200) {
      height += 60; // Descrizioni molto lunghe
    } else if (descriptionLength > 100) {
      height += 40; // Descrizioni lunghe
    } else if (descriptionLength > 50) {
      height += 25; // Descrizioni medie
    } else {
      height += 15; // Descrizioni brevi
    }
  }
  
  // Increase height for multiple price variants
  if (product.has_multiple_prices) {
    height += 20;
  }
  
  // Increase height if product has allergens
  if (product.allergens && product.allergens.length > 0) {
    height += 10;
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
