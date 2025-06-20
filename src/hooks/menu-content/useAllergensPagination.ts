
import { useMemo } from 'react';
import { Allergen, ProductFeature } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

interface AllergensPage {
  pageNumber: number;
  allergens: Allergen[];
  productFeatures: ProductFeature[];
  hasProductFeatures: boolean;
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
    if (!layout) {
      return [];
    }

    // Se non ci sono allergeni né caratteristiche, non creare pagine
    if (allergens.length === 0 && productFeatures.length === 0) {
      return [];
    }

    // Calcola approssimativamente quanti allergeni possono stare in una pagina
    const pageHeight = 297; // A4 height in mm
    const margins = {
      top: layout.page.allergensMarginTop || 20,
      bottom: layout.page.allergensMarginBottom || 20
    };
    
    const availableHeight = pageHeight - margins.top - margins.bottom;
    
    // Stima altezza per elemento
    const estimatedAllergenHeight = 18; // mm per allergene (icona + testo + spacing)
    const estimatedProductFeatureHeight = 12; // mm per caratteristica prodotto
    const titleAndDescriptionHeight = 35; // mm per titolo e descrizione allergeni
    const sectionSpacing = 15; // mm di spazio tra sezioni allergeni e caratteristiche
    
    // Calcola altezza totale delle caratteristiche prodotto
    const totalProductFeaturesHeight = productFeatures.length * estimatedProductFeatureHeight;
    
    // Se ci sono solo caratteristiche prodotto e nessun allergene
    if (allergens.length === 0 && productFeatures.length > 0) {
      return [{
        pageNumber: 1,
        allergens: [],
        productFeatures: productFeatures,
        hasProductFeatures: true
      }];
    }
    
    // Se ci sono solo allergeni e nessuna caratteristica
    if (productFeatures.length === 0 && allergens.length > 0) {
      // Calcola quanti allergeni per pagina
      const allergensPerPage = Math.floor((availableHeight - titleAndDescriptionHeight) / estimatedAllergenHeight);
      
      if (allergens.length <= allergensPerPage) {
        // Tutti gli allergeni stanno in una pagina
        return [{
          pageNumber: 1,
          allergens: allergens,
          productFeatures: [],
          hasProductFeatures: false
        }];
      } else {
        // Distribuisci allergeni su più pagine
        const result: AllergensPage[] = [];
        let currentIndex = 0;
        let pageNumber = 1;
        
        while (currentIndex < allergens.length) {
          const isFirstPage = pageNumber === 1;
          const availableForAllergens = isFirstPage 
            ? availableHeight - titleAndDescriptionHeight 
            : availableHeight;
          const allergensForThisPage = Math.floor(availableForAllergens / estimatedAllergenHeight);
          const endIndex = Math.min(currentIndex + allergensForThisPage, allergens.length);
          
          result.push({
            pageNumber: pageNumber,
            allergens: allergens.slice(currentIndex, endIndex),
            productFeatures: [],
            hasProductFeatures: false
          });
          
          currentIndex = endIndex;
          pageNumber++;
        }
        
        return result;
      }
    }
    
    // Caso con entrambi allergeni e caratteristiche prodotto
    const allergensPerFirstPage = Math.floor((availableHeight - titleAndDescriptionHeight - sectionSpacing - totalProductFeaturesHeight) / estimatedAllergenHeight);
    
    // Verifica se tutti gli allergeni e le caratteristiche stanno nella prima pagina
    if (allergens.length <= allergensPerFirstPage && allergensPerFirstPage > 0) {
      console.log('🏷️ Tutti gli allergeni e le caratteristiche stanno nella prima pagina');
      return [{
        pageNumber: 1,
        allergens: allergens,
        productFeatures: productFeatures,
        hasProductFeatures: true
      }];
    }
    
    // Altrimenti, distribuisci su più pagine
    const result: AllergensPage[] = [];
    let currentIndex = 0;
    let pageNumber = 1;
    
    while (currentIndex < allergens.length) {
      const isFirstPage = pageNumber === 1;
      const isLastPage = allergens.slice(currentIndex).length <= Math.floor((availableHeight - (isFirstPage ? titleAndDescriptionHeight : 0)) / estimatedAllergenHeight);
      
      let availableForAllergens: number;
      let includeProductFeatures = false;
      
      if (isFirstPage) {
        // Prima pagina: calcola spazio disponibile
        const remainingAllergensCount = allergens.length - currentIndex;
        const maxAllergensWithFeatures = Math.floor((availableHeight - titleAndDescriptionHeight - sectionSpacing - totalProductFeaturesHeight) / estimatedAllergenHeight);
        
        if (remainingAllergensCount <= maxAllergensWithFeatures && maxAllergensWithFeatures > 0) {
          // Tutti gli allergeni rimanenti + caratteristiche stanno nella prima pagina
          availableForAllergens = availableHeight - titleAndDescriptionHeight - sectionSpacing - totalProductFeaturesHeight;
          includeProductFeatures = true;
          console.log('🏷️ Prima pagina: includendo caratteristiche prodotto con allergeni rimanenti');
        } else {
          // Solo allergeni nella prima pagina
          availableForAllergens = availableHeight - titleAndDescriptionHeight;
          console.log('🏷️ Prima pagina: solo allergeni, caratteristiche in pagina separata');
        }
      } else if (isLastPage && !result.some(p => p.hasProductFeatures)) {
        // Ultima pagina e le caratteristiche non sono ancora state inserite
        const remainingAllergensCount = allergens.length - currentIndex;
        const requiredHeightForAllergens = remainingAllergensCount * estimatedAllergenHeight;
        
        if (requiredHeightForAllergens + totalProductFeaturesHeight + sectionSpacing <= availableHeight) {
          // Gli allergeni rimanenti + caratteristiche stanno nell'ultima pagina
          availableForAllergens = availableHeight - sectionSpacing - totalProductFeaturesHeight;
          includeProductFeatures = true;
          console.log('🏷️ Ultima pagina: includendo caratteristiche prodotto');
        } else {
          // Solo allergeni, caratteristiche in pagina separata
          availableForAllergens = availableHeight;
        }
      } else {
        // Pagine intermedie: solo allergeni
        availableForAllergens = availableHeight;
      }
      
      const allergensForThisPage = Math.floor(availableForAllergens / estimatedAllergenHeight);
      const endIndex = Math.min(currentIndex + allergensForThisPage, allergens.length);
      
      result.push({
        pageNumber: pageNumber,
        allergens: allergens.slice(currentIndex, endIndex),
        productFeatures: includeProductFeatures ? productFeatures : [],
        hasProductFeatures: includeProductFeatures
      });
      
      currentIndex = endIndex;
      pageNumber++;
    }
    
    // Se le caratteristiche non sono ancora state incluse, crea una pagina dedicata
    if (!result.some(p => p.hasProductFeatures) && productFeatures.length > 0) {
      result.push({
        pageNumber: pageNumber,
        allergens: [],
        productFeatures: productFeatures,
        hasProductFeatures: true
      });
      console.log('🏷️ Creata pagina dedicata per le caratteristiche prodotto');
    }
    
    return result;
  }, [allergens, productFeatures, layout]);

  return {
    pages,
    totalPages: pages.length
  };
};
