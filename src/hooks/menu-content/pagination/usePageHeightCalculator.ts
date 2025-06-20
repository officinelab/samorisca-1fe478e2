
import { PrintLayout } from '@/types/printLayout';
import { calculateAvailableHeight } from '@/components/menu-print/pagination/utils/pageHeightCalculator';
import { MM_TO_PX } from '@/components/menu-print/pagination/utils/constants';

export const usePageHeightCalculator = (layout: PrintLayout | null) => {
  const A4_HEIGHT_MM = 297;
  const SAFETY_MARGIN_MM = 8;

  const getAvailableHeight = (pageNumber: number): number => {
    if (!layout) return 250;

    // Use the optimized calculation function that correctly considers odd/even pages
    const pageIndex = pageNumber - 1; // Convert to 0-based index
    const availableHeightPx = calculateAvailableHeight(pageIndex, A4_HEIGHT_MM, layout);
    
    // Convert from pixels to mm for compatibility with the rest of the code
    const availableHeightMm = availableHeightPx / MM_TO_PX;
    
    // Subtract safety margin
    const finalHeight = availableHeightMm - SAFETY_MARGIN_MM;
    
    console.log('📐 Pagina ' + pageNumber + ' - Altezza disponibile finale (con correzione pari/dispari):', {
      availableHeightPx: availableHeightPx.toFixed(2),
      availableHeightMm: availableHeightMm.toFixed(2),
      SAFETY_MARGIN_MM,
      finalHeight: finalHeight.toFixed(2),
      isOddPage: pageNumber % 2 === 1
    });
    
    return finalHeight;
  };

  return { getAvailableHeight };
};
