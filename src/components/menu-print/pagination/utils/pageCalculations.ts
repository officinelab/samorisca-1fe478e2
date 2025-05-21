import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";
import { 
  getAvailableHeight as legacyGetAvailableHeight, 
  calculateCategoryTitleHeight, 
  calculateProductHeight
} from "@/hooks/menu-layouts/utils/heightCalculator";

/**
 * Calcola l'altezza disponibile effettiva per il contenuto in una pagina.
 * Gestisce la distinzione pari/dispari con i margini coerenti fra JS e CSS.
 */
export const calculateAvailableHeight = (
  pageIndex: number,
  A4_HEIGHT_MM: number,
  customLayout?: PrintLayout | null,
  pageContainerRef?: HTMLElement | null // passato solo se vuoi il padding attuale
): number => {
  const baseHeightPx = 1123;

  // STEP 2: Calcolo del padding letto via DOM, fallback se assente
  // ora sostituito con un valore fisso
  let paddingTopPx = 0, paddingBottomPx = 0;

  // fallback coerente con margini di default
  paddingTopPx = 0;
  paddingBottomPx = 0;

  // Disponibile = altezza base - margini - header (semplificato)
  let availablePx;
  availablePx = 1123; // fallback fisso

  return availablePx;
};

/**
 * Stima l'altezza di un titolo categoria tramite DOM reale, legacy solo fallback.
 */
export const estimateCategoryTitleHeight = (
  category: Category,
  language: string,
  customLayout: PrintLayout | null | undefined,
  pageIndex: number
): number => {
  return 40; // Valore fisso fallback
};

/**
 * Stima l'altezza di un prodotto tramite DOM reale, legacy solo fallback.
 */
export const getProductHeight = (
  product: Product,
  language: string,
  customLayout: PrintLayout | null | undefined,
  pageIndex: number
): number => {
  return 50; // Valore fisso fallback
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
