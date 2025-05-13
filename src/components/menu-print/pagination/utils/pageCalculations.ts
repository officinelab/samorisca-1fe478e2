
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
  
  // Sottrai un piccolo margine di sicurezza per evitare di riempire troppo la pagina
  const safetyMargin = 5; // 5mm di margine di sicurezza
  return (A4_HEIGHT_MM - marginTop - marginBottom - safetyMargin) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 30;
  
  // Aumenta leggermente il valore per assicurarsi che ci sia spazio sufficiente
  const baseFontSize = customLayout.elements.category.fontSize * 1.5;
  const marginTop = customLayout.elements.category.margin.top || 0;
  const marginBottom = customLayout.elements.category.margin.bottom || 0;
  const categoryBottomMargin = customLayout.spacing.categoryTitleBottomMargin || 5;
  
  return (baseFontSize + marginTop + marginBottom + categoryBottomMargin) * 1.2;
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche
 * Versione migliorata per considerare tutti gli elementi
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
  customLayout?: PrintLayout | null
): number => {
  if (!customLayout) {
    // Calcolo di base senza layout personalizzato
    let height = 30; // Altezza base per tutti i prodotti
    
    // Incrementa l'altezza se c'è una descrizione
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
    
    // Incrementa l'altezza per varianti di prezzo multiple
    if (product.has_multiple_prices) {
      height += 20;
    }
    
    // Incrementa l'altezza se il prodotto ha allergeni
    if (product.allergens && product.allergens.length > 0) {
      height += 10;
    }
    
    return height;
  }
  
  // Calcolo avanzato con layout personalizzato
  let totalHeight = 0;
  
  // Titolo del prodotto
  if (customLayout.elements.title.visible !== false) {
    const titleConfig = customLayout.elements.title;
    const titleFontSize = titleConfig.fontSize;
    totalHeight += titleFontSize * 1.5; // 1.5x l'altezza del font come approssimazione
    totalHeight += (titleConfig.margin.top + titleConfig.margin.bottom);
  }
  
  // Descrizione del prodotto (se presente)
  const descriptionText = (product[`description_${language}`] as string) || product.description || "";
  if (customLayout.elements.description.visible !== false && descriptionText) {
    const descConfig = customLayout.elements.description;
    const descFontSize = descConfig.fontSize;
    
    // Stima il numero di righe in base alla lunghezza del testo
    const averageCharsPerLine = 80; // Approssimativo
    const estimatedLines = Math.ceil(descriptionText.length / averageCharsPerLine);
    
    // Calcola l'altezza della descrizione
    const lineHeight = descFontSize * 1.2; // Interlinea standard
    totalHeight += lineHeight * estimatedLines;
    totalHeight += (descConfig.margin.top + descConfig.margin.bottom);
  }
  
  // Prezzo e varianti
  if (customLayout.elements.price.visible !== false) {
    const priceConfig = customLayout.elements.price;
    totalHeight += priceConfig.fontSize * 1.2;
    totalHeight += (priceConfig.margin.top + priceConfig.margin.bottom);
  }
  
  // Varianti di prezzo (se presenti)
  if (customLayout.elements.priceVariants.visible !== false && product.has_multiple_prices) {
    const variantsConfig = customLayout.elements.priceVariants;
    totalHeight += variantsConfig.fontSize * 1.2;
    totalHeight += (variantsConfig.margin.top + variantsConfig.margin.bottom);
  }
  
  // Allergeni (se presenti)
  if (customLayout.elements.allergensList.visible !== false && product.allergens && product.allergens.length > 0) {
    const allergensConfig = customLayout.elements.allergensList;
    totalHeight += allergensConfig.fontSize * 1.2;
    totalHeight += (allergensConfig.margin.top + allergensConfig.margin.bottom);
  }
  
  // Aggiungi la spaziatura tra i prodotti
  totalHeight += customLayout.spacing.betweenProducts;
  
  // Aggiungi un margine di sicurezza (10%)
  totalHeight *= 1.1;
  
  // Converti in pixel
  return totalHeight * MM_TO_PX;
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
 * Visualizza il margine di sicurezza (utile per debug)
 */
export const getSafetyMarginStyle = (showMargin: boolean = true) => {
  if (!showMargin) return {};
  
  return {
    position: 'absolute' as React.CSSProperties['position'],
    bottom: '5mm',
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
