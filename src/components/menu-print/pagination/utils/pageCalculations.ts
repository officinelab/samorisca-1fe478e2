import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";
import { 
  getAvailableHeight as legacyGetAvailableHeight, 
  calculateCategoryTitleHeight, 
  calculateProductHeight
} from "@/hooks/menu-layouts/utils/heightCalculator";
import { PX_PER_MM, mmToPx } from "@/hooks/menu-print/printUnits";

/**
 * Calcola l'altezza disponibile effettiva per il contenuto in una pagina.
 * Sottrae: margini pagina + eventuale header in mm
 * Tutto convertito in px tramite mmToPx UNIFICATO.
 */
export const calculateAvailableHeight = (
  pageIndex: number,
  A4_HEIGHT_MM: number,
  customLayout?: PrintLayout | null,
  pageContainerRef?: HTMLElement | null
): number => {
  const baseHeightPx = mmToPx(A4_HEIGHT_MM);
  let marginTopMm = 20, marginBottomMm = 20;
  if (customLayout && customLayout.page) {
    if (customLayout.page.useDistinctMarginsForPages) {
      if (typeof pageIndex !== "number") pageIndex = 0;
      // fallback robusto, se mancano odd/evenPages
      if (pageIndex % 2 === 0) {
        marginTopMm = customLayout.page.oddPages?.marginTop ?? customLayout.page.marginTop ?? 20;
        marginBottomMm = customLayout.page.oddPages?.marginBottom ?? customLayout.page.marginBottom ?? 20;
      } else {
        marginTopMm = customLayout.page.evenPages?.marginTop ?? customLayout.page.marginTop ?? 20;
        marginBottomMm = customLayout.page.evenPages?.marginBottom ?? customLayout.page.marginBottom ?? 20;
      }
    } else {
      marginTopMm = customLayout.page.marginTop ?? 20;
      marginBottomMm = customLayout.page.marginBottom ?? 20;
    }
  }
  const headerMm = customLayout?.headerHeight ?? 0;

  let paddingTopPx = 0, paddingBottomPx = 0;
  if (pageContainerRef) {
    const style = window.getComputedStyle(pageContainerRef);
    paddingTopPx = parseFloat(style.paddingTop || "0");
    paddingBottomPx = parseFloat(style.paddingBottom || "0");
  }

  const availablePx = baseHeightPx 
    - mmToPx(marginTopMm)
    - mmToPx(marginBottomMm)
    - mmToPx(headerMm)
    - paddingTopPx
    - paddingBottomPx;
  // Fallback robusto e logging
  if (!availablePx || isNaN(availablePx)) {
    console.warn('calculateAvailableHeight: calcolo fallito, fallback sicuro a 960px', { baseHeightPx, marginTopMm, marginBottomMm, headerMm });
    return 960; // Default fallback
  }
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
  if (!customLayout) return 40;
  return calculateCategoryTitleHeight(category, language, customLayout, pageIndex);
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
