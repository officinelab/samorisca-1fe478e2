
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";

/**
 * Determina se il layout utilizza Schema 1 (classico)
 */
export const isSchema1Layout = (layout: PrintLayout | null | undefined): boolean => {
  if (!layout) return true; // Default a Schema 1
  return layout.productSchema === 'schema1';
};

/**
 * Determina se il layout utilizza Schema 2 (compatto)
 */
export const isSchema2Layout = (layout: PrintLayout | null | undefined): boolean => {
  if (!layout) return false;
  return layout.productSchema === 'schema2';
};

/**
 * Determina se il layout utilizza Schema 3
 */
export const isSchema3Layout = (layout: PrintLayout | null | undefined): boolean => {
  if (!layout) return false;
  return layout.productSchema === 'schema3';
};

/**
 * Calcola l'altezza disponibile per il contenuto in base ai margini del layout
 */
export const getAvailableHeight = (
  layout: PrintLayout | null | undefined,
  pageIndex: number = 0
): number => {
  // Altezza predefinita di una pagina A4 in mm
  const A4_HEIGHT_MM = 297;
  
  if (!layout) {
    // Valori predefiniti se non è disponibile un layout
    return A4_HEIGHT_MM - 40; // 20mm margine superiore + 20mm margine inferiore
  }
  
  let topMargin = layout.page.marginTop;
  let bottomMargin = layout.page.marginBottom;
  
  // Se sono abilitati margini distinti per le pagine pari/dispari
  if (layout.page.useDistinctMarginsForPages) {
    // Pagina dispari
    if (pageIndex % 2 === 0) {
      topMargin = layout.page.oddPages?.marginTop || layout.page.marginTop;
      bottomMargin = layout.page.oddPages?.marginBottom || layout.page.marginBottom;
    }
    // Pagina pari
    else {
      topMargin = layout.page.evenPages?.marginTop || layout.page.marginTop;
      bottomMargin = layout.page.evenPages?.marginBottom || layout.page.marginBottom;
    }
  }
  
  return A4_HEIGHT_MM - (topMargin + bottomMargin);
};

/**
 * Calcola l'altezza del titolo di una categoria
 */
export const calculateCategoryTitleHeight = (
  category: Category,
  language: string,
  layout: PrintLayout | null | undefined
): number => {
  if (!layout || !layout.elements.category.visible) {
    return 0;
  }
  
  // Calcolo base dell'altezza del titolo categoria
  const fontSize = layout.elements.category.fontSize || 14;
  const marginTop = layout.elements.category.margin.top || 0;
  const marginBottom = layout.spacing.categoryTitleBottomMargin || 5;
  
  // Conversione da pt a mm (approssimativa)
  const fontSizeMM = fontSize * 0.35;
  
  // Altezza totale del titolo categoria
  return fontSizeMM + marginTop + marginBottom;
};

/**
 * Calcola l'altezza di un prodotto in base al suo schema
 */
export const calculateProductHeight = (
  product: Product,
  language: string,
  layout: PrintLayout | null | undefined
): number => {
  if (!layout) {
    return 20; // Altezza predefinita
  }
  
  // Usa il corretto calcolo dell'altezza in base allo schema del prodotto
  if (isSchema2Layout(layout)) {
    return calculateSchema2ProductHeight(product, language, layout);
  }
  else if (isSchema3Layout(layout)) {
    return calculateSchema3ProductHeight(product, language, layout);
  }
  
  // Default: Schema 1 (classico)
  return calculateSchema1ProductHeight(product, language, layout);
};

/**
 * Calcola l'altezza di un prodotto con Schema 1 (classico)
 */
function calculateSchema1ProductHeight(
  product: Product,
  language: string,
  layout: PrintLayout
): number {
  let height = 0;
  
  // Altezza di base per la riga titolo/prezzo
  const titleFontSize = layout.elements.title.fontSize * 0.35; // Conversione pt a mm
  const titleMarginTop = layout.elements.title.margin.top || 0;
  const titleMarginBottom = layout.elements.title.margin.bottom || 0;
  
  height += titleFontSize + titleMarginTop + titleMarginBottom + 2; // +2 per padding
  
  // Aggiungi altezza per la descrizione se presente e visibile
  const hasDescription = Boolean(product[`description_${language}`] || product.description);
  if (hasDescription && layout.elements.description.visible) {
    const descFontSize = layout.elements.description.fontSize * 0.35;
    const descMarginTop = layout.elements.description.margin.top || 2;
    const descMarginBottom = layout.elements.description.margin.bottom || 0;
    
    height += descFontSize + descMarginTop + descMarginBottom + 1; // +1 per padding
  }
  
  // Aggiungi altezza per varianti di prezzo se presenti e visibili
  if (product.has_multiple_prices && layout.elements.priceVariants.visible) {
    const variantsFontSize = layout.elements.priceVariants.fontSize * 0.35;
    const variantsMarginTop = layout.elements.priceVariants.margin.top || 1;
    const variantsMarginBottom = layout.elements.priceVariants.margin.bottom || 0;
    
    height += variantsFontSize + variantsMarginTop + variantsMarginBottom + 1; // +1 per padding
  }
  
  // Aggiungi lo spazio tra prodotti
  height += layout.spacing.betweenProducts || 5;
  
  return height;
}

