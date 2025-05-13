
import { PrintLayout } from "@/types/printLayout";

/**
 * Ottiene i margini della pagina in formato CSS basati sul layout e sull'indice della pagina
 */
export const getPageMargins = (customLayout?: PrintLayout | null, pageIndex = 0): string => {
  if (!customLayout) {
    return '20mm 15mm 20mm 15mm'; // Margini predefiniti
  }

  // Se non è attivata l'opzione per i margini distinti, usa i margini generali
  if (!customLayout.page.useDistinctMarginsForPages) {
    return `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`;
  }
  
  // Ottieni i margini appropriati basati sull'indice della pagina (pari/dispari)
  // Pagina dispari (0-based, quindi pageIndex 0, 2, 4... sono pagine 1, 3, 5...)
  if (pageIndex % 2 === 0) {
    const oddPages = customLayout.page.oddPages || {
      marginTop: customLayout.page.marginTop,
      marginRight: customLayout.page.marginRight,
      marginBottom: customLayout.page.marginBottom,
      marginLeft: customLayout.page.marginLeft
    };
    
    return `${oddPages.marginTop}mm ${oddPages.marginRight}mm ${oddPages.marginBottom}mm ${oddPages.marginLeft}mm`;
  } 
  // Pagina pari (1, 3, 5...)
  else {
    const evenPages = customLayout.page.evenPages || {
      marginTop: customLayout.page.marginTop,
      marginRight: customLayout.page.marginRight,
      marginBottom: customLayout.page.marginBottom,
      marginLeft: customLayout.page.marginLeft
    };
    
    return `${evenPages.marginTop}mm ${evenPages.marginRight}mm ${evenPages.marginBottom}mm ${evenPages.marginLeft}mm`;
  }
};

export default getPageMargins;
