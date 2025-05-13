
import { PrintLayout } from "@/types/printLayout";
import { Product } from "@/types/database";
import { mmToPx } from "@/hooks/menu-layouts/utils/heightCalculator";

// Import necessary functions from heightCalculator
import { 
  calculateTextHeight, 
  getAvailableWidth,
  clearTextHeightCache,
  isSchema1Layout
} from "@/hooks/menu-layouts/utils/heightCalculator";

export {
  calculateTextHeight,
  getAvailableWidth,
  clearTextHeightCache
};

// Determina se il layout utilizza lo Schema 2
export const isSchema2Layout = (layout: PrintLayout | null | undefined): boolean => {
  return layout?.productSchema === 'schema2';
};

// Determina se il layout utilizza lo Schema 3
export const isSchema3Layout = (layout: PrintLayout | null | undefined): boolean => {
  return layout?.productSchema === 'schema3';
};

// Calcola l'altezza stimata di un elemento di testo
export const estimateTextHeight = (
  text: string | undefined | null,
  fontSize: number,
  availableWidth: number,
  fontStyle: string = 'normal'
): number => {
  if (!text) return 0;
  
  return calculateTextHeight(text, fontSize, fontStyle, availableWidth);
};

// Determina l'altezza del titolo della categoria
export const estimateCategoryTitleHeight = (
  layout: PrintLayout | null | undefined
): number => {
  // Valori di default se non c'è un layout personalizzato
  const defaultHeight = 40;
  
  if (!layout || !layout.elements.category.visible) {
    return defaultHeight;
  }
  
  // Considera lo stile del carattere e la dimensione del font
  const factor = layout.elements.category.fontSize / 12;
  const baseHeight = 20 * factor; // Altezza base proporzionale alla dimensione del font
  
  // Aggiungi i margini
  const marginTop = layout.elements.category.margin.top || 0;
  const marginBottom = layout.spacing.categoryTitleBottomMargin || 5;
  
  return baseHeight + mmToPx(marginTop + marginBottom);
};

