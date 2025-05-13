
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
  
  // Sottrai un margine di sicurezza maggiore per evitare di riempire troppo la pagina
  const safetyMargin = 10;
  return (A4_HEIGHT_MM - marginTop - marginBottom - safetyMargin) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 35; // Valore di base aumentato
  
  // Aumenta leggermente il valore per assicurarsi che ci sia spazio sufficiente
  const baseFontSize = customLayout.elements.category.fontSize * 1.8;
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin;
  const marginTop = customLayout.elements.category.margin.top || 0;
  
  return (baseFontSize + marginBottom + marginTop + 5) * 1.2;
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche
 * Migliorata per considerare anche le impostazioni di layout
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
  customLayout?: PrintLayout | null
): number => {
  // Altezza base migliorata per tutti i prodotti
  let height = 35;
  
  // Considera la dimensione del font del titolo
  if (customLayout?.elements.title) {
    height += customLayout.elements.title.fontSize * 1.2;
  }
  
  // Aumenta l'altezza se c'è una descrizione
  const hasDescription = !!product.description || !!product[`description_${language}`];
  if (hasDescription) {
    const descriptionText = (product[`description_${language}`] as string) || product.description || "";
    const descriptionLength = descriptionText.length;
    
    // Considera anche lo stile della descrizione dal layout
    const descriptionFontSize = customLayout?.elements.description.fontSize || 10;
    const descriptionFontFactor = descriptionFontSize / 10; // Normalizza rispetto a 10pt
    
    // Stima l'altezza della descrizione in base alla lunghezza del testo e allo stile
    if (descriptionLength > 200) {
      height += 75 * descriptionFontFactor; // Descrizioni molto lunghe
    } else if (descriptionLength > 100) {
      height += 50 * descriptionFontFactor; // Descrizioni lunghe
    } else if (descriptionLength > 50) {
      height += 30 * descriptionFontFactor; // Descrizioni medie
    } else {
      height += 20 * descriptionFontFactor; // Descrizioni brevi
    }
  }
  
  // Aumenta l'altezza per varianti di prezzo multiple
  if (product.has_multiple_prices) {
    const variantFontSize = customLayout?.elements.priceVariants.fontSize || 10;
    height += 20 + (variantFontSize - 10) * 1.5; // Aggiungi extra per font più grandi
  }
  
  // Aumenta l'altezza se il prodotto ha allergeni
  if (product.allergens && product.allergens.length > 0) {
    const allergenFontSize = customLayout?.elements.allergensList.fontSize || 10;
    height += 15 + (allergenFontSize - 10) * 1.5;
  }
  
  // Aggiungi un margine di sicurezza extra
  height += 10;
  
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
