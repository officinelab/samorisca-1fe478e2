
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
 * Fix: Fallback robusti sui margini
 */
export const calculateAvailableHeight = (
  pageIndex: number,
  A4_HEIGHT_MM: number,
  customLayout?: PrintLayout | null,
  pageContainerRef?: HTMLElement | null
): number => {
  const baseHeightPx = mmToPx(A4_HEIGHT_MM);
  // Fallback predefiniti robusti
  const fallbackMargins = { marginTop: 20, marginBottom: 20 };
  let marginTopMm = fallbackMargins.marginTop,
      marginBottomMm = fallbackMargins.marginBottom;
  if (customLayout && customLayout.page) {
    if (customLayout.page.useDistinctMarginsForPages) {
      const odd = customLayout.page.oddPages || {};
      const even = customLayout.page.evenPages || {};
      const currentMargins = pageIndex % 2 === 0 ? odd : even;
      marginTopMm = currentMargins.marginTop ?? customLayout.page.marginTop ?? fallbackMargins.marginTop;
      marginBottomMm = currentMargins.marginBottom ?? customLayout.page.marginBottom ?? fallbackMargins.marginBottom;
    } else {
      marginTopMm = customLayout.page.marginTop ?? fallbackMargins.marginTop;
      marginBottomMm = customLayout.page.marginBottom ?? fallbackMargins.marginBottom;
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
  if (!availablePx || isNaN(availablePx)) {
    console.warn('calculateAvailableHeight: calcolo fallito, fallback sicuro a 960px', { baseHeightPx, marginTopMm, marginBottomMm, headerMm });
    return 960;
  }
  // Debug: Mostra parametri usati per il calcolo
  console.log("[calculateAvailableHeight] page", pageIndex, {
    baseHeightPx, marginTopMm, marginBottomMm, headerMm,
    paddingTopPx, paddingBottomPx, availablePx
  });
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
