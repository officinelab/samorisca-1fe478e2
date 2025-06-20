
import { useMemo } from 'react';
import { Allergen, ProductFeature } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

interface AllergensPage {
  pageNumber: number;
  allergens: Allergen[];
  productFeatures: ProductFeature[];
  hasProductFeatures: boolean; // Solo l'ultima pagina avrà le caratteristiche prodotto
}

interface AllergensPaginationResult {
  pages: AllergensPage[];
  totalPages: number;
}

export const useAllergensPagination = (
  allergens: Allergen[],
  productFeatures: ProductFeature[],
  layout: PrintLayout | null
): AllergensPaginationResult => {
  
  const pages = useMemo(() => {
    if (!layout || allergens.length === 0) {
      return [];
    }

    // Calcola approssimativamente quanti allergeni possono stare in una pagina
    // Basato sulle dimensioni della pagina e sui margini
    const pageHeight = 297; // A4 height in mm
    const margins = {
      top: layout.page.allergensMarginTop || 20,
      bottom: layout.page.allergensMarginBottom || 20
    };
    
    const availableHeight = pageHeight - margins.top - margins.bottom;
    
    // Stima altezza per elemento (icona + testo + spacing)
    const estimatedItemHeight = 15; // mm per item
    const titleAndDescriptionHeight = 30; // mm per titolo e descrizione
    const productFeaturesHeight = productFeatures.length * 10; // mm per caratteristiche
    
    // Calcola quanti allergeni per pagina
    const itemsPerPage = Math.floor((availableHeight - titleAndDescriptionHeight) / estimatedItemHeight);
    
    // Se tutti gli allergeni + caratteristiche stanno in una pagina
    if (allergens.length <= itemsPerPage && 
        (availableHeight - titleAndDescriptionHeight - (allergens.length * estimatedItemHeight)) >= productFeaturesHeight) {
      return [{
        pageNumber: 1,
        allergens: allergens,
        productFeatures: productFeatures,
        hasProductFeatures: true
      }];
    }
    
    // Altrimenti, distribuisci su più pagine
    const result: AllergensPage[] = [];
    let currentPage = 1;
    let currentIndex = 0;
    
    while (currentIndex < allergens.length) {
      const isFirstPage = currentPage === 1;
      const availableForItems = isFirstPage 
        ? availableHeight - titleAndDescriptionHeight 
        : availableHeight;
      
      const itemsForThisPage = Math.floor(availableForItems / estimatedItemHeight);
      const endIndex = Math.min(currentIndex + itemsForThisPage, allergens.length);
      
      const pageAllergens = allergens.slice(currentIndex, endIndex);
      const isLastPage = endIndex === allergens.length;
      
      // Verifica se le caratteristiche prodotto possono stare nell'ultima pagina
      const remainingHeight = availableForItems - (pageAllergens.length * estimatedItemHeight);
      const canFitProductFeatures = isLastPage && remainingHeight >= productFeaturesHeight;
      
      result.push({
        pageNumber: currentPage,
        allergens: pageAllergens,
        productFeatures: canFitProductFeatures ? productFeatures : [],
        hasProductFeatures: canFitProductFeatures
      });
      
      // Se non possiamo mettere le caratteristiche nell'ultima pagina, crea una pagina separata
      if (isLastPage && !canFitProductFeatures && productFeatures.length > 0) {
        result.push({
          pageNumber: currentPage + 1,
          allergens: [],
          productFeatures: productFeatures,
          hasProductFeatures: true
        });
      }
      
      currentIndex = endIndex;
      currentPage++;
    }
    
    return result;
  }, [allergens, productFeatures, layout]);

  return {
    pages,
    totalPages: pages.length
  };
};
