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
 * Gestisce la distinzione pari/dispari con i margini coerenti fra JS e CSS.
 */
export const calculateAvailableHeight = (
  pageIndex: number,
  A4_HEIGHT_MM: number,
  customLayout?: PrintLayout | null,
  pageContainerRef?: HTMLElement | null // passato solo se vuoi il padding attuale
): number => {
  const baseHeightPx = mmToPx(A4_HEIGHT_MM);

  // STEP 1: calcolo MARGINI in base a pagina pari/dispari
  let marginTopMm = 20, marginBottomMm = 20;
  if (customLayout && customLayout.page) {
    // Logica corretta: pari/dispari
    const distinct = customLayout.page.useDistinctMarginsForPages;
    let margins;
    if (distinct) {
      // Attenzione: lato sinistro = dispari, lato destro = pari
      // pageIndex 0,2,4... = dispari (sinistra/left)
      // pageIndex 1,3,5... = pari (destra/right)
      margins = (pageIndex % 2 === 0
        ? customLayout.page.oddPages
        : customLayout.page.evenPages);
    } else {
      margins = customLayout.page;
    }
    marginTopMm = margins.marginTop ?? 20;
    marginBottomMm = margins.marginBottom ?? 20;
  }

  // Header opzionale, per sicurezza fallback 0
  const headerMm = typeof customLayout?.headerHeight === "number" ? customLayout.headerHeight : 0;

  // STEP 4: Calcolo del padding letto via DOM, fallback se assente
  let paddingTopPx = 0, paddingBottomPx = 0;
  if (pageContainerRef) {
    const style = window.getComputedStyle(pageContainerRef);
    paddingTopPx = parseFloat(style.paddingTop || "0");
    paddingBottomPx = parseFloat(style.paddingBottom || "0");
    // STEP 4.1: Log dei padding per verifica
    console.log("[calculateAvailableHeight] DOM paddingTopPx:", paddingTopPx, "paddingBottomPx:", paddingBottomPx);
  } else {
    // fallback se il ref non è passato
    paddingTopPx = mmToPx(20);
    paddingBottomPx = mmToPx(20);
  }

  // Disponibile = altezza base - margini - header - padding
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
