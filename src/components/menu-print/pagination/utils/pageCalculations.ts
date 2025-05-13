import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";

// Fattore di conversione più preciso da millimetri a pixel
// Incrementato leggermente rispetto al precedente per migliorare la precisione
const MM_TO_PX = 3.85;

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
  let safetyMargin = 20; // Valore predefinito per il margine di sicurezza
  
  if (customLayout) {
    if (customLayout.page.useDistinctMarginsForPages) {
      if (pageIndex % 2 === 0) {
        // Pagina dispari (1,3,5)
        marginTop = customLayout.page.oddPages?.marginTop || customLayout.page.marginTop;
        marginBottom = customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom;
        safetyMargin = marginBottom; // Imposta il margine di sicurezza uguale al margine inferiore
      } else {
        // Pagina pari (2,4,6)
        marginTop = customLayout.page.evenPages?.marginTop || customLayout.page.marginTop;
        marginBottom = customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom;
        safetyMargin = marginBottom; // Imposta il margine di sicurezza uguale al margine inferiore
      }
    } else {
      marginTop = customLayout.page.marginTop;
      marginBottom = customLayout.page.marginBottom;
      safetyMargin = marginBottom; // Imposta il margine di sicurezza uguale al margine inferiore
    }
  }
  
  // Sottraiamo un margine di sicurezza pari al margine inferiore per evitare di riempire troppo la pagina
  return (A4_HEIGHT_MM - marginTop - marginBottom - safetyMargin) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 35; // Valore aumentato per sicurezza
  
  // Aumentiamo il fattore di scala per garantire spazio sufficiente
  const baseFontSize = customLayout.elements.category.fontSize * 1.6; 
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin;
  
  return (baseFontSize + marginBottom) * 1.3; // Aumentato il fattore moltiplicativo
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
): number => {
  // Altezza base aumentata per tutti i prodotti
  let height = 35;
  
  // Incrementa altezza se c'è una descrizione
  const hasDescription = !!product.description || !!product[`description_${language}`];
  if (hasDescription) {
    const descriptionText = (product[`description_${language}`] as string) || product.description || "";
    const descriptionLength = descriptionText.length;
    
    // Stima più precisa dell'altezza della descrizione in base alla lunghezza del testo
    if (descriptionLength > 200) {
      height += 70; // Aumentato per descrizioni molto lunghe
    } else if (descriptionLength > 100) {
      height += 45; // Aumentato per descrizioni lunghe
    } else if (descriptionLength > 50) {
      height += 30; // Aumentato per descrizioni medie
    } else {
      height += 20; // Aumentato per descrizioni brevi
    }
  }
  
  // Aumenta altezza per varianti di prezzo multiple
  if (product.has_multiple_prices) {
    height += 25; // Aumentato da 20 a 25
  }
  
  // Aumenta altezza se il prodotto ha allergeni
  if (product.allergens && product.allergens.length > 0) {
    height += 15; // Aumentato da 10 a 15
  }
  
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
