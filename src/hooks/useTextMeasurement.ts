
import { useRef, useEffect, useState } from 'react';
import { PrintLayout } from '@/types/printLayout';

/**
 * Hook per misurare con precisione le dimensioni del testo utilizzando l'API Canvas
 */
export const useTextMeasurement = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    // Crea un elemento canvas se non esiste già
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
  }, []);
  
  /**
   * Misura l'altezza effettiva di un testo in base ai parametri di stile
   */
  const measureTextHeight = (
    text: string, 
    fontFamily: string, 
    fontSize: number, 
    maxWidth: number,
    lineHeight: number = 1.2, // Valore predefinito per il line-height
    fontWeight: 'normal' | 'bold' = 'normal',
    fontStyle: 'normal' | 'italic' = 'normal'
  ): number => {
    if (!text || !canvasRef.current) return 0;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return 0;
    
    // Imposta lo stile del font sul contesto del canvas
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    
    // Dividi il testo per andare a capo quando raggiungi la larghezza massima
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const { width } = ctx.measureText(testLine);
      
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    // Aggiungi l'ultima riga se presente
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Calcola l'altezza totale in base al numero di righe e line-height
    const singleLineHeight = fontSize;
    const totalHeight = lines.length * singleLineHeight * lineHeight;
    
    return totalHeight;
  };
  
  /**
   * Stima l'altezza di un prodotto in base alle sue caratteristiche e al layout
   */
  const estimateProductHeight = (
    product: any, 
    language: string,
    layout: PrintLayout | null,
    availableWidth: number
  ): number => {
    if (!product || !layout) return 30; // Altezza minima predefinita
    
    let totalHeight = 0;
    const elements = layout.elements;
    
    // Controlla se l'elemento è visibile, se non specificato considera visibile
    const isTitleVisible = elements.title.visible !== false;
    const isDescriptionVisible = elements.description.visible !== false;
    const isPriceVisible = elements.price.visible !== false;
    const isAllergensVisible = elements.allergensList.visible !== false;
    const isPriceVariantsVisible = elements.priceVariants.visible !== false;
    
    // Calcola lo spazio necessario per il titolo e il prezzo sulla stessa riga
    if (isTitleVisible || isPriceVisible) {
      const title = (product[`title_${language}`] || product.title || '');
      const titleWidth = availableWidth * 0.7; // Assegna circa il 70% della larghezza al titolo
      
      const titleHeight = isTitleVisible ? measureTextHeight(
        title,
        elements.title.fontFamily || 'Arial',
        elements.title.fontSize,
        titleWidth,
        1.2,
        elements.title.fontStyle === 'bold' ? 'bold' : 'normal',
        elements.title.fontStyle === 'italic' ? 'italic' : 'normal'
      ) : 0;
      
      // Aggiungiamo un margine di 4mm convertito in pixel
      totalHeight += titleHeight + 15.12; // 4mm * 3.78px/mm
    }
    
    // Calcola lo spazio necessario per la descrizione
    if (isDescriptionVisible) {
      const description = (product[`description_${language}`] || product.description || '');
      if (description) {
        const descHeight = measureTextHeight(
          description,
          elements.description.fontFamily || 'Arial',
          elements.description.fontSize,
          availableWidth * 0.95, // Usa il 95% della larghezza disponibile
          1.2,
          elements.description.fontStyle === 'bold' ? 'bold' : 'normal',
          elements.description.fontStyle === 'italic' ? 'italic' : 'normal'
        );
        
        // Aggiungi margine sopra la descrizione (2mm)
        totalHeight += descHeight + 7.56; // 2mm * 3.78px/mm
      }
    }
    
    // Calcola lo spazio necessario per gli allergeni
    if (isAllergensVisible && product.allergens && product.allergens.length > 0) {
      totalHeight += 18.9; // Circa 5mm per gli allergeni
    }
    
    // Calcola lo spazio necessario per varianti di prezzo
    if (isPriceVariantsVisible && product.has_multiple_prices) {
      totalHeight += 22.68; // Circa 6mm per le varianti di prezzo
    }
    
    // Aggiungiamo un margine di sicurezza sotto il prodotto (layout.spacing.betweenProducts)
    const spacingBetweenProducts = layout.spacing.betweenProducts || 5; // Default 5mm se non specificato
    totalHeight += spacingBetweenProducts * 3.78;
    
    return totalHeight;
  };
  
  /**
   * Stima l'altezza di un titolo categoria in base al layout
   */
  const estimateCategoryTitleHeight = (layout: PrintLayout | null): number => {
    if (!layout) return 30; // Altezza predefinita
    
    // Calcola l'altezza in base alla configurazione
    const fontSize = layout.elements.category.fontSize || 14;
    const fontStyle = layout.elements.category.fontStyle || 'normal';
    const marginTop = layout.elements.category.margin?.top || 0;
    const marginBottom = layout.spacing.categoryTitleBottomMargin || 10;
    
    // Usiamo un fattore di scala in base al fontStyle (bold richiede più spazio)
    const styleMultiplier = fontStyle === 'bold' ? 1.2 : 1;
    
    // Calcola l'altezza totale del titolo della categoria (px)
    const titleHeight = fontSize * 1.2 * styleMultiplier;
    const margins = (marginTop + marginBottom) * 3.78; // Converti mm in px
    
    return titleHeight + margins;
  };
  
  return {
    measureTextHeight,
    estimateProductHeight,
    estimateCategoryTitleHeight
  };
};
