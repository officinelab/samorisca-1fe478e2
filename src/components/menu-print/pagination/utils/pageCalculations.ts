
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";
import { 
  getAvailableHeight, 
  calculateCategoryTitleHeight, 
  calculateProductHeight
} from "@/hooks/menu-layouts/utils/heightCalculator";

/**
 * Calcola l'altezza disponibile per il contenuto (rispettando i margini)
 */
export const calculateAvailableHeight = (
  pageIndex: number, 
  A4_HEIGHT_MM: number, 
  customLayout?: PrintLayout | null
): number => {
  // Utilizziamo la nuova utility
  return getAvailableHeight(customLayout, pageIndex);
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (
  customLayout?: PrintLayout | null
): number => {
  // Valore di default se non abbiamo una categoria
  if (!customLayout) return 40;
  
  // Usiamo un "mock" di categoria per stimare l'altezza
  const mockCategory = {
    id: 'mock',
    title: 'Categoria',
    display_order: 0
  } as Category;
  
  return calculateCategoryTitleHeight(mockCategory, 'it', customLayout);
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
  // Utilizziamo direttamente la nuova utility più precisa
  return calculateProductHeight(product, language, customLayout);
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
