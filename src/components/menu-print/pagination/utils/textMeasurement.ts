
/**
 * Utility per misurare l'altezza effettiva del testo usando Canvas API
 * e tecniche avanzate di calcolo del layout
 */

import { PrintLayout } from "@/types/printLayout";
import { calculateProductHeight, calculateTextHeight, getAvailableWidth } from "@/hooks/menu-layouts/utils/heightCalculator";

// Singleton canvas per le misurazioni del testo
let measureCanvas: HTMLCanvasElement | null = null;
let measureContext: CanvasRenderingContext2D | null = null;

/**
 * Inizializza il canvas per le misurazioni se non è già stato creato
 */
const initMeasureCanvas = (): CanvasRenderingContext2D => {
  if (!measureCanvas) {
    // Crea un canvas off-screen per le misurazioni
    measureCanvas = document.createElement('canvas');
    measureCanvas.width = 1000; // Larghezza sufficiente per la maggior parte dei testi
    measureCanvas.height = 100; // Altezza iniziale
    
    measureContext = measureCanvas.getContext('2d');
    
    if (!measureContext) {
      throw new Error('Impossibile ottenere il contesto 2D del canvas');
    }
  }
  
  return measureContext;
};

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
  try {
    // Se non siamo in un ambiente browser, restituisci una stima
    if (typeof document === 'undefined') {
      // Stima basata sulla dimensione del font e lunghezza del testo
      const baseHeight = fontSize * 1.5;
      const lines = Math.ceil(text.length / 50) || 1; // Stima approssimativa delle linee
      return baseHeight * lines;
    }
    
    const ctx = initMeasureCanvas();
    
    // Imposta gli stili del font
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}pt ${fontFamily}`;
    
    // Calcolo del numero di righe necessarie per il testo
    const words = text.split(' ');
    let line = '';
    let lineCount = 1;
    const lineHeight = fontSize * 1.5; // Fattore di line-height comune
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        line = words[i] + ' ';
        lineCount++;
      } else {
        line = testLine;
      }
    }
    
    // Aggiungi un po' di padding per sicurezza
    return lineCount * lineHeight + (fontSize * 0.3);
  } catch (error) {
    console.error('Errore durante la misurazione del testo:', error);
    // Fallback se qualcosa va storto
    return fontSize * 1.5;
  }
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
