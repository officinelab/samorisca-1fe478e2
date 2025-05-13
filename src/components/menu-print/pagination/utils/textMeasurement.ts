
/**
 * Utility per misurare l'altezza effettiva del testo usando Canvas API
 */

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
  isVisible: boolean = true
): number => {
  if (!text || !isVisible) return 0;
  
  return measureTextHeight(text, fontSize, fontFamily, fontWeight, fontStyle);
};

/**
 * Calcola l'altezza totale di un prodotto considerando tutti i suoi elementi
 */
export const calculateProductTotalHeight = (
  product: any,
  language: string,
  customLayout?: any
): number => {
  // Se non siamo in un ambiente browser, usa un'approssimazione
  if (typeof document === 'undefined') {
    return estimateProductHeight(product, language, customLayout);
  }
  
  // Altezza base per l'intestazione del prodotto (titolo + prezzo)
  const titleFontSize = customLayout?.elements?.title?.fontSize || 12;
  const titleFontFamily = customLayout?.elements?.title?.fontFamily || 'Arial';
  const titleFontWeight = customLayout?.elements?.title?.fontStyle === 'bold' ? 'bold' : 'normal';
  
  const titleVisible = customLayout?.elements?.title?.visible !== false;
  const title = product[`title_${language}`] || product.title || '';
  
  let totalHeight = 0;
  
  // Altezza del titolo
  if (titleVisible) {
    totalHeight += measureProductElementHeight(
      title, 
      titleFontSize, 
      titleFontFamily, 
      titleFontWeight, 
      'normal', 
      true
    );
  }
  
  // Altezza della descrizione
  const descriptionFontSize = customLayout?.elements?.description?.fontSize || 10;
  const descriptionFontFamily = customLayout?.elements?.description?.fontFamily || 'Arial';
  const descriptionFontStyle = customLayout?.elements?.description?.fontStyle === 'italic' ? 'italic' : 'normal';
  const descriptionVisible = customLayout?.elements?.description?.visible !== false;
  const description = product[`description_${language}`] || product.description || '';
  
  if (description && descriptionVisible) {
    totalHeight += measureProductElementHeight(
      description, 
      descriptionFontSize, 
      descriptionFontFamily, 
      'normal', 
      descriptionFontStyle, 
      true
    );
    
    // Aggiungi spazio tra il titolo e la descrizione
    totalHeight += 8; // 2mm circa
  }
  
  // Aggiungi altezza per varianti di prezzo
  if (product.has_multiple_prices && customLayout?.elements?.priceVariants?.visible !== false) {
    totalHeight += 20; // Altezza approssimativa per le varianti di prezzo
  }
  
  // Aggiungi altezza per allergeni
  const allergensVisible = customLayout?.elements?.allergensList?.visible !== false;
  if (product.allergens && product.allergens.length > 0 && allergensVisible) {
    totalHeight += 15; // Altezza approssimativa per gli allergeni
  }
  
  // Aggiungi spazio tra i prodotti
  const betweenProductsSpacing = customLayout?.spacing?.betweenProducts || 5;
  totalHeight += betweenProductsSpacing * 3.85; // Conversione da mm a px
  
  return totalHeight;
};

/**
 * Stima l'altezza di un prodotto (usata come fallback)
 */
export const estimateProductHeight = (
  product: any,
  language: string,
  customLayout?: any
): number => {
  // Altezza base aumentata per tutti i prodotti
  let height = 35;
  
  // Incrementa altezza se c'è una descrizione
  const hasDescription = !!product.description || !!product[`description_${language}`];
  if (hasDescription && (!customLayout || customLayout?.elements?.description?.visible !== false)) {
    const descriptionText = (product[`description_${language}`] as string) || product.description || "";
    const descriptionLength = descriptionText.length;
    
    // Stima più precisa dell'altezza della descrizione basata sulla lunghezza del testo
    if (descriptionLength > 200) {
      height += 80; // Per descrizioni molto lunghe
    } else if (descriptionLength > 100) {
      height += 50; // Per descrizioni lunghe
    } else if (descriptionLength > 50) {
      height += 35; // Per descrizioni medie
    } else {
      height += 25; // Per descrizioni brevi
    }
  }
  
  // Aumenta altezza per varianti di prezzo multiple
  if (product.has_multiple_prices && (!customLayout || customLayout?.elements?.priceVariants?.visible !== false)) {
    height += 25;
  }
  
  // Aumenta altezza se il prodotto ha allergeni
  if (product.allergens && product.allergens.length > 0 && 
      (!customLayout || customLayout?.elements?.allergensList?.visible !== false)) {
    height += 15;
  }
  
  // Aggiungi spazio tra i prodotti
  const betweenProductsSpacing = customLayout?.spacing?.betweenProducts || 5;
  height += betweenProductsSpacing * 3.85; // Conversione da mm a px
  
  return height;
};
