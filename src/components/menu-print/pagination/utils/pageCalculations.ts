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
  pageContainerRef?: HTMLElement | null // passato solo se vuoi il padding attuale
): number => {
  const baseHeightPx = mmToPx(A4_HEIGHT_MM);

  let marginTopMm = 20, marginBottomMm = 20;
  if (customLayout && customLayout.page) {
    if (customLayout.page.useDistinctMarginsForPages) {
      // Indice pari = pagina dispari (1, 3, 5...) -> pageIndex % 2 === 0
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

  // Se è dichiarato un header, sottrai anche quello
  const headerMm = typeof customLayout?.headerHeight === "number" ? customLayout.headerHeight : 0;

  // Calcolo del padding (px) tramite getComputedStyle
  let paddingTopPx = 0, paddingBottomPx = 0;
  if (pageContainerRef) {
    const style = window.getComputedStyle(pageContainerRef);
    paddingTopPx = parseFloat(style.paddingTop || "0");
    paddingBottomPx = parseFloat(style.paddingBottom || "0");
  } else {
    // fallback: ipotizziamo padding print stylesheet standard (20mm top/bottom)
    paddingTopPx = mmToPx(20);
    paddingBottomPx = mmToPx(20);
  }

  const availablePx = baseHeightPx 
    - mmToPx(marginTopMm)
    - mmToPx(marginBottomMm)
    - mmToPx(headerMm)
    - paddingTopPx
    - paddingBottomPx;

  // Log dettagliato per debug DOM vs JS
  console.log("[calculateAvailableHeight] pageIndex", pageIndex, {
    baseHeightPx,
    marginTopMm,
    marginBottomMm,
    headerMm,
    paddingTopPx,
    paddingBottomPx,
    availablePx
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
