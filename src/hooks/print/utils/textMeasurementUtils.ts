
/**
 * Utility per misurare dinamicamente il testo usando l'API Canvas
 */

// Fattore di conversione da mm a px
const MM_TO_PX = 3.78;

/**
 * Cache per evitare di ricreare il canvas troppe volte
 */
let canvasContext: CanvasRenderingContext2D | null = null;

/**
 * Ottiene il contesto del canvas per la misurazione del testo
 */
const getCanvasContext = (): CanvasRenderingContext2D => {
  if (!canvasContext) {
    const canvas = document.createElement('canvas');
    canvasContext = canvas.getContext('2d');
    
    if (!canvasContext) {
      throw new Error('Impossibile creare il contesto del canvas');
    }
  }
  
  return canvasContext;
};

/**
 * Misura l'altezza effettiva di un testo basata sul font, dimensione e larghezza disponibile
 */
export const measureTextHeight = (
  text: string, 
  fontFamily: string, 
  fontSize: number, 
  availableWidthMm: number,
  isBold: boolean = false,
  isItalic: boolean = false
): number => {
  if (!text || text.trim() === '') {
    return 0;
  }
  
  try {
    const context = getCanvasContext();
    
    // Converti availableWidthMm in pixel
    const availableWidthPx = availableWidthMm * MM_TO_PX;
    
    // Imposta lo stile del font
    const fontStyle = `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${fontSize}pt ${fontFamily}`;
    context.font = fontStyle;
    
    // Altezza approssimativa della riga basata sulla dimensione del font (pt to px)
    const lineHeight = fontSize * 1.33; // Fattore di conversione approssimativo da pt a px
    
    // Dividi il testo in parole
    const words = text.split(' ');
    let currentLine = '';
    let numLines = 1;
    
    // Processa ogni parola
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = context.measureText(testLine);
      
      // Se la linea corrente più la nuova parola supera la larghezza disponibile
      if (metrics.width > availableWidthPx && currentLine !== '') {
        numLines++;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    // Calcola l'altezza totale del testo in pixel
    const totalHeightPx = numLines * lineHeight * 1.2; // Aggiunge un margine di sicurezza
    
    // Converti l'altezza da pixel a mm per compatibilità con il resto del codice
    const totalHeightMm = totalHeightPx / MM_TO_PX;
    
    return totalHeightMm;
  } catch (error) {
    console.error('Errore nella misurazione del testo:', error);
    
    // Fallback: stima basata sul numero di caratteri
    return estimateHeightByCharCount(text, fontSize);
  }
};

/**
 * Stima l'altezza del testo basata sul numero di caratteri (fallback)
 */
const estimateHeightByCharCount = (text: string, fontSize: number): number => {
  const charsPerLine = 80; // Valore approssimativo
  const lineHeight = fontSize * 1.33 / MM_TO_PX;
  
  const numLines = Math.ceil(text.length / charsPerLine);
  return numLines * lineHeight * 1.2;
};
