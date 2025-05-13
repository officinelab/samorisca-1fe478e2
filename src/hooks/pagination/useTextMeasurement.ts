
import { MM_TO_PX } from '@/hooks/menu-layouts/constants';
import { PrintLayout } from '@/types/printLayout';

/**
 * Utility per misurare con precisione le dimensioni del testo usando Canvas API
 */

/**
 * Calcola l'altezza effettiva di un testo con multilinea basata sulla larghezza disponibile
 * 
 * @param text - Il testo da misurare
 * @param font - La descrizione del font (es. "14px Arial")
 * @param maxWidth - Larghezza massima disponibile in pixel
 * @param lineHeight - Altezza della linea (moltiplicatore, es. 1.5)
 */
export function measureTextHeight(
  text: string | null | undefined, 
  font: string, 
  maxWidth: number, 
  lineHeight: number = 1.2
): number {
  if (!text) return 0;
  
  // In ambiente SSR (Server-Side Rendering) restituisci una stima
  if (typeof document === 'undefined') {
    const averageCharsPerLine = 80;
    const lines = Math.ceil(text.length / averageCharsPerLine) || 1;
    const fontSize = parseInt(font.split('px')[0], 10) || 16;
    return Math.max(fontSize * lineHeight * lines, 20);
  }
  
  // Creiamo un canvas per misurare il testo
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    // Fallback se il canvas non è supportato
    const averageCharsPerLine = 80;
    const lines = Math.ceil(text.length / averageCharsPerLine) || 1;
    const fontSize = parseInt(font.split('px')[0], 10) || 16;
    return Math.max(fontSize * lineHeight * lines, 20);
  }
  
  // Impostiamo il font
  context.font = font;
  
  // Dividiamo il testo in parole
  const words = text.split(' ');
  const fontSize = parseInt(font.split('px')[0], 10) || 16;
  
  let line = '';
  let lines = 1;
  
  // Simuliamo il wrapping del testo
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && i > 0) {
      line = words[i] + ' ';
      lines++;
    } else {
      line = testLine;
    }
  }
  
  // Calcola l'altezza totale basata sul numero di linee
  return Math.ceil(fontSize * lineHeight * lines);
}

/**
 * Stima l'altezza di un titolo di categoria basata sul layout
 */
export function estimateCategoryTitleHeight(
  category: { title: string; [key: string]: any },
  language: string,
  customLayout?: PrintLayout | null
): number {
  // Estrai il titolo dalla categoria in base alla lingua
  const title = category[`title_${language}`] || category.title;
  
  if (!title) return 30; // Altezza minima
  
  // Prepara le proprietà del font basate sul layout
  const fontFamily = customLayout?.elements.category.fontFamily || 'Arial';
  const fontSize = customLayout?.elements.category.fontSize || 18;
  const fontStyle = customLayout?.elements.category.fontStyle || 'normal';
  const fontWeight = fontStyle === 'bold' ? 'bold' : 'normal';
  const fontStyleItalic = fontStyle === 'italic' ? 'italic' : 'normal';
  
  // Costruisci la stringa del font
  const fontString = `${fontWeight} ${fontStyleItalic} ${fontSize}pt ${fontFamily}`;
  
  // Calcola la larghezza disponibile in pixel (da mm a px)
  const availableWidth = customLayout 
    ? (210 - customLayout.page.marginLeft - customLayout.page.marginRight) * MM_TO_PX 
    : 170 * MM_TO_PX;
  
  // Misura l'altezza del testo
  const textHeight = measureTextHeight(title, fontString, availableWidth);
  
  // Aggiungi margini e spaziatura
  const topMargin = customLayout?.elements.category.margin.top || 5;
  const bottomMargin = customLayout?.elements.category.margin.bottom || 5;
  const spacing = customLayout?.spacing.categoryTitleBottomMargin || 10;
  
  return textHeight + (topMargin + bottomMargin + spacing) * MM_TO_PX;
}

/**
 * Stima l'altezza di un prodotto basata sul layout
 */
export function estimateProductHeight(
  product: { title: string; description?: string; price?: number | string; allergens?: any[]; [key: string]: any },
  language: string,
  customLayout?: PrintLayout | null
): number {
  // Estrai i dati del prodotto in base alla lingua
  const title = product[`title_${language}`] || product.title || '';
  const description = product[`description_${language}`] || product.description || '';
  const price = typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '';
  const hasAllergens = product.allergens && product.allergens.length > 0;
  
  // Imposta le proprietà dei font basate sul layout
  const titleFamily = customLayout?.elements.title.fontFamily || 'Arial';
  const titleSize = customLayout?.elements.title.fontSize || 16;
  const titleStyle = customLayout?.elements.title.fontStyle || 'bold';
  
  const descFamily = customLayout?.elements.description.fontFamily || 'Arial';
  const descSize = customLayout?.elements.description.fontSize || 14;
  const descStyle = customLayout?.elements.description.fontStyle || 'normal';
  
  const priceFamily = customLayout?.elements.price.fontFamily || 'Arial';
  const priceSize = customLayout?.elements.price.fontSize || 14;
  const priceStyle = customLayout?.elements.price.fontStyle || 'normal';
  
  // Costruisci le stringhe dei font
  const titleFont = `${titleStyle === 'bold' ? 'bold' : 'normal'} ${titleStyle === 'italic' ? 'italic' : 'normal'} ${titleSize}pt ${titleFamily}`;
  const descFont = `${descStyle === 'bold' ? 'bold' : 'normal'} ${descStyle === 'italic' ? 'italic' : 'normal'} ${descSize}pt ${descFamily}`;
  const priceFont = `${priceStyle === 'bold' ? 'bold' : 'normal'} ${priceStyle === 'italic' ? 'italic' : 'normal'} ${priceSize}pt ${priceFamily}`;
  
  // Calcola la larghezza disponibile in pixel (da mm a px)
  const availableWidth = customLayout 
    ? (210 - customLayout.page.marginLeft - customLayout.page.marginRight) * MM_TO_PX 
    : 170 * MM_TO_PX;
  
  // Misura l'altezza di ciascun elemento
  const titleHeight = measureTextHeight(title, titleFont, availableWidth);
  const descHeight = description ? measureTextHeight(description, descFont, availableWidth - 20) : 0;
  const priceHeight = price ? measureTextHeight(price.toString(), priceFont, availableWidth) : 0;
  
  // Aggiungi margini e spaziatura
  const titleMarginTop = customLayout?.elements.title.margin.top || 5;
  const titleMarginBottom = customLayout?.elements.title.margin.bottom || 5;
  const descMarginTop = customLayout?.elements.description.margin.top || 2;
  const descMarginBottom = customLayout?.elements.description.margin.bottom || 2;
  const priceMarginTop = customLayout?.elements.price.margin.top || 2;
  const priceMarginBottom = customLayout?.elements.price.margin.bottom || 2;
  
  // Spazio per allergeni se presenti
  const allergensSpace = hasAllergens ? 24 : 0;
  
  // Spazio tra prodotti
  const spacingBetweenProducts = customLayout?.spacing.betweenProducts || 5;
  
  // Calcola l'altezza totale
  return titleHeight + (titleMarginTop + titleMarginBottom) * MM_TO_PX +
         (description ? descHeight + (descMarginTop + descMarginBottom) * MM_TO_PX : 0) +
         (price ? priceHeight + (priceMarginTop + priceMarginBottom) * MM_TO_PX : 0) +
         allergensSpace +
         spacingBetweenProducts * MM_TO_PX;
}
