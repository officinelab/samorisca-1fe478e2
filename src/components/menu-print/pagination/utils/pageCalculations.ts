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
 * Calcola l'altezza disponibile per il contenuto (rispettando margini, header e padding se info disponibili)
 */
export const calculateAvailableHeight = (
  pageIndex: number, 
  A4_HEIGHT_MM: number, 
  customLayout?: PrintLayout | null,
  pageContainerRef?: HTMLElement | null
): number => {
  // Utilizzo sempre il nuovo calcolo centralizzato
  return getAvailableHeight(customLayout, pageIndex, pageContainerRef);
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
