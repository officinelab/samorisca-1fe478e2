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
    return (A4_HEIGHT_MM - 50) * MM_TO_PX; // 50mm di margini totali (25 sopra + 25 sotto)
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

  // Calcola l'altezza del footer (linea servizio e coperto)
  const serviceLineHeight = calculateServiceLineHeight(customLayout);
  
  // Calcola l'altezza disponibile in pixel
  // Sottrai i margini superiore e inferiore, più lo spazio per il footer
  const availableHeightMm = A4_HEIGHT_MM - topMargin - bottomMargin;
  const availableHeightPx = availableHeightMm * MM_TO_PX;
  
  // Sottrai l'altezza del footer dalla disponibilità totale
  return availableHeightPx - serviceLineHeight;
};

/**
 * Calcola l'altezza della linea del servizio/coperto
 */
function calculateServiceLineHeight(customLayout?: PrintLayout | null): number {
  if (!customLayout?.servicePrice) {
    // Default: 15mm per la linea del servizio
    return 15 * MM_TO_PX;
  }

  const serviceConfig = customLayout.servicePrice;
  const fontSize = serviceConfig.fontSize || 12;
  const lineHeight = fontSize * 1.5;
  const margins = serviceConfig.margin;
  
  // Altezza totale = altezza testo + margini + bordo superiore
  const totalHeight = lineHeight + 
                     (margins.top + margins.bottom) * MM_TO_PX + 
                     10; // 10px extra per il bordo e padding
  
  return totalHeight;
}