
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";
import { 
  getAvailableHeight, 
  calculateCategoryTitleHeight, 
  calculateProductHeight,
  calculateCategoryWithProductsHeight
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
  // Valore di default se non abbiamo una categoria o layout
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
 * Calcola l'altezza di un prodotto in base alle sue caratteristiche
 * e al layout selezionato
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
 * Calcola l'altezza totale di una categoria con tutti i suoi prodotti
 */
export const getCategoryWithProductsHeight = (
  category: Category,
  products: Product[],
  language: string,
  customLayout?: PrintLayout | null
): number => {
  return calculateCategoryWithProductsHeight(category, products, language, customLayout);
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

/**
 * Verifica se una categoria è troppo grande per essere contenuta in una singola pagina
 * In tal caso deve essere spezzata su più pagine
 */
export const isCategoryTooBigForSinglePage = (
  category: Category,
  products: Product[],
  language: string,
  availableHeight: number,
  customLayout?: PrintLayout | null
): boolean => {
  const categoryHeight = calculateCategoryWithProductsHeight(
    category, products, language, customLayout
  );
  
  return categoryHeight > availableHeight;
};
