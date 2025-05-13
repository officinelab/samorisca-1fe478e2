
import { PrintLayout } from "@/types/printLayout";
import { Product, Category } from "@/types/database";
import { PRINT_CONSTANTS } from "../constants";

// Cache per memorizzare i risultati dei calcoli di altezza del testo
// Chiave: testo + fontSize + fontStyle + availableWidth
type TextHeightCacheKey = string;
const textHeightCache = new Map<TextHeightCacheKey, number>();

// Singleton canvas per le misurazioni (migliora le prestazioni evitando di creare nuovi canvas)
let measureCanvas: HTMLCanvasElement | null = null;
let measureContext: CanvasRenderingContext2D | null = null;

/**
 * Converte i millimetri in pixel per la visualizzazione su schermo
 */
export const mmToPx = (mm: number): number => {
  return mm * PRINT_CONSTANTS.MM_TO_PX;
};

/**
 * Inizializza il canvas per le misurazioni se non è già stato creato
 */
const initMeasureCanvas = (): CanvasRenderingContext2D | null => {
  if (typeof document === 'undefined') return null;
  
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas');
    measureCanvas.width = 1000;
    measureCanvas.height = 100;
    
    measureContext = measureCanvas.getContext('2d');
  }
  
  return measureContext;
};

/**
 * Calcola la larghezza disponibile per il testo considerando i margini laterali
 * @param layout Layout di stampa
 * @param pageIndex Indice della pagina (per margini diversi tra pagine pari/dispari)
 * @returns Larghezza disponibile in pixel
 */
export const getAvailableWidth = (layout: PrintLayout | null | undefined, pageIndex: number = 0): number => {
  if (!layout) {
    return PRINT_CONSTANTS.A4_WIDTH_MM * PRINT_CONSTANTS.MM_TO_PX - 
           (PRINT_CONSTANTS.DEFAULT_MARGINS.LEFT + PRINT_CONSTANTS.DEFAULT_MARGINS.RIGHT) * PRINT_CONSTANTS.MM_TO_PX;
  }
  
  let leftMargin, rightMargin;
  
  if (layout.page.useDistinctMarginsForPages) {
    if (pageIndex % 2 === 0) { // Pagina dispari (indice 0, 2, 4...)
      leftMargin = layout.page.oddPages?.marginLeft || layout.page.marginLeft;
      rightMargin = layout.page.oddPages?.marginRight || layout.page.marginRight;
    } else { // Pagina pari (indice 1, 3, 5...)
      leftMargin = layout.page.evenPages?.marginLeft || layout.page.marginLeft;
      rightMargin = layout.page.evenPages?.marginRight || layout.page.marginRight;
    }
  } else {
    leftMargin = layout.page.marginLeft;
    rightMargin = layout.page.marginRight;
  }
  
  return PRINT_CONSTANTS.A4_WIDTH_MM * PRINT_CONSTANTS.MM_TO_PX - 
         (leftMargin + rightMargin) * PRINT_CONSTANTS.MM_TO_PX;
};

/**
 * Determina se il layout utilizza il formato "Schema 1" (titolo, prezzo e allergeni sulla stessa riga)
 */
export const isSchema1Layout = (layout: PrintLayout | null | undefined): boolean => {
  return layout?.productSchema === 'schema1';
};

/**
 * Crea una chiave unica per il cache del testo
 */
const createCacheKey = (text: string, fontSize: number, fontStyle: string, availableWidth: number): TextHeightCacheKey => {
  return `${text}_${fontSize}_${fontStyle}_${Math.floor(availableWidth)}`;
};

/**
 * Ottiene il line-height appropriato in base alla configurazione del layout
 * o utilizza un fattore predefinito basato sul font
 */
const getLineHeight = (fontSize: number, lineHeight: number | undefined, fontFamily: string = 'Arial'): number => {
  // Se è definito un lineHeight specifico nel layout, usalo
  if (lineHeight && lineHeight > 0) {
    return fontSize * lineHeight;
  }
  
  // Altrimenti usa fattori predefiniti per ciascuna famiglia di font
  const lineHeightFactors: Record<string, number> = {
    'Arial': 1.5,
    'Times New Roman': 1.55,
    'Courier': 1.4,
    'Georgia': 1.6,
    'Verdana': 1.5,
    'Helvetica': 1.5,
    'Tahoma': 1.45,
    'Trebuchet MS': 1.5,
    'Impact': 1.45
    // Aggiungi altre famiglie di font se necessario
  };
  
  // Usa un fattore specifico per la famiglia o il valore predefinito di 1.5
  const factor = fontFamily in lineHeightFactors ? lineHeightFactors[fontFamily] : 1.5;
  
  return fontSize * factor;
};