// Calcola l'altezza stimata di un prodotto in base al suo schema di layout
export const getProductHeight = (
  product: Product, 
  language: string,
  layout: PrintLayout | null | undefined
): number => {
  // Usa l'altezza di default se non c'è un layout
  if (!layout) {
    return 60; // Altezza di default in pixel
  }

  // Variabili per memorizzare l'altezza totale e la larghezza disponibile
  let totalHeight = 0;
  const availableWidth = getAvailableWidth(layout);
  
  // Schema 1 (Classico)
  if (isSchema1Layout(layout)) {
    // Prima riga: Titolo, Allergeni, Prezzo
    const title = product[`title_${language}`] || product.title || '';
    const titleConfig = layout.elements.title;
    
    // Se il titolo è visibile
    if (titleConfig.visible) {
      // Calcola lo spazio riservato per prezzo e allergeni
      let reservedWidth = 0;
      
      // Riserva spazio per prezzo se visibile
      if (layout.elements.price.visible) {
        reservedWidth += 100; // Stima per prezzo e puntini
      }
      
      // Riserva spazio per allergeni se visibili e presenti
      if (layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0) {
        reservedWidth += product.allergens.length * 20 + 80; // Stima per "Allergeni: X, Y, Z"
      }
      
      // Calcola altezza titolo con lo spazio disponibile ridotto
      const titleWidth = availableWidth - reservedWidth;
      const titleHeight = calculateTextHeight(
        title,
        titleConfig.fontSize,
        titleConfig.fontStyle,
        titleWidth,
        titleConfig.fontFamily
      );
      
      totalHeight += titleHeight + mmToPx(titleConfig.margin.top + titleConfig.margin.bottom);
    }
    
    // Aggiungi altezza per la descrizione se presente e visibile
    const description = product[`description_${language}`] || product.description;
    if (description && layout.elements.description.visible) {
      const descConfig = layout.elements.description;
      const descWidth = availableWidth * 0.95; // 95% della larghezza disponibile
      
      const descHeight = calculateTextHeight(
        description,
        descConfig.fontSize,
        descConfig.fontStyle,
        descWidth,
        descConfig.fontFamily
      );
      
      totalHeight += descHeight + mmToPx(descConfig.margin.top + descConfig.margin.bottom);
    }
    
    // Aggiungi altezza per le varianti di prezzo se presenti e visibili
    if (product.has_multiple_prices && layout.elements.priceVariants.visible) {
      const priceVariantsConfig = layout.elements.priceVariants;
      totalHeight += 20 + mmToPx(priceVariantsConfig.margin.top + priceVariantsConfig.margin.bottom);
    }
  }
  
  // Schema 2 (Compatto)
  else if (isSchema2Layout(layout)) {
    // Prima riga: Titolo (80%) e Prezzo (20%)
    if (layout.elements.title.visible) {
      const title = product[`title_${language}`] || product.title || '';
      const titleConfig = layout.elements.title;
      
      const titleWidth = availableWidth * 0.8; // 80% della larghezza disponibile
      const titleHeight = calculateTextHeight(
        title,
        titleConfig.fontSize,
        titleConfig.fontStyle,
        titleWidth,
        titleConfig.fontFamily
      );
      
      // Prima riga (titolo e prezzo)
      totalHeight += Math.max(
        titleHeight + mmToPx(titleConfig.margin.top + titleConfig.margin.bottom),
        layout.elements.price.fontSize * 1.5 // Altezza minima per il prezzo
      );
    }
    
    // Seconda riga: Allergeni + Caratteristiche (80%) e Prezzi Varianti (20%)
    let secondRowHeight = 0;
    
    // Calcola altezza per allergeni se presenti e visibili
    if (product.allergens && product.allergens.length > 0 && layout.elements.allergensList.visible) {
      const allergensConfig = layout.elements.allergensList;
      secondRowHeight = Math.max(
        secondRowHeight, 
        allergensConfig.fontSize * 1.5 + mmToPx(allergensConfig.margin.top + allergensConfig.margin.bottom)
      );
    }
    
    // Calcola altezza per varianti di prezzo se presenti e visibili
    if (product.has_multiple_prices && layout.elements.priceVariants.visible) {
      const priceVariantsConfig = layout.elements.priceVariants;
      // Se ci sono due varianti, raddoppia l'altezza della riga
      const numVariants = (product.price_variant_1_name ? 1 : 0) + (product.price_variant_2_name ? 1 : 0);
      const variantsHeight = priceVariantsConfig.fontSize * 1.5 * numVariants;
      
      secondRowHeight = Math.max(
        secondRowHeight, 
        variantsHeight + mmToPx(priceVariantsConfig.margin.top + priceVariantsConfig.margin.bottom)
      );
    }
    
    // Se c'è qualcosa nella seconda riga, aggiungila all'altezza totale
    if (secondRowHeight > 0) {
      totalHeight += secondRowHeight + 4; // Aggiungi un piccolo spazio
    }
    
    // Terza riga: Descrizione (80%)
    const description = product[`description_${language}`] || product.description;
    if (description && layout.elements.description.visible) {
      const descConfig = layout.elements.description;
      const descWidth = availableWidth * 0.8; // 80% della larghezza disponibile
      
      const descHeight = calculateTextHeight(
        description,
        descConfig.fontSize,
        descConfig.fontStyle,
        descWidth,
        descConfig.fontFamily
      );
      
      totalHeight += descHeight + mmToPx(descConfig.margin.top + descConfig.margin.bottom);
    }
  }
  
  // Schema 3 (Espanso)
  else if (isSchema3Layout(layout)) {
    // Prima riga: Titolo
    if (layout.elements.title.visible) {
      const title = product[`title_${language}`] || product.title || '';
      const titleConfig = layout.elements.title;
      
      const titleHeight = calculateTextHeight(
        title,
        titleConfig.fontSize,
        titleConfig.fontStyle,
        availableWidth,
        titleConfig.fontFamily
      );
      
      totalHeight += titleHeight + mmToPx(titleConfig.margin.top + titleConfig.margin.bottom);
    }
    
    // Seconda riga: Descrizione
    const description = product[`description_${language}`] || product.description;
    if (description && layout.elements.description.visible) {
      const descConfig = layout.elements.description;
      
      const descHeight = calculateTextHeight(
        description,
        descConfig.fontSize,
        descConfig.fontStyle,
        availableWidth,
        descConfig.fontFamily
      );
      
      totalHeight += descHeight + mmToPx(descConfig.margin.top + descConfig.margin.bottom);
    }
    
    // Riquadro info: Prezzo (sinistra) e Allergeni (destra)
    let infoBoxHeight = 0;
    
    // Prezzo
    if (layout.elements.price.visible) {
      infoBoxHeight = Math.max(infoBoxHeight, layout.elements.price.fontSize * 1.5);
    }
    
    // Allergeni
    if (product.allergens && product.allergens.length > 0 && layout.elements.allergensList.visible) {
      infoBoxHeight = Math.max(infoBoxHeight, layout.elements.allergensList.fontSize * 1.5);
    }
    
    // Varianti di prezzo
    if (product.has_multiple_prices && layout.elements.priceVariants.visible) {
      const numVariants = (product.price_variant_1_name ? 1 : 0) + (product.price_variant_2_name ? 1 : 0);
      infoBoxHeight += layout.elements.priceVariants.fontSize * 1.5 * numVariants;
    }
    
    // Aggiungi l'altezza del riquadro info
    totalHeight += infoBoxHeight + 15; // Aggiungi padding per il riquadro
  }
  
  // Default (Layout non riconosciuto)
  else {
    // Fallback: usa una stima semplice
    totalHeight = 80;
  }
  
  // Aggiungi lo spazio tra i prodotti
  totalHeight += mmToPx(layout.spacing.betweenProducts || 5);
  
  return totalHeight;
};

// Calcola l'altezza disponibile in una pagina
export const calculateAvailableHeight = (
  pageIndex: number,
  A4_HEIGHT_MM: number,
  layout: PrintLayout | null | undefined
): number => {
  // Valori predefiniti
  const defaultMarginTop = 15;
  const defaultMarginBottom = 15;
  
  let marginTop, marginBottom;
  
  // Se non c'è layout, usa i valori predefiniti
  if (!layout) {
    marginTop = defaultMarginTop;
    marginBottom = defaultMarginBottom;
  }
  // Se il layout usa margini diversi per pagine pari/dispari
  else if (layout.page.useDistinctMarginsForPages) {
    if (pageIndex % 2 === 0) { // Pagina dispari
      marginTop = layout.page.oddPages?.marginTop || layout.page.marginTop;
      marginBottom = layout.page.oddPages?.marginBottom || layout.page.marginBottom;
    } else { // Pagina pari
      marginTop = layout.page.evenPages?.marginTop || layout.page.marginTop;
      marginBottom = layout.page.evenPages?.marginBottom || layout.page.marginBottom;
    }
  }
  // Altrimenti usa i margini standard
  else {
    marginTop = layout.page.marginTop;
    marginBottom = layout.page.marginBottom;
  }
  
  // Converti A4_HEIGHT_MM in pixel e sottrai i margini
  return (A4_HEIGHT_MM * 3.779) - (marginTop + marginBottom) * 3.779;
};
