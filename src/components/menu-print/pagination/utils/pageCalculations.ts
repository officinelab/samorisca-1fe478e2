
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";

// Fattore di conversione più preciso da millimetri a pixel
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
  
  // Usa esattamente l'altezza disponibile (margine inferiore preciso) senza margini di sicurezza aggiuntivi
  return (A4_HEIGHT_MM - marginTop - marginBottom) * MM_TO_PX;
};

/**
 * Stima l'altezza di un titolo categoria in base al layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 35; // Valore di default aumentato per sicurezza
  
  // Aumentiamo il fattore di scala per garantire spazio sufficiente
  const baseFontSize = customLayout.elements.category.fontSize * 1.6; 
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin;
  
  return (baseFontSize + marginBottom) * 1.3; // Fattore moltiplicativo aumentato
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
    
    // Stima più precisa dell'altezza della descrizione basata sulla lunghezza del testo
    if (descriptionLength > 200) {
      height += 70; // Per descrizioni molto lunghe
    } else if (descriptionLength > 100) {
      height += 45; // Per descrizioni lunghe
    } else if (descriptionLength > 50) {
      height += 30; // Per descrizioni medie
    } else {
      height += 20; // Per descrizioni brevi
    }
  }
  
  // Aumenta altezza per varianti di prezzo multiple
  if (product.has_multiple_prices) {
    height += 25;
  }
  
  // Aumenta altezza se il prodotto ha allergeni
  if (product.allergens && product.allergens.length > 0) {
    height += 15;
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
