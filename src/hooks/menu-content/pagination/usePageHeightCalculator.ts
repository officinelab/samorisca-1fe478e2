
import { PrintLayout } from '@/types/printLayout';
import { calculateAvailableHeight } from '@/components/menu-print/pagination/utils/pageHeightCalculator';
import { MM_TO_PX } from '@/components/menu-print/pagination/utils/constants';

export const usePageHeightCalculator = (layout: PrintLayout | null) => {
  const A4_HEIGHT_MM = 297;
  // Aumentato significativamente il margine di sicurezza per compensare margini nascosti
  const SAFETY_MARGIN_MM = 25; // Da 8mm a 25mm per maggiore sicurezza
  
  // Margini aggiuntivi per compensare fattori non visibili
  const HIDDEN_MARGINS = {
    browserDefault: 3, // Margini di default del browser
    lineHeightBuffer: 2, // Buffer per line-height imprecisi
    cssRounding: 1.5, // Perdita di precisione negli arrotondamenti CSS
    printMediaBuffer: 2, // Differenze nel rendering per stampa
    elementSpacing: 1.5 // Spacing extra tra elementi non calcolato
  };

  const getAvailableHeight = (pageNumber: number): number => {
    if (!layout) return 250;

    // Use the optimized calculation function that correctly considers odd/even pages
    const pageIndex = pageNumber - 1; // Convert to 0-based index
    const availableHeightPx = calculateAvailableHeight(pageIndex, A4_HEIGHT_MM, layout);
    
    // Convert from pixels to mm for compatibility with the rest of the code
    const availableHeightMm = availableHeightPx / MM_TO_PX;
    
    // Calcola margini nascosti totali
    const totalHiddenMargins = Object.values(HIDDEN_MARGINS).reduce((sum, margin) => sum + margin, 0);
    
    // Sottrai tutti i margini: sicurezza + margini nascosti
    const totalMarginReduction = SAFETY_MARGIN_MM + totalHiddenMargins;
    const finalHeight = availableHeightMm - totalMarginReduction;
    
    console.log('📐 Pagina ' + pageNumber + ' - Calcolo altezza PRECISO con margini nascosti:', {
      availableHeightPx: availableHeightPx.toFixed(2),
      availableHeightMm: availableHeightMm.toFixed(2),
      SAFETY_MARGIN_MM,
      hiddenMargins: {
        browserDefault: HIDDEN_MARGINS.browserDefault,
        lineHeightBuffer: HIDDEN_MARGINS.lineHeightBuffer,
        cssRounding: HIDDEN_MARGINS.cssRounding,
        printMediaBuffer: HIDDEN_MARGINS.printMediaBuffer,
        elementSpacing: HIDDEN_MARGINS.elementSpacing,
        total: totalHiddenMargins
      },
      totalMarginReduction,
      finalHeight: finalHeight.toFixed(2),
      isOddPage: pageNumber % 2 === 1,
      reductionPercentage: ((totalMarginReduction / availableHeightMm) * 100).toFixed(1) + '%'
    });
    
    return finalHeight;
  };

  return { getAvailableHeight };
};
