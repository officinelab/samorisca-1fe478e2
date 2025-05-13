
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
 * Determina se il layout utilizza il formato "Schema 2" (compatto)
 */
export const isSchema2Layout = (layout: PrintLayout | null | undefined): boolean => {
  return layout?.productSchema === 'schema2';
};

/**
 * Determina se il layout utilizza il formato "Schema 3" (espanso)
 */
export const isSchema3Layout = (layout: PrintLayout | null | undefined): boolean => {
  return layout?.productSchema === 'schema3';
};

/**
 * Crea una chiave unica per il cache del testo
 */
const createCacheKey = (text: string, fontSize: number, fontStyle: string, availableWidth: number): TextHeightCacheKey => {
  return `${text}_${fontSize}_${fontStyle}_${Math.floor(availableWidth)}`;
};

/**
 * Ottiene il line-height appropriato per il font specificato
 * basato sulla dimensione del font e sullo stile
 */
const getLineHeight = (fontSize: number, fontFamily: string = 'Arial'): number => {
  // Le famiglie di font hanno diversi fattori di interlinea naturali
  // Queste sono approssimazioni basate sui valori tipici
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
 * @param text Testo da visualizzare
 * @param fontSize Dimensione del font in pt
 * @param fontStyle Stile del font (bold, italic, normal)
 * @param availableWidth Larghezza disponibile in px
 * @param fontFamily Famiglia del font
 * @returns Altezza stimata in px
 */
export const calculateTextHeight = (
  text: string, 
  fontSize: number,
  fontStyle: string = 'normal',
  availableWidth: number,
  fontFamily: string = 'Arial'
): number => {
  if (!text) return 0;
  
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
      const lineHeight = getLineHeight(fontSize, fontFamily);
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
  const estimatedLines = Math.ceil(text.length / charactersPerLine) || 1;
  const lineHeight = getLineHeight(fontSize, fontFamily);
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
  
  // Calcolo dell'altezza del testo
  const textHeight = calculateTextHeight(
    title,
    categoryConfig.fontSize,
    categoryConfig.fontStyle,
    availableWidth - mmToPx(categoryConfig.margin.left + categoryConfig.margin.right),
    categoryConfig.fontFamily
  );
  
  // Aggiungi i margini superiore e inferiore
  const totalHeight = textHeight + 
                      mmToPx(categoryConfig.margin.top) + 
                      mmToPx(layout.spacing.categoryTitleBottomMargin);
  
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
  let totalHeight = 0;
  
  // Gestisci separatamente i diversi schemi di layout
  if (isSchema2Layout(layout)) {
    // SCHEMA 2 (COMPATTO): gestione separata dell'altezza
    
    // Prima riga: titolo (80%) e prezzo (20%)
    if (layout.elements.title.visible) {
      const title = (product[`title_${language}`] as string) || product.title;
      const titleConfig = layout.elements.title;
      
      // Calcola l'altezza del titolo considerando che occupa l'80% della larghezza
      const titleWidth = availableWidth * 0.8; // 80% della larghezza disponibile
      
      const titleHeight = calculateTextHeight(
        title,
        titleConfig.fontSize,
        titleConfig.fontStyle,
        titleWidth,
        titleConfig.fontFamily
      );
      
      // Aggiungi i margini del titolo
      totalHeight += titleHeight + 
                     mmToPx(titleConfig.margin.top + titleConfig.margin.bottom);
      
      // Aggiungi 1mm per il bordo inferiore della prima riga
      totalHeight += mmToPx(1); 
    }
    
    // Seconda riga: allergeni (80%) e varianti di prezzo (20%)
    let secondRowHeight = 0;
    
    // Altezza degli allergeni
    if (layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0) {
      const allergensConfig = layout.elements.allergensList;
      const allergensText = `Allergeni: ${product.allergens.map(allergen => allergen.number).join(", ")}`;
      
      const allergensHeight = calculateTextHeight(
        allergensText,
        allergensConfig.fontSize,
        allergensConfig.fontStyle,
        availableWidth * 0.8, // 80% della larghezza
        allergensConfig.fontFamily
      );
      
      // L'altezza della seconda riga è il massimo tra allergeni e varianti di prezzo
      secondRowHeight = Math.max(secondRowHeight, 
        allergensHeight + mmToPx(allergensConfig.margin.top + allergensConfig.margin.bottom));
    }
    
    // Altezza delle varianti di prezzo
    if (layout.elements.priceVariants.visible && product.has_multiple_prices) {
      const priceVariantsConfig = layout.elements.priceVariants;
      
      // Calcola quante righe occupano le varianti di prezzo
      let variantLines = 0;
      if (product.price_variant_1_name) variantLines++;
      if (product.price_variant_2_name) variantLines++;
      
      // Altezza approssimativa per ogni riga delle varianti
      const variantLineHeight = priceVariantsConfig.fontSize * 1.2;
      const variantsHeight = variantLines * variantLineHeight;
      
      // Aggiorna l'altezza della seconda riga se le varianti sono più alte
      secondRowHeight = Math.max(secondRowHeight, 
        variantsHeight + mmToPx(priceVariantsConfig.margin.top + priceVariantsConfig.margin.bottom));
    }
    
    // Se ci sono allergeni o varianti, aggiungi l'altezza della seconda riga
    if (secondRowHeight > 0) {
      totalHeight += secondRowHeight;
    }
    
    // Terza riga: descrizione (80%)
    if (layout.elements.description.visible) {
      const description = (product[`description_${language}`] as string) || product.description;
      
      if (description) {
        const descriptionConfig = layout.elements.description;
        
        // Calcola l'altezza della descrizione considerando che occupa l'80% della larghezza
        const descriptionHeight = calculateTextHeight(
          description,
          descriptionConfig.fontSize,
          descriptionConfig.fontStyle,
          availableWidth * 0.8, // 80% della larghezza
          descriptionConfig.fontFamily
        );
        
        // Aggiungi i margini della descrizione
        totalHeight += descriptionHeight + 
                       mmToPx(descriptionConfig.margin.top + descriptionConfig.margin.bottom);
      }
    }
  } 
  else if (isSchema1Layout(layout)) {
    // SCHEMA 1 (CLASSICO): Per Schema1, titolo, prezzo e allergeni sono sulla stessa riga
    
    // Calcola quanto spazio è occupato da prezzo e allergeni
    let reservedWidth = 0;
    
    // Spazio per il prezzo (se visibile)
    if (layout.elements.price.visible) {
      // Stima più precisa per il prezzo + puntini
      const priceText = `€ ${product.price_standard}`;
      const priceConfig = layout.elements.price;
      const priceTextWidth = estimateTextWidth(
        priceText, 
        priceConfig.fontSize, 
        priceConfig.fontStyle, 
        priceConfig.fontFamily
      );
      // Aggiungi lo spazio per i margini e i puntini
      reservedWidth += priceTextWidth + mmToPx(priceConfig.margin.left + priceConfig.margin.right) + 30;
    }
    
    // Spazio per gli allergeni (se visibili e presenti)
    if (layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0) {
      const allergensConfig = layout.elements.allergensList;
      // Stima migliore: circa 15-20px per ogni numero di allergene + margini
      reservedWidth += (product.allergens.length * 20) + 
                      mmToPx(allergensConfig.margin.left + allergensConfig.margin.right);
    }
    
    // Calcola altezza riga titolo/prezzo/allergeni
    const title = (product[`title_${language}`] as string) || product.title;
    const titleConfig = layout.elements.title;
    
    // Larghezza disponibile per il titolo = larghezza totale - spazio riservato
    const titleWidth = availableWidth - reservedWidth;
    
    const titleHeight = calculateTextHeight(
      title,
      titleConfig.fontSize,
      titleConfig.fontStyle,
      titleWidth,
      titleConfig.fontFamily
    );
    
    // Aggiungi i margini superiore e inferiore del titolo
    totalHeight += titleHeight + 
                   mmToPx(titleConfig.margin.top + titleConfig.margin.bottom);
    
    // Descrizione (se presente e visibile)
    if (layout.elements.description.visible) {
      const description = (product[`description_${language}`] as string) || product.description;
      
      if (description) {
        const descriptionConfig = layout.elements.description;
        
        const descriptionHeight = calculateTextHeight(
          description,
          descriptionConfig.fontSize,
          descriptionConfig.fontStyle,
          availableWidth - mmToPx(descriptionConfig.margin.left + descriptionConfig.margin.right),
          descriptionConfig.fontFamily
        );
        
        // Aggiungi i margini superiore e inferiore
        totalHeight += descriptionHeight + 
                       mmToPx(descriptionConfig.margin.top + descriptionConfig.margin.bottom);
      }
    }
    
    // Varianti di prezzo (se presenti e visibili)
    if (layout.elements.priceVariants.visible && product.has_multiple_prices) {
      const priceVariantsConfig = layout.elements.priceVariants;
      
      // Calcola l'altezza delle varianti di prezzo in base al testo effettivo
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
        availableWidth - mmToPx(priceVariantsConfig.margin.left + priceVariantsConfig.margin.right),
        priceVariantsConfig.fontFamily
      );
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += variantsHeight + 
                     mmToPx(priceVariantsConfig.margin.top + priceVariantsConfig.margin.bottom);
    }
  }
  else {
    // SCHEMA 3 o altri schemi non specificamente gestiti
    // Usa un'implementazione generica o quella più vicina
    
    // Titolo (se visibile)
    if (layout.elements.title.visible) {
      const title = (product[`title_${language}`] as string) || product.title;
      const titleConfig = layout.elements.title;
      
      const titleHeight = calculateTextHeight(
        title,
        titleConfig.fontSize,
        titleConfig.fontStyle,
        availableWidth - mmToPx(titleConfig.margin.left + titleConfig.margin.right),
        titleConfig.fontFamily
      );
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += titleHeight + 
                     mmToPx(titleConfig.margin.top + titleConfig.margin.bottom);
    }
    
    // Prezzo (se visibile)
    if (layout.elements.price.visible) {
      const priceConfig = layout.elements.price;
      // Usa l'altezza calcolata in base a dimensione font e family
      const priceHeight = priceConfig.fontSize * 1.2;
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += priceHeight + 
                     mmToPx(priceConfig.margin.top + priceConfig.margin.bottom);
    }
    
    // Allergeni (se visibili e presenti)
    if (layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0) {
      const allergensConfig = layout.elements.allergensList;
      // Calcola l'altezza in base alla dimensione del font
      const allergensHeight = allergensConfig.fontSize * 1.2;
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += allergensHeight + 
                     mmToPx(allergensConfig.margin.top + allergensConfig.margin.bottom);
    }
    
    // Descrizione (se presente e visibile)
    if (layout.elements.description.visible) {
      const description = (product[`description_${language}`] as string) || product.description;
      
      if (description) {
        const descriptionConfig = layout.elements.description;
        
        const descriptionHeight = calculateTextHeight(
          description,
          descriptionConfig.fontSize,
          descriptionConfig.fontStyle,
          availableWidth - mmToPx(descriptionConfig.margin.left + descriptionConfig.margin.right),
          descriptionConfig.fontFamily
        );
        
        // Aggiungi i margini superiore e inferiore
        totalHeight += descriptionHeight + 
                       mmToPx(descriptionConfig.margin.top + descriptionConfig.margin.bottom);
      }
    }
    
    // Varianti di prezzo (se presenti e visibili)
    if (layout.elements.priceVariants.visible && product.has_multiple_prices) {
      const priceVariantsConfig = layout.elements.priceVariants;
      // Altezza approssimativa per varianti di prezzo
      const variantsHeight = (product.price_variant_1_name ? 1 : 0) + 
                             (product.price_variant_2_name ? 1 : 0) * 
                             priceVariantsConfig.fontSize * 1.2;
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += variantsHeight + 
                     mmToPx(priceVariantsConfig.margin.top + priceVariantsConfig.margin.bottom);
    }
  }
  
  // Aggiungi lo spazio tra prodotti (solo se non è l'ultimo prodotto)
  totalHeight += mmToPx(layout.spacing.betweenProducts);
  
  return totalHeight;
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
