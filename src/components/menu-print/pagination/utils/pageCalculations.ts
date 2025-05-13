
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";
import { measureTextHeight } from "@/hooks/print/utils/textMeasurementUtils";

// Fattore di conversione più preciso da millimetri a pixel
const MM_TO_PX = 3.78;

/**
 * Calcola l'altezza disponibile per il contenuto (rispettando i margini)
 */
export const calculateAvailableHeight = (
  pageIndex: number, 
  A4_HEIGHT_MM: number, 
  customLayout?: PrintLayout | null
): number => {
  let marginTop = 20;
  let marginBottom = 20;
  
  if (customLayout) {
    if (customLayout.page.useDistinctMarginsForPages) {
      if (pageIndex % 2 === 0) {
        // Pagina dispari (1,3,5)
        marginTop = customLayout.page.oddPages?.marginTop || customLayout.page.marginTop;
        marginBottom = customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom;
      } else {
        // Pagina pari (2,4,6)
        marginTop = customLayout.page.evenPages?.marginTop || customLayout.page.marginTop;
        marginBottom = customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom;
      }
    } else {
      marginTop = customLayout.page.marginTop;
      marginBottom = customLayout.page.marginBottom;
    }
  }
  
  // Sottrai un piccolo margine di sicurezza per evitare di riempire troppo la pagina
  const safetyMargin = 5;
  return A4_HEIGHT_MM - marginTop - marginBottom - safetyMargin;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout utilizzando Canvas API
 */
export const estimateCategoryTitleHeight = (
  category: Category,
  language: string,
  customLayout?: PrintLayout | null
): number => {
  if (!customLayout) return 10; // Valore predefinito in mm
  
  const title = (category[`title_${language}`] as string) || category.title || "";
  const fontSize = customLayout.elements.category.fontSize || 18;
  const fontFamily = customLayout.elements.category.fontFamily || 'Arial';
  const isBold = customLayout.elements.category.fontStyle === 'bold';
  const isItalic = customLayout.elements.category.fontStyle === 'italic';
  
  // Calcola la larghezza disponibile per il titolo
  let availableWidth = 180; // Valore predefinito A4 meno margini standard
  
  if (customLayout.page) {
    availableWidth = 210 - customLayout.page.marginLeft - customLayout.page.marginRight;
  }
  
  // Usa l'API Canvas per misurare l'altezza del testo
  const textHeight = measureTextHeight(
    title,
    fontFamily,
    fontSize,
    availableWidth,
    isBold,
    isItalic
  );
  
  // Aggiungi margini e spaziatura
  const marginTop = customLayout.elements.category.margin.top || 0;
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin || 5;
  
  return textHeight + marginTop + marginBottom;
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche utilizzando Canvas API
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
  customLayout?: PrintLayout | null
): number => {
  if (!customLayout) {
    // Altezza base predefinita
    return 15;
  }
  
  // Calcola larghezza disponibile
  const availableWidth = 210 - customLayout.page.marginLeft - customLayout.page.marginRight;
  
  // Misura l'altezza del titolo
  const title = (product[`title_${language}`] as string) || product.title || "";
  const titleFontSize = customLayout.elements.title.fontSize || 12;
  const titleFontFamily = customLayout.elements.title.fontFamily || 'Arial';
  const isTitleBold = customLayout.elements.title.fontStyle === 'bold';
  const isTitleItalic = customLayout.elements.title.fontStyle === 'italic';
  
  const titleHeight = measureTextHeight(
    title,
    titleFontFamily,
    titleFontSize,
    availableWidth * 0.7, // Il titolo occupa circa il 70% della larghezza disponibile
    isTitleBold,
    isTitleItalic
  );
  
  // Misura l'altezza della descrizione (se presente)
  let descriptionHeight = 0;
  const description = (product[`description_${language}`] as string) || product.description || "";
  
  if (description && customLayout.elements.description.visible) {
    const descFontSize = customLayout.elements.description.fontSize || 10;
    const descFontFamily = customLayout.elements.description.fontFamily || 'Arial';
    const isDescBold = customLayout.elements.description.fontStyle === 'bold';
    const isDescItalic = customLayout.elements.description.fontStyle === 'italic';
    
    descriptionHeight = measureTextHeight(
      description,
      descFontFamily,
      descFontSize,
      availableWidth * 0.95, // La descrizione può occupare fino al 95% della larghezza
      isDescBold,
      isDescItalic
    );
    
    // Aggiungi un margine sopra la descrizione
    descriptionHeight += 2;
  }
  
  // Aggiungi altezza per le varianti di prezzo (se presenti)
  let priceVariantsHeight = 0;
  if (product.has_multiple_prices && customLayout.elements.priceVariants.visible) {
    priceVariantsHeight = 5;
  }
  
  // Aggiungi altezza per gli allergeni (se presenti)
  let allergensHeight = 0;
  if (product.allergens && product.allergens.length > 0 && customLayout.elements.allergensList.visible) {
    allergensHeight = 3;
  }
  
  // Aggiungi lo spazio tra prodotti
  const betweenProductsSpace = customLayout.spacing.betweenProducts || 5;
  
  // Calcola l'altezza totale del prodotto
  const totalHeight = titleHeight + descriptionHeight + priceVariantsHeight + allergensHeight + betweenProductsSpace;
  
  // Aggiungi un margine di sicurezza
  return totalHeight * 1.1;
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
