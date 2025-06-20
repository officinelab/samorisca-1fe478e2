
import { PrintLayout } from "@/types/printLayout";
import { MM_TO_PX } from "./constants";
import { calculateServiceLineHeight } from "@/hooks/menu-content/calculators/serviceCalculator";

/**
 * Calcola l'altezza disponibile effettiva per il contenuto in una pagina.
 * Gestisce la distinzione pari/dispari con i margini coerenti fra JS e CSS.
 * VERSIONE PRECISA con correzioni per margini nascosti.
 */
export const calculateAvailableHeight = (
  pageIndex: number,
  A4_HEIGHT_MM: number,
  customLayout?: PrintLayout | null,
  pageContainerRef?: HTMLElement | null
): number => {
  if (!customLayout?.page) {
    // Default margins di 25mm per tutti i lati
    const defaultServiceHeight = 15 * MM_TO_PX; // 15mm per la linea del servizio
    return (A4_HEIGHT_MM - 50) * MM_TO_PX - defaultServiceHeight; // 50mm di margini totali + servizio
  }

  let topMargin: number;
  let bottomMargin: number;

  // Determina i margini in base al tipo di pagina e all'indice
  if (customLayout.page.useDistinctMarginsForPages) {
    // Le pagine pari/dispari hanno margini diversi
    const isOddPage = pageIndex % 2 === 1;
    if (isOddPage) {
      topMargin = customLayout.page.oddPages.marginTop;
      bottomMargin = customLayout.page.oddPages.marginBottom;
    } else {
      topMargin = customLayout.page.evenPages.marginTop;
      bottomMargin = customLayout.page.evenPages.marginBottom;
    }
  } else {
    // Usa i margini standard per tutte le pagine
    topMargin = customLayout.page.marginTop;
    bottomMargin = customLayout.page.marginBottom;
  }

  // Calcola l'altezza disponibile in millimetri prima della conversione in pixel
  const availableHeightMm = A4_HEIGHT_MM - topMargin - bottomMargin;
  const availableHeightPx = availableHeightMm * MM_TO_PX;
  
  // 🔥 CORREZIONE: Il servizio appare SOLO nelle pagine dispari
  const pageNumber = pageIndex + 1; // Converti a numero pagina 1-based
  const isOddPage = pageNumber % 2 === 1;
  
  let finalAvailableHeight = availableHeightPx;
  
  // MARGINI NASCOSTI - Fattori che riducono l'altezza disponibile effettiva
  const HIDDEN_REDUCTION_FACTORS = {
    // Margini CSS impliciti del browser
    browserImplicitMargins: 8 * MM_TO_PX, // 8mm di margini browser non visibili
    
    // Problemi di rendering del print media
    printMediaDiscrepancies: 5 * MM_TO_PX, // 5mm di differenze print/screen
    
    // Arrotondamenti e perdite di precisione
    roundingLosses: 3 * MM_TO_PX, // 3mm per arrotondamenti vari
    
    // Padding/margin collapse imprevisti
    unexpectedCollapse: 4 * MM_TO_PX, // 4mm per margin collapse
    
    // Buffer finale di sicurezza estrema
    extremeSafetyBuffer: 6 * MM_TO_PX // 6mm buffer finale
  };
  
  const totalHiddenReduction = Object.values(HIDDEN_REDUCTION_FACTORS).reduce((sum, factor) => sum + factor, 0);
  
  if (isOddPage) {
    // Solo nelle pagine dispari, sottrai l'altezza del servizio
    const serviceLineHeightMm = calculateServiceLineHeight(customLayout);
    const serviceLineHeightPx = serviceLineHeightMm * MM_TO_PX;
    finalAvailableHeight = availableHeightPx - serviceLineHeightPx - totalHiddenReduction;
    
    console.log('📐 Calcolo altezza PRECISO pagina DISPARI ' + pageNumber + ':', {
      A4_HEIGHT_MM,
      topMargin,
      bottomMargin,
      serviceLineHeightPx: serviceLineHeightPx.toFixed(2),
      serviceLineHeightMm: serviceLineHeightMm.toFixed(2),
      availableHeightMm: availableHeightMm.toFixed(2),
      availableHeightPx: availableHeightPx.toFixed(2),
      hiddenReductions: {
        browserImplicitMargins: (HIDDEN_REDUCTION_FACTORS.browserImplicitMargins / MM_TO_PX).toFixed(1) + 'mm',
        printMediaDiscrepancies: (HIDDEN_REDUCTION_FACTORS.printMediaDiscrepancies / MM_TO_PX).toFixed(1) + 'mm',
        roundingLosses: (HIDDEN_REDUCTION_FACTORS.roundingLosses / MM_TO_PX).toFixed(1) + 'mm',
        unexpectedCollapse: (HIDDEN_REDUCTION_FACTORS.unexpectedCollapse / MM_TO_PX).toFixed(1) + 'mm',
        extremeSafetyBuffer: (HIDDEN_REDUCTION_FACTORS.extremeSafetyBuffer / MM_TO_PX).toFixed(1) + 'mm',
        totalMm: (totalHiddenReduction / MM_TO_PX).toFixed(1) + 'mm',
        totalPx: totalHiddenReduction.toFixed(2)
      },
      finalAvailableHeight: finalAvailableHeight.toFixed(2),
      reductionPercentage: ((totalHiddenReduction / availableHeightPx) * 100).toFixed(1) + '%',
      serviceConfig: customLayout.servicePrice
    });
  } else {
    finalAvailableHeight = availableHeightPx - totalHiddenReduction;
    
    console.log('📐 Calcolo altezza PRECISO pagina PARI ' + pageNumber + ':', {
      A4_HEIGHT_MM,
      topMargin,
      bottomMargin,
      availableHeightMm: availableHeightMm.toFixed(2),
      availableHeightPx: availableHeightPx.toFixed(2),
      hiddenReductions: {
        browserImplicitMargins: (HIDDEN_REDUCTION_FACTORS.browserImplicitMargins / MM_TO_PX).toFixed(1) + 'mm',
        printMediaDiscrepancies: (HIDDEN_REDUCTION_FACTORS.printMediaDiscrepancies / MM_TO_PX).toFixed(1) + 'mm',
        roundingLosses: (HIDDEN_REDUCTION_FACTORS.roundingLosses / MM_TO_PX).toFixed(1) + 'mm',
        unexpectedCollapse: (HIDDEN_REDUCTION_FACTORS.unexpectedCollapse / MM_TO_PX).toFixed(1) + 'mm',
        extremeSafetyBuffer: (HIDDEN_REDUCTION_FACTORS.extremeSafetyBuffer / MM_TO_PX).toFixed(1) + 'mm',
        totalMm: (totalHiddenReduction / MM_TO_PX).toFixed(1) + 'mm',
        totalPx: totalHiddenReduction.toFixed(2)
      },
      finalAvailableHeight: finalAvailableHeight.toFixed(2),
      reductionPercentage: ((totalHiddenReduction / availableHeightPx) * 100).toFixed(1) + '%',
      note: 'Nessun servizio sottratto (pagina pari)'
    });
  }
  
  return finalAvailableHeight;
};
