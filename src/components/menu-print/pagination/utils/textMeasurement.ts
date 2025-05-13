
/**
 * Utility per misurare l'altezza effettiva del testo usando Canvas API
 * e tecniche avanzate di calcolo del layout
 */

import { PrintLayout } from "@/types/printLayout";
import { calculateProductHeight } from "@/hooks/menu-layouts/utils/heightCalculator";

// Cache per i risultati del calcolo dell'altezza del testo
const textHeightCache = new Map<string, number>();

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
  // Crea una chiave unica per questo testo e le sue proprietà
  const cacheKey = `${text}|${fontSize}|${fontFamily}|${fontWeight}|${fontStyle}|${maxWidth}`;
  
  // Verifica se il risultato è già in cache
  if (textHeightCache.has(cacheKey)) {
    return textHeightCache.get(cacheKey)!;
  }
  
  // Crea un canvas per misurare il testo
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    console.error("Impossibile creare il contesto Canvas per misurare il testo");
    return fontSize * 1.2; // Fallback
  }
  
  // Imposta il font nel contesto
  const fontStyleStr = fontStyle === 'italic' ? 'italic' : '';
  const fontWeightStr = fontWeight === 'bold' ? 'bold' : '';
  context.font = `${fontStyleStr} ${fontWeightStr} ${fontSize}px ${fontFamily}`;
  
  // Misura l'altezza di una riga di testo
  const lineHeight = fontSize * 1.2;
  
  // Divide il testo in righe in base alla larghezza massima
  const words = text.split(' ');
  let line = '';
  let totalHeight = 0;
  let currentLineCount = 1;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && i > 0) {
      // Una nuova riga è necessaria
      line = words[i] + ' ';
      currentLineCount++;
    } else {
      line = testLine;
    }
  }
  
  totalHeight = lineHeight * currentLineCount;
  
  // Memorizza il risultato in cache
  textHeightCache.set(cacheKey, totalHeight);
  
  return totalHeight;
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
  // Utilizziamo la funzione di calcolo precisa
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
  textHeightCache.clear();
};
