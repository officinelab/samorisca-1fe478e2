
/**
 * Utility per misurare le dimensioni del testo usando Canvas API
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
  
  // Creiamo un canvas per misurare il testo
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 0; // Fallback se il canvas non è supportato
  
  // Impostiamo il font
  context.font = font;
  
  // Dividiamo il testo in parole
  const words = text.split(' ');
  const fontSize = parseInt(font.split('px')[0], 10);
  
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
 * Stima l'altezza di un elemento prodotto basata sul contenuto di testo
 */
export function estimateProductHeight(
  title: string | null | undefined,
  description: string | null | undefined,
  price: string | null | undefined,
  availableWidth: number,
  titleFont: string = '16px Arial',
  descriptionFont: string = '14px Arial',
  priceFont: string = '14px Arial',
  spacing: number = 8, // Spaziatura tra gli elementi in pixel
  hasAllergens: boolean = false
): number {
  // Misura l'altezza del titolo
  const titleHeight = measureTextHeight(title, titleFont, availableWidth);
  
  // Misura l'altezza della descrizione
  const descriptionHeight = description ? 
    measureTextHeight(description, descriptionFont, availableWidth) : 0;
  
  // Misura l'altezza del prezzo
  const priceHeight = price ? 
    measureTextHeight(price, priceFont, availableWidth) : 0;
  
  // Aggiungi spazio extra per allergeni se presenti
  const allergensSpace = hasAllergens ? 24 : 0;
  
  // Calcola l'altezza totale con spaziatura
  const totalHeight = titleHeight + 
                      (description ? spacing + descriptionHeight : 0) + 
                      (price ? spacing + priceHeight : 0) +
                      allergensSpace;
  
  // Aggiungi un minimo per sicurezza
  return Math.max(totalHeight, 40);
}

/**
 * Stima l'altezza di un titolo di categoria
 */
export function estimateCategoryTitleHeight(
  title: string | null | undefined,
  availableWidth: number,
  titleFont: string = '18px Arial bold',
  minHeight: number = 30
): number {
  if (!title) return minHeight;
  
  const titleHeight = measureTextHeight(title, titleFont, availableWidth);
  return Math.max(titleHeight + 10, minHeight); // Aggiungi un po' di padding
}

// Costante per convertire mm a pixel (96 dpi ~ 3.78 pixel per mm)
export const MM_TO_PX = 3.78;