/**
 * Calcola l'altezza necessaria per il testo in base alla larghezza disponibile
 * e considerando il wrapping del testo
 * @param text Testo da visualizzare
 * @param fontSize Dimensione del font in pt
 * @param fontStyle Stile del font (bold, italic, normal)
 * @param availableWidth Larghezza disponibile in px
 * @param fontFamily Famiglia del font
 * @param configuredLineHeight Interlinea configurata nel layout
 * @param preventWrapping Se true, il testo non andrà a capo (utile per prezzi, allergeni)
 * @returns Altezza stimata in px
 */
export const calculateTextHeight = (
  text: string, 
  fontSize: number,
  fontStyle: string = 'normal',
  availableWidth: number,
  fontFamily: string = 'Arial',
  configuredLineHeight?: number,
  preventWrapping: boolean = false
): number => {
  if (!text) return 0;
  
  // Per elementi che non devono andare a capo (prezzi, allergeni)
  if (preventWrapping) {
    const lineHeight = getLineHeight(fontSize, configuredLineHeight, fontFamily);
    return lineHeight; // Un'unica riga
  }
  
  // Controlla se il risultato è già nella cache
  const cacheKey = createCacheKey(text, fontSize, fontStyle, availableWidth);
  if (textHeightCache.has(cacheKey)) {
    return textHeightCache.get(cacheKey)!;
  }
  
  try {
    // Se siamo in un ambiente browser, usiamo Canvas per misurazioni precise
    const context = initMeasureCanvas();
    if (context) {
      // Imposta lo stile del font
      const fontWeight = fontStyle === 'bold' ? 'bold' : 'normal';
      const fontStyleText = fontStyle === 'italic' ? 'italic' : 'normal';
      context.font = `${fontStyleText} ${fontWeight} ${fontSize}pt ${fontFamily}`;
      
      // Calcola il numero di righe necessarie
      const words = text.split(' ');
      let currentLine = '';
      let lineCount = 1;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        const metrics = context.measureText(testLine);
        if (metrics.width > availableWidth && i > 0) {
          currentLine = words[i] + ' ';
          lineCount++;
        } else {
          currentLine = testLine;
        }
      }
      
      // Calcola l'altezza totale del testo
      const lineHeight = getLineHeight(fontSize, configuredLineHeight, fontFamily);
      const textHeight = lineHeight * lineCount;
      
      // Salva il risultato nella cache
      textHeightCache.set(cacheKey, textHeight);
      return textHeight;
    }
  } catch (error) {
    console.error("Errore nella misurazione del testo:", error);
  }
  
  // Fallback: stima basata sulla lunghezza del testo e sulla larghezza disponibile
  const charactersPerLine = Math.floor(availableWidth / (fontSize * 0.5));
  const estimatedLines = Math.max(1, Math.ceil(text.length / (charactersPerLine || 1)));
  const lineHeight = getLineHeight(fontSize, configuredLineHeight, fontFamily);
  const textHeight = lineHeight * estimatedLines;
  
  // Salva il risultato nella cache
  textHeightCache.set(cacheKey, textHeight);
  return textHeight;
};

/**
 * Calcola l'altezza totale di un titolo di categoria, considerando i margini
 */
export const calculateCategoryTitleHeight = (
  category: Category,
  language: string,
  layout: PrintLayout | null | undefined,
  pageIndex: number = 0
): number => {
  if (!layout) return 40; // Valore di sicurezza predefinito
  
  const categoryConfig = layout.elements.category;
  if (!categoryConfig.visible) return 0;
  
  const availableWidth = getAvailableWidth(layout, pageIndex);
  const title = (category[`title_${language}`] as string) || category.title;
  
  // Per le categorie, generalmente vogliamo che stiano su una sola riga
  // ma calcoliamo comunque in caso di titoli molto lunghi
  const textHeight = calculateTextHeight(
    title,
    categoryConfig.fontSize,
    categoryConfig.fontStyle,
    availableWidth - mmToPx(categoryConfig.margin.left + categoryConfig.margin.right),
    categoryConfig.fontFamily,
    categoryConfig.lineHeight,
    false // Le categorie possono andare a capo se necessario
  );
  
  // Aggiungi i margini superiore e inferiore
  const totalHeight = textHeight + 
                      mmToPx(categoryConfig.margin.top) + 
                      mmToPx(layout.spacing.categoryTitleBottomMargin);
  
  return totalHeight;
};

