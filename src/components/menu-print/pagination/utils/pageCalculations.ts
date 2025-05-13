
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";
import { calculateProductTotalHeight, estimateProductHeight } from "./textMeasurement";

// Fattore di conversione più preciso da millimetri a pixel
const MM_TO_PX = 3.85;

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
  
  // Usa esattamente l'altezza disponibile (margine inferiore preciso) senza margini di sicurezza aggiuntivi
  return (A4_HEIGHT_MM - marginTop - marginBottom) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 40; // Valore di default aumentato per sicurezza
  
  // Calcola l'altezza in base alla dimensione del font e ai margini
  const fontSize = customLayout.elements.category.fontSize;
  const marginTop = customLayout.elements.category.margin.top;
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin;
  
  // Converti mm in px e aggiungi l'altezza del font
  return ((fontSize * 1.5) + marginTop + marginBottom) * MM_TO_PX / 3;
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche,
 * utilizzando l'API Canvas quando disponibile
 */
export const getProductHeight = (
  product: Product,
  language: string,
  customLayout?: PrintLayout | null
): number => {
  try {
    // Usa il calcolo preciso con Canvas
    return calculateProductTotalHeight(product, language, customLayout);
  } catch (error) {
    // Fallback all'algoritmo di stima
    console.warn('Fallback al calcolo stimato dell\'altezza del prodotto:', error);
    return estimateProductHeight(product, language, customLayout);
  }
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
