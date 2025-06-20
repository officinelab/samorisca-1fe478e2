
import { PrintLayout } from "@/types/printLayout";
import { MM_TO_PX } from "./constants";

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

  // Calcola l'altezza del footer (linea servizio e coperto) usando la configurazione del layout
  const serviceLineHeight = calculateServiceLineHeight(customLayout);
  
  // Calcola l'altezza disponibile in millimetri prima della conversione in pixel
  const availableHeightMm = A4_HEIGHT_MM - topMargin - bottomMargin;
  const availableHeightPx = availableHeightMm * MM_TO_PX;
  
  // Sottrai l'altezza del footer dalla disponibilità totale
  const finalAvailableHeight = availableHeightPx - serviceLineHeight;
  
  console.log('📐 Calcolo altezza disponibile pagina ' + (pageIndex + 1) + ':', {
    A4_HEIGHT_MM,
    topMargin,
    bottomMargin,
    serviceLineHeightPx: serviceLineHeight,
    serviceLineHeightMm: serviceLineHeight / MM_TO_PX,
    availableHeightMm,
    availableHeightPx,
    finalAvailableHeight,
    serviceConfig: customLayout.servicePrice
  });
  
  return finalAvailableHeight;
};

/**
 * Calcola l'altezza della linea del servizio/coperto usando la configurazione del layout
 */
function calculateServiceLineHeight(customLayout?: PrintLayout | null): number {
  if (!customLayout?.servicePrice) {
    // Default: 15mm per la linea del servizio
    return 15 * MM_TO_PX;
  }

  const serviceConfig = customLayout.servicePrice;
  
  // Calcola l'altezza del testo basata sulla dimensione del font
  // Conversione da pt a px: 1pt = 1.333px
  const fontSizePx = serviceConfig.fontSize * 1.333;
  
  // Altezza base del testo con line-height di 1.4
  const textHeightPx = fontSizePx * 1.4;
  
  // Converti i margini da mm a px
  const marginTopPx = serviceConfig.margin.top * MM_TO_PX;
  const marginBottomPx = serviceConfig.margin.bottom * MM_TO_PX;
  
  // Aggiungi un padding interno standard per il testo (circa 8px sopra e sotto)
  const internalPaddingPx = 16;
  
  // Calcola l'altezza totale
  const totalHeight = textHeightPx + marginTopPx + marginBottomPx + internalPaddingPx;
  
  console.log('💰 Calcolo altezza linea servizio:', {
    fontSize: serviceConfig.fontSize,
    fontSizePx,
    textHeightPx,
    marginTopMm: serviceConfig.margin.top,
    marginBottomMm: serviceConfig.margin.bottom,
    marginTopPx,
    marginBottomPx,
    internalPaddingPx,
    totalHeightPx: totalHeight,
    totalHeightMm: totalHeight / MM_TO_PX
  });
  
  return totalHeight;
}
