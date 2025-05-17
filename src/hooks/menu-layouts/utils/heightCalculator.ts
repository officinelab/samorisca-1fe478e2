import { PrintLayout } from "@/types/printLayout";
import { Product, Category } from "@/types/database";
import { PRINT_CONSTANTS } from "../constants";

/**
 * Converte i millimetri in pixel per la visualizzazione su schermo
 */
export const mmToPx = (mm: number): number => {
  try {
    if (typeof window !== "undefined" && document.body) {
      const div = document.createElement("div");
      div.style.width = "1mm";
      div.style.position = "absolute";
      div.style.visibility = "hidden";
      document.body.appendChild(div);
      const pxPerMm = div.getBoundingClientRect().width;
      document.body.removeChild(div);
      return mm * pxPerMm;
    }
  } catch (e) {
    // fallback
  }
  return mm * 3.543; // 3.543 px per mm @ 96dpi
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
 * Calcola l'altezza necessaria per il testo in base alla larghezza disponibile
 * @param text Testo da visualizzare
 * @param fontSize Dimensione del font in pt
 * @param fontStyle Stile del font (bold, italic, normal)
 * @param availableWidth Larghezza disponibile in px
 * @returns Altezza stimata in px
 */
export const calculateTextHeight = (
  text: string, 
  fontSize: number,
  fontStyle: string = 'normal',
  availableWidth: number
): number => {
  if (!text) return 0;
  
  try {
    // Se siamo in un ambiente browser, usiamo Canvas per misurazioni precise
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return fontSize * 1.5; // Fallback
      
      // Imposta lo stile del font
      const fontWeight = fontStyle === 'bold' ? 'bold' : 'normal';
      const fontStyleText = fontStyle === 'italic' ? 'italic' : 'normal';
      context.font = `${fontStyleText} ${fontWeight} ${fontSize}pt Arial`;
      
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
      
      // Altezza riga (in px) = fontSize (pt) * 1.5 (fattore di conversione approssimativo)
      const lineHeight = fontSize * 1.5;
      return lineHeight * lineCount;
    }
  } catch (error) {
    console.error("Errore nella misurazione del testo:", error);
  }
  
  // Fallback: stima basata sulla lunghezza del testo e sulla larghezza disponibile
  const charactersPerLine = Math.floor(availableWidth / (fontSize * 0.5));
  const estimatedLines = Math.ceil(text.length / charactersPerLine) || 1;
  return fontSize * 1.5 * estimatedLines;
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
    availableWidth - mmToPx(categoryConfig.margin.left + categoryConfig.margin.right)
  );
  
  // Aggiungi i margini superiore e inferiore
  const totalHeight = textHeight + 
                      mmToPx(categoryConfig.margin.top) + 
                      mmToPx(layout.spacing.categoryTitleBottomMargin);
  
  return totalHeight;
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
    // Calcola quanto spazio è occupato da prezzo e allergeni
    let reservedWidth = 0;
    
    // Spazio per il prezzo (se visibile)
    if (layout.elements.price.visible) {
      // Stima: 80px per il prezzo + margini
      reservedWidth += 80 + mmToPx(layout.elements.price.margin.left + layout.elements.price.margin.right);
    }
    
    // Spazio per gli allergeni (se visibili e presenti)
    if (layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0) {
      // Stima: 20px per ogni numero di allergene
      reservedWidth += product.allergens.length * 20 + 
                      mmToPx(layout.elements.allergensList.margin.left + layout.elements.allergensList.margin.right);
    }
    
    // Spazio puntini (circa 20px)
    reservedWidth += 20;
    
    // Calcola altezza riga titolo/prezzo/allergeni
    const title = (product[`title_${language}`] as string) || product.title;
    const titleConfig = layout.elements.title;
    
    // Larghezza disponibile per il titolo = larghezza totale - spazio riservato
    const titleWidth = availableWidth - reservedWidth;
    
    const titleHeight = calculateTextHeight(
      title,
      titleConfig.fontSize,
      titleConfig.fontStyle,
      titleWidth
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
        availableWidth - mmToPx(titleConfig.margin.left + titleConfig.margin.right)
      );
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += titleHeight + 
                     mmToPx(titleConfig.margin.top + titleConfig.margin.bottom);
    }
    
    // Prezzo (se visibile e non in Schema1)
    if (layout.elements.price.visible && !isSchema1) {
      const priceConfig = layout.elements.price;
      // Altezza stimata per il prezzo (dipende solo dal fontSize, non dal contenuto)
      const priceHeight = priceConfig.fontSize * 1.2;
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += priceHeight + 
                     mmToPx(priceConfig.margin.top + priceConfig.margin.bottom);
    }
    
    // Allergeni (se visibili, presenti e non in Schema1)
    if (layout.elements.allergensList.visible && product.allergens && 
        product.allergens.length > 0 && !isSchema1) {
      const allergensConfig = layout.elements.allergensList;
      // Altezza stimata per gli allergeni
      const allergensHeight = allergensConfig.fontSize * 1.2;
      
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
        availableWidth - mmToPx(descriptionConfig.margin.left + descriptionConfig.margin.right)
      );
      
      // Aggiungi i margini superiore e inferiore
      totalHeight += descriptionHeight + 
                     mmToPx(descriptionConfig.margin.top + descriptionConfig.margin.bottom);
    }
  }
  
  // Varianti di prezzo (se presenti e visibili)
  if (layout.elements.priceVariants.visible && product.has_multiple_prices) {
    const priceVariantsConfig = layout.elements.priceVariants;
    // Altezza stimata per le varianti di prezzo
    const priceVariantsHeight = priceVariantsConfig.fontSize * 1.2;
    
    // Aggiungi i margini superiore e inferiore
    totalHeight += priceVariantsHeight + 
                   mmToPx(priceVariantsConfig.margin.top + priceVariantsConfig.margin.bottom);
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
