
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
  
  // Prendiamo il font size della categoria come base
  const fontSize = customLayout.elements.category.fontSize || 16;
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin || 5;
  
  // Altezza base in base al font size + margini
  return (fontSize * 1.5) + (marginBottom * MM_TO_PX); 
};

/**
 * Stima l'altezza di un prodotto in base alle sue caratteristiche e al layout
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
  customLayout?: PrintLayout | null,
): number => {
  // Ottieni i font size dal layout o usa valori di default
  const titleFontSize = customLayout?.elements.title.fontSize || 12;
  const descriptionFontSize = customLayout?.elements.description.fontSize || 10;
  const allergensFontSize = customLayout?.elements.allergensList.fontSize || 10;
  const priceVariantsFontSize = customLayout?.elements.priceVariants.fontSize || 10;
  
  // Altezza base per l'intestazione (titolo + prezzo) che è sempre presente
  // La altezza base dipende dalla dimensione del font del titolo
  let height = titleFontSize * 2.2;
  
  // Incrementa altezza se c'è una descrizione
  const hasDescription = !!product.description || !!product[`description_${language}`];
  if (hasDescription) {
    const descriptionText = (product[`description_${language}`] as string) || product.description || "";
    const descriptionLength = descriptionText.length;
    
    // Calcolo più preciso in base alla lunghezza del testo e alla dimensione del font
    const lineHeight = descriptionFontSize * 1.5; // Altezza di una linea di testo
    const charsPerLine = 90; // Caratteri approssimati per linea a 10pt
    const estimatedLines = Math.ceil(descriptionLength / charsPerLine);
    
    height += estimatedLines * lineHeight;
    
    // Aggiungi un po' di spazio per il margine tra titolo e descrizione
    height += 8;
  }
  
  // Spazio aggiuntivo se ci sono allergeni
  if (product.allergens && product.allergens.length > 0) {
    height += allergensFontSize * 1.7;
  }
  
  // Spazio aggiuntivo per varianti di prezzo
  if (product.has_multiple_prices) {
    const variantsCount = (product.price_variant_1_name ? 1 : 0) + 
                         (product.price_variant_2_name ? 1 : 0);
    height += priceVariantsFontSize * 1.8 * variantsCount;
  }
  
  // Considera lo spazio tra prodotti definito nel layout
  const betweenProductsSpace = customLayout?.spacing?.betweenProducts || 5;
  height += betweenProductsSpace * MM_TO_PX / 2; // Solo metà dello spazio perché l'altra metà è già considerata nel prodotto successivo
  
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
