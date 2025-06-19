import { Category, Product } from '@/types/database';
import { getProductHeight } from '@/components/menu-print/pagination/utils';

/**
 * Calcola l'altezza stimata di una categoria in base ai suoi prodotti
 * @param category La categoria di cui calcolare l'altezza
 * @param products I prodotti appartenenti alla categoria
 * @param language Il codice della lingua (opzionale)
 * @param customLayout Il layout di stampa personalizzato (opzionale)
 * @param pageIndex L'indice della pagina (opzionale)
 * @returns L'altezza stimata in pixel
 */
export const calculateCategoryHeight = (
  category: Category, 
  products: Product[],
  language: string = 'it',
  customLayout?: import('@/types/printLayout').PrintLayout | null,
  pageIndex: number = 0
): number => {
  // Altezza base per il titolo della categoria
  const categoryTitleHeight = 60; // Altezza stimata per il titolo della categoria

  // Calcola l'altezza totale di tutti i prodotti nella categoria
  const productsHeight = products.reduce((totalHeight, product) => {
    // Usa la funzione di calcolo dell'altezza del prodotto dalla utility esistente
    // We need to match signature: getProductHeight(product, language, customLayout, pageIndex)
    const productHeight = getProductHeight(product, language, customLayout, pageIndex);
    return totalHeight + productHeight;
  }, 0);

  // Aggiungi un po' di spazio extra per i margini tra i prodotti
  const marginsBetweenProducts = Math.max(0, products.length - 1) * 15;
  
  // Calcola l'altezza totale della categoria
  const totalHeight = categoryTitleHeight + productsHeight + marginsBetweenProducts;
  
  return totalHeight;
};

/**
 * Calcola l'altezza totale di una pagina contenente più categorie
 * @param categories Le categorie nella pagina
 * @param products I prodotti organizzati per categoria
 * @param language Il codice della lingua (opzionale)
 * @returns L'altezza totale stimata in pixel
 */
export const calculatePageHeight = (
  categories: Category[], 
  products: Record<string, Product[]>,
  language: string = 'it'
): number => {
  // Calcola l'altezza di tutte le categorie nella pagina
  const totalHeight = categories.reduce((height, category) => {
    const categoryProducts = products[category.id] || [];
    const categoryHeight = calculateCategoryHeight(category, categoryProducts, language);
    return height + categoryHeight;
  }, 0);

  // Aggiungi spazio per i margini tra le categorie
  const marginsBetweenCategories = Math.max(0, categories.length - 1) * 30;
  
  return totalHeight + marginsBetweenCategories;
};

/**
 * Stima se una categoria può adattarsi in una pagina con un'altezza massima specificata
 * @param category La categoria da valutare
 * @param products I prodotti della categoria
 * @param maxHeight L'altezza massima disponibile in pixel
 * @param language Il codice della lingua (opzionale)
 * @returns true se la categoria può adattarsi, false altrimenti
 */
export const canCategoryFitPage = (
  category: Category,
  products: Product[],
  maxHeight: number,
  language: string = 'it'
): boolean => {
  const categoryHeight = calculateCategoryHeight(category, products, language);
  return categoryHeight <= maxHeight;
};