/**
 * Calcola l'altezza di un prodotto con Schema 2 (compatto)
 */
function calculateSchema2ProductHeight(
  product: Product,
  language: string,
  layout: PrintLayout
): number {
  let height = 0;
  
  // Riga 1: Titolo e prezzo con bordo inferiore
  const titleFontSize = layout.elements.title.fontSize * 0.35; // Conversione pt a mm
  const titleMarginTop = layout.elements.title.margin.top || 0;
  const titleMarginBottom = layout.elements.title.margin.bottom || 0;
  
  height += titleFontSize + titleMarginTop + titleMarginBottom + 3; // +3 per il bordo inferiore e padding
  
  // Riga 2: Allergeni e varianti di prezzo
  const hasAllergens = product.allergens && product.allergens.length > 0;
  const hasFeatures = product.features && product.features.length > 0;
  
  if ((hasAllergens || hasFeatures) && layout.elements.allergensList.visible) {
    const allergensFontSize = layout.elements.allergensList.fontSize * 0.35;
    const allergensMarginTop = layout.elements.allergensList.margin.top || 1;
    const allergensMarginBottom = layout.elements.allergensList.margin.bottom || 0;
    
    height += allergensFontSize + allergensMarginTop + allergensMarginBottom + 1; // +1 per padding
  }
  
  // Se ci sono varianti di prezzo ma non allergeni, considera comunque lo spazio
  if (!hasAllergens && product.has_multiple_prices && layout.elements.priceVariants.visible) {
    const variantsFontSize = layout.elements.priceVariants.fontSize * 0.35;
    height += variantsFontSize + 2; // +2 per padding
  }
  
  // Riga 3: Descrizione
  const hasDescription = Boolean(product[`description_${language}`] || product.description);
  if (hasDescription && layout.elements.description.visible) {
    const descFontSize = layout.elements.description.fontSize * 0.35;
    const descMarginTop = layout.elements.description.margin.top || 1;
    const descMarginBottom = layout.elements.description.margin.bottom || 0;
    
    height += descFontSize + descMarginTop + descMarginBottom + 1; // +1 per padding
  }
  
  // Aggiungi lo spazio tra prodotti
  height += layout.spacing.betweenProducts || 5;
  
  return height;
}

/**
 * Calcola l'altezza di un prodotto con Schema 3
 */
function calculateSchema3ProductHeight(
  product: Product,
  language: string,
  layout: PrintLayout
): number {
  let height = 0;
  
  // Schema 3: layout a scheda
  // Titolo
  const titleFontSize = layout.elements.title.fontSize * 0.35; // Conversione pt a mm
  height += titleFontSize + 2; // +2 per padding
  
  // Descrizione
  const hasDescription = Boolean(product[`description_${language}`] || product.description);
  if (hasDescription && layout.elements.description.visible) {
    const descFontSize = layout.elements.description.fontSize * 0.35;
    height += descFontSize + 2; // +2 per margine
  }
  
  // Footer della scheda (prezzo, allergeni, varianti)
  height += 12; // Altezza base del footer della scheda
  
  // Aggiungi lo spazio tra prodotti
  height += layout.spacing.betweenProducts || 5;
  
  return height;
}

/**
 * Calcola l'altezza totale di una categoria con tutti i suoi prodotti
 */
export const calculateCategoryWithProductsHeight = (
  category: Category,
  products: Product[],
  language: string,
  layout: PrintLayout | null | undefined
): number => {
  // Altezza del titolo categoria
  const categoryHeight = calculateCategoryTitleHeight(category, language, layout);
  
  // Somma altezze di tutti i prodotti
  const productsHeight = products.reduce(
    (totalHeight, product) => totalHeight + calculateProductHeight(product, language, layout),
    0
  );
  
  return categoryHeight + productsHeight;
};
