
import { PrintLayout } from "@/types/printLayout";
import { MM_TO_PX } from "./constants";
import { calculateServiceLineHeight } from "@/hooks/menu-content/calculators/serviceCalculator";

/**
 * Calcola l'altezza disponibile effettiva per il contenuto in una pagina.
 * Gestisce la distinzione pari/dispari con i margini coerenti fra JS e CSS.
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
  
  if (isOddPage) {
    // Solo nelle pagine dispari, sottrai l'altezza del servizio
    const serviceLineHeightMm = calculateServiceLineHeight(customLayout);
    const serviceLineHeightPx = serviceLineHeightMm * MM_TO_PX;
    finalAvailableHeight = availableHeightPx - serviceLineHeightPx;
    
    console.log('📐 Calcolo altezza disponibile pagina DISPARI ' + pageNumber + ':', {
      A4_HEIGHT_MM,
      topMargin,
      bottomMargin,
      serviceLineHeightPx: serviceLineHeightPx.toFixed(2),
      serviceLineHeightMm: serviceLineHeightMm.toFixed(2),
      availableHeightMm: availableHeightMm.toFixed(2),
      availableHeightPx: availableHeightPx.toFixed(2),
      finalAvailableHeight: finalAvailableHeight.toFixed(2),
      serviceConfig: customLayout.servicePrice
    });
  } else {
    console.log('📐 Calcolo altezza disponibile pagina PARI ' + pageNumber + ':', {
      A4_HEIGHT_MM,
      topMargin,
      bottomMargin,
      availableHeightMm: availableHeightMm.toFixed(2),
      availableHeightPx: availableHeightPx.toFixed(2),
      finalAvailableHeight: finalAvailableHeight.toFixed(2),
      note: 'Nessun servizio sottratto (pagina pari)'
    });
  }
  
  return finalAvailableHeight;
};