/**
 * Calcola la larghezza del testo del prezzo e degli allergeni per lo Schema1
 * e determina quanto spazio rimane disponibile per il titolo
 */
export const calculateTitleWidthInSchema1 = (
  product: Product,
  layout: PrintLayout | null | undefined,
  availableWidth: number
): number => {
  if (!layout || !isSchema1Layout(layout)) return availableWidth * 0.8; // Default fallback
  
  let reservedWidth = 0;
  
  // Spazio per il prezzo (se visibile)
  if (layout.elements.price.visible) {
    const priceText = `€ ${product.price_standard}`;
    const priceConfig = layout.elements.price;
    // Utilizza il canvas per misurare con precisione
    const context = initMeasureCanvas();
    if (context) {
      const fontWeight = priceConfig.fontStyle === 'bold' ? 'bold' : 'normal';
      const fontStyleText = priceConfig.fontStyle === 'italic' ? 'italic' : 'normal';
      context.font = `${fontStyleText} ${fontWeight} ${priceConfig.fontSize}pt ${priceConfig.fontFamily}`;
      const metrics = context.measureText(priceText);
      reservedWidth += metrics.width + mmToPx(priceConfig.margin.left + priceConfig.margin.right) + 40; // 40px per i puntini
    } else {
      // Fallback
      reservedWidth += priceText.length * priceConfig.fontSize * 0.65 + 
                      mmToPx(priceConfig.margin.left + priceConfig.margin.right) + 40;
    }
  }
  
  // Spazio per gli allergeni (se visibili e presenti)
  if (layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0) {
    const allergensConfig = layout.elements.allergensList;
    // Misura precisa degli allergeni
    const allergensText = product.allergens.map(allergen => allergen.number).join(", ");
    const context = initMeasureCanvas();
    if (context) {
      const fontWeight = allergensConfig.fontStyle === 'bold' ? 'bold' : 'normal';
      const fontStyleText = allergensConfig.fontStyle === 'italic' ? 'italic' : 'normal';
      context.font = `${fontStyleText} ${fontWeight} ${allergensConfig.fontSize}pt ${allergensConfig.fontFamily}`;
      const metrics = context.measureText(allergensText);
      reservedWidth += metrics.width + mmToPx(allergensConfig.margin.left + allergensConfig.margin.right);
    } else {
      // Fallback
      reservedWidth += (product.allergens.length * 20) + 
                     mmToPx(allergensConfig.margin.left + allergensConfig.margin.right);
    }
  }
  
  // Garantisci uno spazio minimo per il titolo (almeno il 40% della larghezza disponibile)
  const minTitleWidth = availableWidth * 0.4;
  const calculatedTitleWidth = Math.max(minTitleWidth, availableWidth - reservedWidth);
  
  return calculatedTitleWidth;
};

/**
 * Calcola l'altezza totale di un prodotto considerando tutti i suoi elementi e il layout
 */
