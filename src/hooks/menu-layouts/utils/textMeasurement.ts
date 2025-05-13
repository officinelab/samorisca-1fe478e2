
/**
 * Utility per misurare accuratamente le dimensioni del testo utilizzando l'API Canvas
 */

// Singleton canvas per il rendering del testo
let measureCanvas: HTMLCanvasElement | null = null;
let measureContext: CanvasRenderingContext2D | null = null;

// Inizializza il canvas per la misurazione
const getCanvasContext = (): CanvasRenderingContext2D => {
  if (!measureCanvas) {
    // Crea un canvas se non esiste già
    measureCanvas = document.createElement('canvas');
    measureContext = measureCanvas.getContext('2d');
    
    if (!measureContext) {
      throw new Error('Impossibile ottenere il contesto 2D del canvas');
    }
  }
  
  return measureContext;
};

// Configura il contesto con lo stile del testo desiderato
const configureContext = (
  ctx: CanvasRenderingContext2D, 
  fontFamily: string = 'Arial', 
  fontSize: number = 12,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal'
): void => {
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}pt ${fontFamily}`;
};

/**
 * Calcola l'altezza stimata di un testo considerando la larghezza massima
 * @param text Il testo da misurare
 * @param maxWidth La larghezza massima in pixel
 * @param fontFamily Famiglia di font
 * @param fontSize Dimensione del font in pt
 * @param fontWeight Peso del font ('normal', 'bold')
 * @param fontStyle Stile del font ('normal', 'italic')
 * @param lineHeight Altezza di riga (moltiplicatore)
 * @returns Altezza stimata in pixel
 */
export const measureTextHeight = (
  text: string,
  maxWidth: number,
  fontFamily: string = 'Arial',
  fontSize: number = 12,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal',
  lineHeight: number = 1.2
): number => {
  if (!text || text.trim() === '') {
    return 0;
  }
  
  try {
    const ctx = getCanvasContext();
    configureContext(ctx, fontFamily, fontSize, fontWeight, fontStyle);
    
    // Conversione da pt a px per il calcolo dell'altezza di una singola riga
    const fontSizePx = Math.ceil(fontSize * 1.333);
    const singleLineHeight = fontSizePx * lineHeight;
    
    // Dividi il testo in parole
    const words = text.split(' ');
    let currentLine = '';
    let lines = 1;
    
    // Calcola il numero di righe necessarie
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
      const { width } = ctx.measureText(testLine);
      
      if (width > maxWidth && currentLine !== '') {
        currentLine = words[i];
        lines++;
      } else {
        currentLine = testLine;
      }
    }
    
    // Calcola l'altezza totale
    return Math.ceil(lines * singleLineHeight);
  } catch (error) {
    console.error('Errore nella misurazione del testo:', error);
    // Fallback a una stima approssimativa in caso di errore
    return text.length / 4; // Stima molto approssimativa
  }
};

/**
 * Misura le dimensioni di un prodotto del menu in modo accurato
 */
export const measureProductHeight = (
  product: any,
  language: string,
  maxWidth: number = 500, // Larghezza massima in pixel
  customFontSettings?: {
    titleFont?: { family: string, size: number, weight: string, style: string },
    descriptionFont?: { family: string, size: number, weight: string, style: string }
  }
): number => {
  const titleSettings = customFontSettings?.titleFont || { 
    family: 'Arial', 
    size: 12, 
    weight: 'bold', 
    style: 'normal' 
  };
  
  const descSettings = customFontSettings?.descriptionFont || { 
    family: 'Arial', 
    size: 10, 
    weight: 'normal', 
    style: 'italic' 
  };

  // Margine di base per ogni prodotto (intestazione, prezzo, ecc.)
  let totalHeight = 25; // Altezza base per titolo e prezzo
  
  // Misura il titolo
  const title = (product[`title_${language}`] as string) || product.title || '';
  const titleHeight = measureTextHeight(
    title, 
    maxWidth * 0.6, // Il titolo occupa circa il 60% della larghezza
    titleSettings.family,
    titleSettings.size,
    titleSettings.weight,
    titleSettings.style,
    1.2
  );
  totalHeight += titleHeight > 0 ? titleHeight : 0;
  
  // Misura la descrizione se presente
  const description = (product[`description_${language}`] as string) || product.description || '';
  if (description) {
    const descHeight = measureTextHeight(
      description, 
      maxWidth * 0.95, // La descrizione può occupare fino al 95% della larghezza
      descSettings.family,
      descSettings.size,
      descSettings.weight,
      descSettings.style,
      1.3
    );
    totalHeight += descHeight > 0 ? descHeight + 8 : 0; // Aggiungi spazio tra titolo e descrizione
  }
  
  // Spazio per varianti di prezzo se presenti
  if (product.has_multiple_prices) {
    totalHeight += 20;
  }
  
  // Spazio per gli allergeni se presenti
  if (product.allergens && product.allergens.length > 0) {
    totalHeight += 15;
  }
  
  // Spazio per margine inferiore del prodotto
  totalHeight += 10;
  
  return totalHeight;
};
