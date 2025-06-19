
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";

// Costanti per le dimensioni A4 in pixel (96 DPI)
export const MM_TO_PX = 3.7795275591; // 1mm = 3.78px @ 96DPI
export const A4_HEIGHT_PX = 297 * MM_TO_PX; // 1122.52px
export const A4_WIDTH_PX = 210 * MM_TO_PX; // 793.7px

/**
 * Calcola l'altezza disponibile effettiva per il contenuto in una pagina.
 * Gestisce la distinzione pari/dispari con i margini coerenti fra JS e CSS.
 */
export const calculateAvailableHeight = (
  pageIndex: number,
  A4_HEIGHT_MM: number,
  customLayout?: PrintLayout | null,
  pageContainerRef?: HTMLElement | null
): number => {
  if (!customLayout?.page) {
    // Default margins di 25mm per tutti i lati
    return (A4_HEIGHT_MM - 50) * MM_TO_PX; // 50mm di margini totali (25 sopra + 25 sotto)
  }

  let topMargin: number;
  let bottomMargin: number;

  // Determina i margini in base al tipo di pagina e all'indice
  if (customLayout.page.useDistinctMarginsForPages) {
    // Le pagine pari/dispari hanno margini diversi
    const isOddPage = pageIndex % 2 === 1;
    if (isOddPage) {
      topMargin = customLayout.page.oddPages.marginTop;
      bottomMargin = customLayout.page.oddPages.marginBottom;
    } else {
      topMargin = customLayout.page.evenPages.marginTop;
      bottomMargin = customLayout.page.evenPages.marginBottom;
    }
  } else {
    // Usa i margini standard per tutte le pagine
    topMargin = customLayout.page.marginTop;
    bottomMargin = customLayout.page.marginBottom;
  }

  // Calcola l'altezza disponibile in pixel
  const availableHeightMm = A4_HEIGHT_MM - topMargin - bottomMargin;
  return availableHeightMm * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria basandosi sul layout e DOM reale.
 */
export const estimateCategoryTitleHeight = (
  category: Category,
  language: string,
  customLayout: PrintLayout | null | undefined,
  pageIndex: number
): number => {
  if (!customLayout?.elements?.category) {
    // Fallback: stima basata su font size standard
    return 60 * MM_TO_PX; // ~60mm di default
  }

  const categoryConfig = customLayout.elements.category;
  const spacing = customLayout.spacing;
  
  // Calcola l'altezza basata su:
  // 1. Font size
  // 2. Line height (assumiamo 1.5x del font size)
  // 3. Margini
  // 4. Spacing sotto il titolo categoria
  
  const fontSize = categoryConfig.fontSize || 16;
  const lineHeight = fontSize * 1.5;
  const margins = categoryConfig.margin;
  
  // Altezza totale in pixel
  let totalHeight = lineHeight; // Altezza del testo
  totalHeight += (margins.top + margins.bottom) * MM_TO_PX; // Margini in mm convertiti in px
  totalHeight += (spacing?.categoryTitleBottomMargin || 10) * MM_TO_PX; // Spacing sotto categoria
  
  return totalHeight;
};

/**
 * Calcola l'altezza reale di un prodotto basandosi sul layout e contenuto.
 */
export const getProductHeight = (
  product: Product,
  language: string,
  customLayout: PrintLayout | null | undefined,
  pageIndex: number
): number => {
  if (!customLayout?.elements) {
    // Fallback: stima basata su contenuto tipico
    return 80 * MM_TO_PX; // ~80mm di default
  }

  const elements = customLayout.elements;
  let totalHeight = 0;

  // 1. Titolo prodotto
  if (elements.title?.visible !== false) {
    const titleFontSize = elements.title.fontSize || 14;
    const titleLineHeight = titleFontSize * 1.5;
    const titleMargins = elements.title.margin;
    totalHeight += titleLineHeight + (titleMargins.top + titleMargins.bottom) * MM_TO_PX;
  }

  // 2. Descrizione prodotto (può essere multilinea)
  if (elements.description?.visible !== false && product.description) {
    const descFontSize = elements.description.fontSize || 12;
    const descLineHeight = descFontSize * 1.4;
    const descMargins = elements.description.margin;
    
    // Stima il numero di righe basandosi sulla lunghezza del testo
    // Assumiamo ~80 caratteri per riga
    const estimatedLines = Math.ceil((product.description.length || 0) / 80);
    totalHeight += (descLineHeight * estimatedLines) + (descMargins.top + descMargins.bottom) * MM_TO_PX;
  }

  // 3. Descrizione inglese (se presente e visibile)
  if (elements.descriptionEng?.visible !== false && product.descriptionEng) {
    const descEngFontSize = elements.descriptionEng.fontSize || 11;
    const descEngLineHeight = descEngFontSize * 1.4;
    const descEngMargins = elements.descriptionEng.margin;
    
    const estimatedLines = Math.ceil((product.descriptionEng.length || 0) / 80);
    totalHeight += (descEngLineHeight * estimatedLines) + (descEngMargins.top + descEngMargins.bottom) * MM_TO_PX;
  }

  // 4. Lista allergeni
  if (elements.allergensList?.visible !== false && product.allergens?.length > 0) {
    const allergensFontSize = elements.allergensList.fontSize || 10;
    const allergensLineHeight = allergensFontSize * 1.5;
    const allergensMargins = elements.allergensList.margin;
    totalHeight += allergensLineHeight + (allergensMargins.top + allergensMargins.bottom) * MM_TO_PX;
  }

  // 5. Caratteristiche prodotto (icone)
  if (elements.productFeatures && hasProductFeatures(product)) {
    const featuresConfig = elements.productFeatures;
    totalHeight += featuresConfig.iconSize + (featuresConfig.marginTop + featuresConfig.marginBottom) * MM_TO_PX;
  }

  // 6. Prezzo
  if (elements.price?.visible !== false) {
    const priceFontSize = elements.price.fontSize || 14;
    const priceLineHeight = priceFontSize * 1.5;
    const priceMargins = elements.price.margin;
    totalHeight += priceLineHeight + (priceMargins.top + priceMargins.bottom) * MM_TO_PX;
  }

  // 7. Varianti prezzo (se presenti)
  if (elements.priceVariants?.visible !== false && product.priceVariants?.length > 0) {
    const variantsFontSize = elements.priceVariants.fontSize || 12;
    const variantsLineHeight = variantsFontSize * 1.5;
    const variantsMargins = elements.priceVariants.margin;
    
    // Ogni variante su una riga
    totalHeight += (variantsLineHeight * product.priceVariants.length) + 
                   (variantsMargins.top + variantsMargins.bottom) * MM_TO_PX;
  }

  // 8. Spacing tra prodotti
  const spacing = customLayout.spacing?.betweenProducts || 15;
  totalHeight += spacing * MM_TO_PX;

  return totalHeight;
};

/**
 * Verifica se un prodotto ha caratteristiche speciali (icone)
 */
const hasProductFeatures = (product: Product): boolean => {
  return !!(
    product.isVegan ||
    product.isGlutenFree ||
    product.isSpicy ||
    product.isFrozen ||
    product.isNew ||
    product.hasAlcohol
  );
};

/**
 * Filtra le categorie selezionate dall'elenco completo
 */
export const getFilteredCategories = (
  categories: Category[],
  selectedCategories: string[]
): Category[] => {
  return categories.filter(cat => selectedCategories.includes(cat.id));
};

/**
 * Calcola l'altezza di un elemento DOM reale (per misurazione precisa)
 */
export const measureElementHeight = (element: HTMLElement): number => {
  if (!element) return 0;
  
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  const marginTop = parseFloat(computedStyle.marginTop);
  const marginBottom = parseFloat(computedStyle.marginBottom);
  
  return rect.height + marginTop + marginBottom;
};