export const calculateProductHeight = (
  product: Product,
  language: string,
  layout: PrintLayout | null | undefined,
  pageIndex: number = 0
): number => {
  if (!layout) return 50; // Valore di sicurezza predefinito
  
  const availableWidth = getAvailableWidth(layout, pageIndex);
  const isSchema1 = isSchema1Layout(layout);
  let totalHeight = 0;
  
  // Per Schema1, titolo, prezzo e allergeni sono sulla stessa riga
  if (isSchema1) {
    // Calcola quanto spazio è disponibile per il titolo
    const titleWidth = calculateTitleWidthInSchema1(product, layout, availableWidth);
    
    // Calcola l'altezza del titolo considerando il suo wrapping in base allo spazio disponibile
    const title = (product[`title_${language}`] as string) || product.title;
    const titleConfig = layout.elements.title;
    
    const titleHeight = calculateTextHeight(
      title,
      titleConfig.fontSize,
      titleConfig.fontStyle,
      titleWidth,
      titleConfig.fontFamily,
      titleConfig.lineHeight,
      false // Il titolo può andare a capo se necessario
    );
    
    // Aggiungi i margini superiore e inferiore del titolo
    totalHeight += titleHeight + 
                   mmToPx(titleConfig.margin.top + titleConfig.margin.bottom);
  } 
  // Per altri schemi, ogni elemento occupa il proprio spazio
  else {
    // Titolo (se visibile)
    if (layout.elements.title.visible) {
      const title = (product[`title_${language}`] as string) || product.title;
      const titleConfig = layout.elements.title;
      
      const titleHeight = calculateTextHeight(
        title,
        titleConfig.fontSize,
        titleConfig.fontStyle,
        availableWidth - mmToPx(titleConfig.margin.left + titleConfig.margin.right),
        titleConfig.fontFamily,
        titleConfig.lineHeight,
        false // Il titolo può andare a capo se necessario
      );
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += titleHeight + 
                     mmToPx(titleConfig.margin.top + titleConfig.margin.bottom);
    }
    
    // Prezzo (se visibile e non in Schema1)
    if (layout.elements.price.visible) {
      const priceConfig = layout.elements.price;
      // I prezzi non vanno mai a capo
      const priceHeight = calculateTextHeight(
        `€ ${product.price_standard}`,
        priceConfig.fontSize,
        priceConfig.fontStyle,
        availableWidth,
        priceConfig.fontFamily,
        priceConfig.lineHeight,
        true // Il prezzo NON deve andare a capo
      );
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += priceHeight + 
                     mmToPx(priceConfig.margin.top + priceConfig.margin.bottom);
    }
    
    // Allergeni (se visibili, presenti e non in Schema1)
    if (layout.elements.allergensList.visible && product.allergens && 
        product.allergens.length > 0) {
      const allergensConfig = layout.elements.allergensList;
      // Gli allergeni non vanno mai a capo
      const allergensHeight = calculateTextHeight(
        product.allergens.map(allergen => allergen.number).join(", "),
        allergensConfig.fontSize,
        allergensConfig.fontStyle,
        availableWidth,
        allergensConfig.fontFamily,
        allergensConfig.lineHeight,
        true // Gli allergeni NON devono andare a capo
      );
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += allergensHeight + 
                     mmToPx(allergensConfig.margin.top + allergensConfig.margin.bottom);
    }
  }
  
  // Descrizione (sempre in riga separata, se presente e visibile)
  if (layout.elements.description.visible) {
    const description = (product[`description_${language}`] as string) || product.description;
    
    if (description) {
      const descriptionConfig = layout.elements.description;
      
      const descriptionHeight = calculateTextHeight(
        description,
        descriptionConfig.fontSize,
        descriptionConfig.fontStyle,
        availableWidth - mmToPx(descriptionConfig.margin.left + descriptionConfig.margin.right),
        descriptionConfig.fontFamily,
        descriptionConfig.lineHeight,
        false // La descrizione può andare a capo
      );
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += descriptionHeight + 
                     mmToPx(descriptionConfig.margin.top + descriptionConfig.margin.bottom);
    }
  }
  
  // Varianti di prezzo (se presenti e visibili)
  if (layout.elements.priceVariants.visible && product.has_multiple_prices) {
    const priceVariantsConfig = layout.elements.priceVariants;
    
    // Le varianti di prezzo non vanno a capo
    let variantsText = '';
    if (product.price_variant_1_name) {
      variantsText += `${product.price_variant_1_name}: € ${product.price_variant_1_value} `;
    }
    if (product.price_variant_2_name) {
      variantsText += `${product.price_variant_2_name}: € ${product.price_variant_2_value}`;
    }
    
    const variantsHeight = calculateTextHeight(
      variantsText,
      priceVariantsConfig.fontSize,
      priceVariantsConfig.fontStyle,
      availableWidth,
      priceVariantsConfig.fontFamily,
      priceVariantsConfig.lineHeight,
      true // Le varianti di prezzo NON devono andare a capo
    );
    
    // Aggiungi i margini superiore e inferiore
    totalHeight += variantsHeight + 
                   mmToPx(priceVariantsConfig.margin.top + priceVariantsConfig.margin.bottom);
  }
  
  // Aggiungi lo spazio tra prodotti (solo se non è l'ultimo prodotto)
  totalHeight += mmToPx(layout.spacing.betweenProducts);
  
  return totalHeight;
};

/**
 * Stima la larghezza di un testo in base a font e stile
 * Funzione ausiliaria per calcoli di layout
 */
export const estimateTextWidth = (
  text: string, 
  fontSize: number, 
  fontStyle: string = 'normal',
  fontFamily: string = 'Arial'
): number => {
  if (!text) return 0;
  
  try {
    const context = initMeasureCanvas();
    if (context) {
      // Imposta lo stile del font
      const fontWeight = fontStyle === 'bold' ? 'bold' : 'normal';
      const fontStyleText = fontStyle === 'italic' ? 'italic' : 'normal';
      context.font = `${fontStyleText} ${fontWeight} ${fontSize}pt ${fontFamily}`;
      
      // Misura la larghezza del testo
      const metrics = context.measureText(text);
      return metrics.width;
    }
  } catch (error) {
    console.error("Errore nella misurazione della larghezza del testo:", error);
  }
  
  // Fallback: stima basata sulla lunghezza del testo
  return text.length * fontSize * 0.5;
};

