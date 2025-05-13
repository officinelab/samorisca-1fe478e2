
import { useMemo, useRef, useEffect } from 'react';
import { PrintLayout } from '@/types/printLayout';

// Fattore di conversione da mm a pixel (approssimativo per schermi standard)
const MM_TO_PX = 3.78;

export const useTextMeasurement = () => {
  // Riferimento al canvas per la misurazione del testo
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Crea un canvas al caricamento del componente
  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    
    return () => {
      canvasRef.current = null;
    };
  }, []);
  
  // Configura il contesto del canvas con lo stile di testo desiderato
  const getContext = (
    fontFamily: string,
    fontSize: number,
    fontStyle: string
  ): CanvasRenderingContext2D | null => {
    if (!canvasRef.current) return null;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return null;
    
    // Imposta il font in base ai parametri forniti
    const fontWeight = fontStyle === 'bold' ? 'bold' : 'normal';
    const fontStyleText = fontStyle === 'italic' ? 'italic' : 'normal';
    context.font = `${fontWeight} ${fontStyleText} ${fontSize}pt ${fontFamily}`;
    
    return context;
  };
  
  // Calcola l'altezza del testo in base ai parametri specificati
  const measureTextHeight = (
    text: string,
    maxWidth: number,
    fontFamily: string, 
    fontSize: number,
    fontStyle: string,
    lineHeight: number = 1.2
  ): number => {
    const context = getContext(fontFamily, fontSize, fontStyle);
    if (!context || !text) return 0;
    
    // Converti la dimensione del font da pt a px (approssimativo)
    const fontSizePx = fontSize * 1.33;
    
    // Applica il line-height
    const computedLineHeight = fontSizePx * lineHeight;
    
    // Dividi il testo in parole
    const words = text.split(' ');
    let line = '';
    let lineCount = 1;
    
    // Calcola quante righe occupa il testo
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && i > 0) {
        line = words[i] + ' ';
        lineCount++;
      } else {
        line = testLine;
      }
    }
    
    // Restituisci l'altezza totale considerando il line-height
    return computedLineHeight * lineCount;
  };
  
  // Stima l'altezza di un elemento di categoria
  const estimateCategoryHeight = (
    title: string, 
    customLayout?: PrintLayout | null
  ): number => {
    if (!customLayout) return 30;
    
    // Recupera le impostazioni del layout per la categoria
    const element = customLayout.elements.category;
    const fontFamily = element.fontFamily || 'Arial';
    const fontSize = element.fontSize || 18;
    const fontStyle = element.fontStyle || 'bold';
    
    // Calcola la larghezza disponibile, tenendo conto dei margini
    const marginLeft = element.margin?.left || 0;
    const marginRight = element.margin?.right || 0;
    const availableWidth = 210 - 30 - marginLeft - marginRight; // A4 width - default margins - element margins
    
    // Misura l'altezza effettiva del titolo
    const textHeight = measureTextHeight(
      title, 
      availableWidth * MM_TO_PX, 
      fontFamily, 
      fontSize, 
      fontStyle
    );
    
    // Aggiungi margini superiore e inferiore e converti in mm
    const marginTop = element.margin?.top || 0;
    const marginBottom = element.margin?.bottom || 0;
    const categoryBottomSpacing = customLayout.spacing.categoryTitleBottomMargin || 5;
    
    // Calcola l'altezza totale in pixel, poi converti in mm per coerenza
    const totalHeightPx = textHeight + ((marginTop + marginBottom + categoryBottomSpacing) * MM_TO_PX);
    
    return totalHeightPx;
  };
  
  // Stima l'altezza di un intero prodotto (titolo, descrizione, prezzo, varianti)
  const estimateProductHeight = (
    product: any, 
    language: string, 
    customLayout?: PrintLayout | null
  ): number => {
    if (!product) return 0;
    if (!customLayout) return 60; // Altezza di default se non c'è il layout
    
    let totalHeight = 0;
    const availableWidth = 210 - 30; // A4 width - default margins
    
    // Titolo prodotto
    if (customLayout.elements.title.visible !== false) {
      const titleText = product[`title_${language}`] || product.title || '';
      const titleConfig = customLayout.elements.title;
      
      totalHeight += measureTextHeight(
        titleText,
        (availableWidth - titleConfig.margin.left - titleConfig.margin.right) * MM_TO_PX,
        titleConfig.fontFamily,
        titleConfig.fontSize,
        titleConfig.fontStyle
      );
      
      totalHeight += (titleConfig.margin.top + titleConfig.margin.bottom) * MM_TO_PX;
    }
    
    // Descrizione prodotto
    const descriptionText = product[`description_${language}`] || product.description || '';
    if (customLayout.elements.description.visible !== false && descriptionText) {
      const descConfig = customLayout.elements.description;
      
      totalHeight += measureTextHeight(
        descriptionText,
        (availableWidth - descConfig.margin.left - descConfig.margin.right) * MM_TO_PX,
        descConfig.fontFamily,
        descConfig.fontSize,
        descConfig.fontStyle,
        1.5 // Line-height maggiore per la descrizione
      );
      
      totalHeight += (descConfig.margin.top + descConfig.margin.bottom) * MM_TO_PX;
    }
    
    // Spazio per prezzo e allergeni (considerati in una riga)
    if (customLayout.elements.price.visible !== false) {
      const priceConfig = customLayout.elements.price;
      totalHeight += (priceConfig.fontSize * 1.33) + (priceConfig.margin.top + priceConfig.margin.bottom) * MM_TO_PX;
    }
    
    // Varianti di prezzo (se presenti)
    if (customLayout.elements.priceVariants.visible !== false && product.has_multiple_prices) {
      const variantsConfig = customLayout.elements.priceVariants;
      totalHeight += (variantsConfig.fontSize * 1.33) + (variantsConfig.margin.top + variantsConfig.margin.bottom) * MM_TO_PX;
    }
    
    // Spaziatura tra prodotti
    totalHeight += customLayout.spacing.betweenProducts * MM_TO_PX;
    
    // Aggiungi un margine di sicurezza (10%)
    totalHeight *= 1.1;
    
    return totalHeight;
  };
  
  // Calcola l'altezza disponibile per il contenuto, tenendo conto dei margini
  const calculateAvailableHeight = (
    pageIndex: number,
    A4_HEIGHT_MM: number,
    customLayout?: PrintLayout | null
  ): number => {
    let marginTop = 20;
    let marginBottom = 20;
    
    // Applica i margini personalizzati se disponibili
    if (customLayout) {
      if (customLayout.page.useDistinctMarginsForPages) {
        // Pagine dispari (0, 2, 4...) corrispondono alle pagine 1, 3, 5...
        if (pageIndex % 2 === 0) {
          marginTop = customLayout.page.oddPages?.marginTop || customLayout.page.marginTop;
          marginBottom = customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom;
        } 
        // Pagine pari (1, 3, 5...) corrispondono alle pagine 2, 4, 6...
        else {
          marginTop = customLayout.page.evenPages?.marginTop || customLayout.page.marginTop;
          marginBottom = customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom;
        }
      } else {
        marginTop = customLayout.page.marginTop;
        marginBottom = customLayout.page.marginBottom;
      }
    }
    
    // Sottrai i margini e un piccolo margine di sicurezza addizionale (5mm)
    const safetyMargin = 5;
    const availableHeightMM = A4_HEIGHT_MM - marginTop - marginBottom - safetyMargin;
    
    // Converte in pixel per i calcoli di misurazione
    return availableHeightMM * MM_TO_PX;
  };
  
  // Visualizza il margine di sicurezza (utile per debug)
  const getSafetyMarginStyle = (customLayout?: PrintLayout | null) => {
    const safetyMarginMM = 5; // 5mm di margine di sicurezza
    
    return {
      position: 'absolute' as React.CSSProperties['position'],
      bottom: `${safetyMarginMM}mm`,
      left: 0,
      right: 0,
      height: '1mm',
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      zIndex: 999,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '8px',
      color: 'red',
    };
  };
  
  return {
    estimateCategoryHeight,
    estimateProductHeight,
    calculateAvailableHeight,
    getSafetyMarginStyle,
  };
};
