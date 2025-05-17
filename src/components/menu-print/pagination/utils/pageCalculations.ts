import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";
import { 
  getAvailableHeight, 
  calculateCategoryTitleHeight, 
  calculateProductHeight,
  PX_PER_MM,
  mmToPx,
} from "@/hooks/menu-layouts/utils/heightCalculator";

/**
 * Calcola l'altezza disponibile per il contenuto (rispettando i margini e padding)
 */
export const calculateAvailableHeight = (
  pageIndex: number, 
  A4_HEIGHT_MM: number, 
  customLayout?: PrintLayout | null
): number => {
  // Margini (mm)
  let marginTop = 20, marginBottom = 20;
  if (customLayout?.page) {
    if (customLayout.page.useDistinctMarginsForPages) {
      if (pageIndex % 2 === 0) { // dispari
        marginTop = customLayout.page.oddPages?.marginTop ?? customLayout.page.marginTop ?? 20;
        marginBottom = customLayout.page.oddPages?.marginBottom ?? customLayout.page.marginBottom ?? 20;
      } else { // pari
        marginTop = customLayout.page.evenPages?.marginTop ?? customLayout.page.marginTop ?? 20;
        marginBottom = customLayout.page.evenPages?.marginBottom ?? customLayout.page.marginBottom ?? 20;
      }
    } else {
      marginTop = customLayout.page.marginTop ?? 20;
      marginBottom = customLayout.page.marginBottom ?? 20;
    }
  }

  // Utilizza sempre la conversione precisa mm→px
  return mmToPx(A4_HEIGHT_MM - marginTop - marginBottom);
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (
  category: Category,
  language: string,
  customLayout: PrintLayout | null | undefined,
  pageIndex: number
): number => {
  if (!customLayout) return 40;
  return calculateCategoryTitleHeight(category, language, customLayout, pageIndex);
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche,
 * utilizzando l'API Canvas quando disponibile
 */
export const getProductHeight = (
  product: Product,
  language: string,
  customLayout: PrintLayout | null | undefined,
  pageIndex: number
): number => {
  return calculateProductHeight(product, language, customLayout, pageIndex);
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
