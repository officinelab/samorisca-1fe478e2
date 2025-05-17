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

  // STEP 1: calcolo MARGINI effettivi in base a pagina pari/dispari (usiamo margini coerenti con il layout)
  let marginTopMm = 20, marginBottomMm = 20, marginLeftMm = 15, marginRightMm = 15;
  if (customLayout && customLayout.page) {
    const { page } = customLayout;
    const useDistinct = page.useDistinctMarginsForPages;
    // N.B.: LEFT per pagine dispari, RIGHT per pari secondo convenzione di stampa
    let margins;
    if (useDistinct) {
      // pageIndex: 0-based. 0,2,4... = oddPages, 1,3,5... = evenPages
      margins = (pageIndex % 2 === 0 ? page.oddPages : page.evenPages);
    } else {
      margins = page;
    }
    marginTopMm = margins.marginTop ?? 20;
    marginBottomMm = margins.marginBottom ?? 20;
    marginLeftMm = margins.marginLeft ?? 15;
    marginRightMm = margins.marginRight ?? 15;
  }

  // HEADER height va preso ora da customLayout.headerHeight
  const headerMm = typeof customLayout?.headerHeight === "number"
    ? customLayout.headerHeight
    : 0;

  // STEP 2: Calcolo del padding letto via DOM, fallback se assente
  let paddingTopPx = 0, paddingBottomPx = 0;
  if (pageContainerRef) {
    const style = window.getComputedStyle(pageContainerRef);
    paddingTopPx = parseFloat(style.paddingTop || "0");
    paddingBottomPx = parseFloat(style.paddingBottom || "0");
    // Debug per allineamento: mostro tutto
    console.log("[calculateAvailableHeight] DOM paddingTopPx:", paddingTopPx, "paddingBottomPx:", paddingBottomPx);
  } else {
    // fallback coerente con margini di default
    paddingTopPx = mmToPx(marginTopMm);
    paddingBottomPx = mmToPx(marginBottomMm);
    // Debug fallback
    console.log("[calculateAvailableHeight] NO DOM, fallback paddingTopPx:", paddingTopPx, "paddingBottomPx:", paddingBottomPx);
  }

  // Disponibile = altezza base - margini - header - solo padding residuo effettivo se è DIVERSO dai margini
  // Se padding==marginTop/marginBottom, il padding è già contato nei margini! Quindi NON vanno sottratti due volte.
  let availablePx;
  if (pageContainerRef) {
    // Se il padding effettivo nel DOM è DIVERSO dal marginTop/marginBottom, conta solo la differenza!
    const expectedTopPx = mmToPx(marginTopMm);
    const expectedBottomPx = mmToPx(marginBottomMm);
    const paddingDeltaTop = Math.max(0, paddingTopPx - expectedTopPx);
    const paddingDeltaBottom = Math.max(0, paddingBottomPx - expectedBottomPx);
    availablePx = baseHeightPx
      - mmToPx(marginTopMm)
      - mmToPx(marginBottomMm)
      - mmToPx(headerMm)
      - paddingDeltaTop
      - paddingDeltaBottom;
    // Debug dettagliato
    console.log(
      "[calculateAvailableHeight] DRY RUN: baseHeightPx:", baseHeightPx,
      "marginTopMm:", marginTopMm, "marginBottomMm:", marginBottomMm,
      "headerMm:", headerMm,
      "paddingTopPx:", paddingTopPx, "paddingBottomPx:", paddingBottomPx,
      "expectedTopPx:", expectedTopPx, "expectedBottomPx:", expectedBottomPx,
      "paddingDeltaTop:", paddingDeltaTop, "paddingDeltaBottom:", paddingDeltaBottom,
      "availablePx:", availablePx
    );
  } else {
    availablePx = baseHeightPx
      - mmToPx(marginTopMm)
      - mmToPx(marginBottomMm)
      - mmToPx(headerMm);
    // Debug fallback
    console.log(
      "[calculateAvailableHeight] fallback baseHeightPx:", baseHeightPx,
      "marginTopMm:", marginTopMm, "marginBottomMm:", marginBottomMm,
      "headerMm:", headerMm,
      "availablePx:", availablePx
    );
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
