
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";
import { measureProductHeight as dynamicMeasureProductHeight } from "@/hooks/menu-layouts/utils/textMeasurement";

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
  return (A4_HEIGHT_MM - marginTop - marginBottom - safetyMargin) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 30;
  
  // Aumenta leggermente il valore per assicurarsi che ci sia spazio sufficiente
  const baseFontSize = customLayout.elements.category.fontSize * 1.5;
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin;
  
  return (baseFontSize + marginBottom) * 1.2;
};

/**
 * Calcola l'altezza di un prodotto utilizzando Canvas per misurazioni precise
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
  customLayout?: PrintLayout | null
): number => {
  // Utilizza la funzione di misurazione dinamica del testo
  try {
    // Calcola la larghezza disponibile (approssimata in base al formato A4)
    // Un foglio A4 è circa 210mm di larghezza, sottraiamo i margini laterali
    const marginLeft = customLayout?.page.marginLeft || 15;
    const marginRight = customLayout?.page.marginRight || 15;
    const availableWidthMM = 210 - marginLeft - marginRight;
    const availableWidthPx = availableWidthMM * MM_TO_PX;
    
    // Configura le impostazioni dei font in base al layout
    const fontSettings = customLayout ? {
      titleFont: {
        family: customLayout.elements.title.fontFamily || 'Arial',
        size: customLayout.elements.title.fontSize || 12,
        weight: customLayout.elements.title.fontStyle === 'bold' ? 'bold' : 'normal',
        style: customLayout.elements.title.fontStyle === 'italic' ? 'italic' : 'normal'
      },
      descriptionFont: {
        family: customLayout.elements.description.fontFamily || 'Arial',
        size: customLayout.elements.description.fontSize || 10,
        weight: customLayout.elements.description.fontStyle === 'bold' ? 'bold' : 'normal',
        style: customLayout.elements.description.fontStyle === 'italic' ? 'italic' : 'normal'
      }
    } : undefined;
    
    // Misura l'altezza precisa del prodotto
    return dynamicMeasureProductHeight(product, language, availableWidthPx, fontSettings);
  } catch (error) {
    console.error('Errore nella misurazione dinamica del prodotto:', error);
    
    // Fallback al metodo precedente in caso di errori
    // Base height for all products
    let height = 30;
    
    // Increase height if there's a description
    const hasDescription = !!product.description || !!product[`description_${language}`];
    if (hasDescription) {
      const descriptionText = (product[`description_${language}`] as string) || product.description || "";
      const descriptionLength = descriptionText.length;
      
      // Stima l'altezza della descrizione in base alla lunghezza del testo
      if (descriptionLength > 200) {
        height += 60; // Descrizioni molto lunghe
      } else if (descriptionLength > 100) {
        height += 40; // Descrizioni lunghe
      } else if (descriptionLength > 50) {
        height += 25; // Descrizioni medie
      } else {
        height += 15; // Descrizioni brevi
      }
    }
    
    // Increase height for multiple price variants
    if (product.has_multiple_prices) {
      height += 20;
    }
    
    // Increase height if product has allergens
    if (product.allergens && product.allergens.length > 0) {
      height += 10;
    }
    
    return height;
  }
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
