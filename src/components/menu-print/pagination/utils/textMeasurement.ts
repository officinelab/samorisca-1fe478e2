
/**
 * Utility per misurare l'altezza effettiva del testo usando Canvas API
 * e tecniche avanzate di calcolo del layout
 */

import { PrintLayout } from "@/types/printLayout";
import { 
  calculateProductHeight, 
  calculateTextHeight, 
  getAvailableWidth,
  clearTextHeightCache
} from "@/hooks/menu-layouts/utils/heightCalculator";

/**
 * Misura l'altezza effettiva di un testo con determinati stili
 * @param text Il testo da misurare
 * @param fontSize Dimensione del font in pt
 * @param fontFamily Famiglia del font
 * @param fontWeight Peso del font (bold, normal)
 * @param fontStyle Stile del font (italic, normal)
 * @param maxWidth Larghezza massima in pixel dopo la quale il testo va a capo
 * @returns Altezza del testo in pixel
 */
export const measureTextHeight = (
  text: string, 
  fontSize: number = 12,
  fontFamily: string = 'Arial',
  fontWeight: string = 'normal',
  fontStyle: string = 'normal',
  maxWidth: number = 800
): number => {
  // Utilizziamo la nuova utility ottimizzata per il calcolo
  const effectiveFontStyle = fontWeight === 'bold' ? 'bold' : (fontStyle === 'italic' ? 'italic' : 'normal');
  return calculateTextHeight(text, fontSize, effectiveFontStyle, maxWidth, fontFamily);
};

/**
 * Misura l'altezza di un elemento del prodotto in base ai suoi contenuti
 */
export const measureProductElementHeight = (
  text: string | null | undefined,
  fontSize: number = 10,
  fontFamily: string = 'Arial',
  fontWeight: string = 'normal',
  fontStyle: string = 'normal',
  isVisible: boolean = true,
  maxWidth: number = 800
): number => {
  if (!text || !isVisible) return 0;
  
  return measureTextHeight(text, fontSize, fontFamily, fontWeight, fontStyle, maxWidth);
};

/**
 * Calcola l'altezza totale di un prodotto considerando tutti i suoi elementi
 * Utilizza l'utility avanzata di calcolo altezza
 */
export const calculateProductTotalHeight = (
  product: any,
  language: string,
  customLayout?: PrintLayout | null
): number => {
  // Utilizziamo la nuova utility per un calcolo più preciso
  return calculateProductHeight(product, language, customLayout);
};

/**
 * Stima l'altezza di un prodotto (usata come fallback)
 * NOTA: Questa funzione viene mantenuta per compatibilità, ma ora
 * utilizza la nuova utility più precisa
 */
export const estimateProductHeight = (
  product: any,
  language: string,
  customLayout?: PrintLayout | null
): number => {
  // Ricadiamo sulla funzione di calcolo avanzata
  return calculateProductHeight(product, language, customLayout);
};

/**
 * Funzione per liberare la cache delle misurazioni quando non più necessarie
 * Da chiamare ad esempio dopo il completamento della stampa
 */
export const resetMeasurementCache = (): void => {
  clearTextHeightCache();
};