/**
 * Calcola l'altezza totale di una categoria con tutti i suoi prodotti
 */
export const calculateCategoryWithProductsHeight = (
  category: Category,
  products: Product[],
  language: string,
  layout: PrintLayout | null | undefined,
  pageIndex: number = 0
): number => {
  let totalHeight = 0;
  
  // Altezza del titolo della categoria
  totalHeight += calculateCategoryTitleHeight(category, language, layout, pageIndex);
  
  // Somma le altezze di tutti i prodotti
  products.forEach(product => {
    totalHeight += calculateProductHeight(product, language, layout, pageIndex);
  });
  
  // Aggiungi lo spazio tra categorie
  if (layout) {
    totalHeight += mmToPx(layout.spacing.betweenCategories);
  } else {
    totalHeight += mmToPx(PRINT_CONSTANTS.SPACING.BETWEEN_CATEGORIES);
  }
  
  return totalHeight;
};

/**
 * Verifica se una categoria può entrare nello spazio disponibile rimanente
 */
export const canFitCategory = (
  category: Category,
  products: Product[],
  remainingHeight: number,
  language: string,
  layout: PrintLayout | null | undefined,
  pageIndex: number = 0
): boolean => {
  const categoryHeight = calculateCategoryWithProductsHeight(
    category, products, language, layout, pageIndex
  );
  
  return categoryHeight <= remainingHeight;
};

/**
 * Verifica se un singolo prodotto può entrare nello spazio disponibile rimanente
 */
export const canFitProduct = (
  product: Product,
  remainingHeight: number,
  language: string,
  layout: PrintLayout | null | undefined,
  pageIndex: number = 0
): boolean => {
  const productHeight = calculateProductHeight(product, language, layout, pageIndex);
  return productHeight <= remainingHeight;
};

/**
 * Calcola l'altezza disponibile per il contenuto in una pagina
 */
export const getAvailableHeight = (
  layout: PrintLayout | null | undefined,
  pageIndex: number = 0
): number => {
  let topMargin, bottomMargin;
  
  if (!layout) {
    topMargin = PRINT_CONSTANTS.DEFAULT_MARGINS.TOP;
    bottomMargin = PRINT_CONSTANTS.DEFAULT_MARGINS.BOTTOM;
  }
  else if (layout.page.useDistinctMarginsForPages) {
    if (pageIndex % 2 === 0) { // Pagina dispari (indice 0, 2, 4...)
      topMargin = layout.page.oddPages?.marginTop || layout.page.marginTop;
      bottomMargin = layout.page.oddPages?.marginBottom || layout.page.marginBottom;
    } else { // Pagina pari (indice 1, 3, 5...)
      topMargin = layout.page.evenPages?.marginTop || layout.page.marginTop;
      bottomMargin = layout.page.evenPages?.marginBottom || layout.page.marginBottom;
    }
  } else {
    topMargin = layout.page.marginTop;
    bottomMargin = layout.page.marginBottom;
  }
  
  return PRINT_CONSTANTS.A4_HEIGHT_MM * PRINT_CONSTANTS.MM_TO_PX - 
         (topMargin + bottomMargin) * PRINT_CONSTANTS.MM_TO_PX;
};

/**
 * Pulisce la cache delle misurazioni del testo
 * Utile dopo molti calcoli per liberare memoria
 */
export const clearTextHeightCache = (): void => {
  textHeightCache.clear();
};

/**
 * Calcola l'altezza di un elemento di copertina
 */
export const calculateCoverElementHeight = (
  text: string,
  elementConfig: PrintLayout['cover']['title'],
): number => {
  if (!elementConfig.visible || !text) return 0;
  
  // Larghezza disponibile stimata per il titolo di copertina (valore approssimativo)
  const availableWidth = PRINT_CONSTANTS.A4_WIDTH_MM * PRINT_CONSTANTS.MM_TO_PX * 0.8;
  
  const textHeight = calculateTextHeight(
    text,
    elementConfig.fontSize,
    elementConfig.fontStyle,
    availableWidth,
    elementConfig.fontFamily
  );
  
  // Aggiungi i margini
  return textHeight + mmToPx(elementConfig.margin.top + elementConfig.margin.bottom);
};
