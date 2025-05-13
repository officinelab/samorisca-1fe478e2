
import { PrintLayout } from '@/types/printLayout';

/**
 * Calcola i margini di pagina in base al layout e all'indice della pagina
 */
export const getPageMargins = (customLayout?: PrintLayout | null, pageIndex: number = 0): string => {
  if (!customLayout) {
    return '20mm 15mm 20mm 15mm'; // Margini predefiniti
  }
  
  // Se non è attivata l'opzione per i margini distinti
  if (!customLayout.page.useDistinctMarginsForPages) {
    return `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`;
  }
  
  // Assicurati che oddPages e evenPages siano definiti
  const oddPages = customLayout.page.oddPages || {
    marginTop: customLayout.page.marginTop,
    marginRight: customLayout.page.marginRight,
    marginBottom: customLayout.page.marginBottom,
    marginLeft: customLayout.page.marginLeft
  };
  
  const evenPages = customLayout.page.evenPages || {
    marginTop: customLayout.page.marginTop,
    marginRight: customLayout.page.marginRight,
    marginBottom: customLayout.page.marginBottom,
    marginLeft: customLayout.page.marginLeft
  };
  
  // Pagina dispari (0-based, quindi pageIndex 0, 2, 4... sono pagine 1, 3, 5...)
  if (pageIndex % 2 === 0) {
    return `${oddPages.marginTop}mm ${oddPages.marginRight}mm ${oddPages.marginBottom}mm ${oddPages.marginLeft}mm`;
  } 
  // Pagina pari (1, 3, 5...)
  else {
    return `${evenPages.marginTop}mm ${evenPages.marginRight}mm ${evenPages.marginBottom}mm ${evenPages.marginLeft}mm`;
  }
};
