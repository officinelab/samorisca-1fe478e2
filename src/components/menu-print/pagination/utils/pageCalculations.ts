
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
  
  // Non sottraiamo più un margine di sicurezza esplicito qui poiché lo faremo nell'hook di paginazione
  return (A4_HEIGHT_MM - marginTop - marginBottom) * MM_TO_PX;
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
  
  // Non sottraiamo più un margine di sicurezza esplicito qui poiché lo faremo nell'hook di paginazione
  return (A4_WIDTH_MM - marginLeft - marginRight) * MM_TO_PX;
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
