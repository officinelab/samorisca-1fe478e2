
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";

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
  
  // Aumentiamo il margine di sicurezza per evitare overflow
  const safetyMargin = 10;
  return (A4_HEIGHT_MM - marginTop - marginBottom - safetyMargin) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 35; // Valore di base aumentato
  
  // Miglioramento della stima dell'altezza basata sulla dimensione del font 
  const baseFontSize = customLayout.elements.category.fontSize * 1.8;
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin;
  
  // Considera lo stile del font (grassetto richiede più spazio)
  const fontStyleFactor = customLayout.elements.category.fontStyle === 'bold' ? 1.2 : 1.0;
  
  return (baseFontSize + marginBottom) * fontStyleFactor;
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche
 * con calcoli più precisi
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
  customLayout?: PrintLayout | null
): number => {
  // Dimensione del font base per il titolo
  const titleFontSize = customLayout?.elements.title.fontSize || 12;
  const descriptionFontSize = customLayout?.elements.description.fontSize || 10;
  
  // Altezza base per tutti i prodotti (titolo + prezzo)
  let height = titleFontSize * 2;
  
  // Aumenta l'altezza se c'è una descrizione
  const hasDescription = !!product.description || !!product[`description_${language}`];
  if (hasDescription) {
    const descriptionText = (product[`description_${language}`] as string) || product.description || "";
    const descriptionLength = descriptionText.length;
    const charsPerLine = 80; // Stima caratteri per linea
    const lineHeight = descriptionFontSize * 1.5; // Altezza linea
    
    // Stima il numero di linee necessarie
    const estimatedLines = Math.ceil(descriptionLength / charsPerLine);
    height += estimatedLines * lineHeight;
    
    // Aggiungi spazio extra per margini della descrizione
    height += 10;
  }
  
  // Aumenta l'altezza per varianti di prezzo multiple
  if (product.has_multiple_prices) {
    height += 25;
  }
  
  // Aumenta l'altezza se il prodotto ha allergeni
  if (product.allergens && product.allergens.length > 0) {
    height += 15;
  }
  
  // Aggiungi spazio per i margini tra prodotti
  const productSpacing = customLayout ? customLayout.spacing.betweenProducts * MM_TO_PX : 5 * MM_TO_PX;
  height += productSpacing;
  
  // Fattore di sicurezza
  height *= 1.15;
  
  return height;
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
