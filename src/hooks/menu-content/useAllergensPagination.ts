
import { useMemo } from 'react';
import { Allergen, ProductFeature } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { useAllergensPreRenderMeasurement } from './useAllergensPreRenderMeasurement';

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
  
  const { measurements, isLoading } = useAllergensPreRenderMeasurement(layout, allergens, productFeatures);
  
  const pages = useMemo(() => {
    if (!layout || !measurements) {
      return [];
    }

    // Se non ci sono allergeni né caratteristiche, non creare pagine
    if (allergens.length === 0 && productFeatures.length === 0) {
      return [];
    }

    console.log('🏷️ useAllergensPagination - Inizio calcolo paginazione con misurazioni reali');

    // Calcola dimensioni pagina e margini
    const pageHeight = 297; // A4 height in mm
    const margins = {
      top: layout.page.allergensMarginTop || 20,
      bottom: layout.page.allergensMarginBottom || 20
    };
    
    const availableHeight = pageHeight - margins.top - margins.bottom;
    
    // Calcola altezza header (titolo + descrizione)
    const headerHeight = measurements.titleHeight + measurements.descriptionHeight + 10; // 10mm spacing
    
    // Calcola altezza totale delle caratteristiche prodotto
    let totalProductFeaturesHeight = 0;
    productFeatures.forEach(feature => {
      const featureHeight = measurements.productFeatureHeights.get(feature.id) || 12;
      totalProductFeaturesHeight += featureHeight;
    });

    console.log('🏷️ Altezze calcolate:', {
      availableHeight,
      headerHeight,
      totalProductFeaturesHeight,
      allergensCount: allergens.length,
      featuresCount: productFeatures.length
    });
    
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
      return createAllergensOnlyPages(allergens, measurements, availableHeight, headerHeight);
    }
    
    // Caso con entrambi allergeni e caratteristiche prodotto
    return createMixedPages(allergens, productFeatures, measurements, availableHeight, headerHeight, totalProductFeaturesHeight);
    
  }, [allergens, productFeatures, layout, measurements]);

  return {
    pages,
    totalPages: pages.length
  };
};

// Funzione per creare pagine solo con allergeni
function createAllergensOnlyPages(allergens: Allergen[], measurements: any, availableHeight: number, headerHeight: number): AllergensPage[] {
  const result: AllergensPage[] = [];
  let currentIndex = 0;
  let pageNumber = 1;
  
  while (currentIndex < allergens.length) {
    const isFirstPage = pageNumber === 1;
    const availableForAllergens = isFirstPage ? availableHeight - headerHeight : availableHeight;
    
    let currentPageHeight = 0;
    const allergensForThisPage: Allergen[] = [];
    
    // Aggiungi allergeni fino a riempire la pagina
    while (currentIndex < allergens.length) {
      const allergen = allergens[currentIndex];
      const allergenHeight = measurements.allergenHeights.get(allergen.id) || 18;
      
      if (currentPageHeight + allergenHeight > availableForAllergens && allergensForThisPage.length > 0) {
        // Non c'è più spazio, inizia nuova pagina
        break;
      }
      
      allergensForThisPage.push(allergen);
      currentPageHeight += allergenHeight;
      currentIndex++;
    }
    
    result.push({
      pageNumber: pageNumber,
      allergens: allergensForThisPage,
      productFeatures: [],
      hasProductFeatures: false
    });
    
    console.log(`🏷️ Pagina ${pageNumber} (solo allergeni): ${allergensForThisPage.length} allergeni, altezza: ${currentPageHeight.toFixed(1)}mm`);
    
    pageNumber++;
  }
  
  return result;
}

// Funzione per creare pagine con allergeni e caratteristiche
function createMixedPages(
  allergens: Allergen[], 
  productFeatures: ProductFeature[], 
  measurements: any, 
  availableHeight: number, 
  headerHeight: number, 
  totalProductFeaturesHeight: number
): AllergensPage[] {
  const result: AllergensPage[] = [];
  let currentIndex = 0;
  let pageNumber = 1;
  let productFeaturesPlaced = false;
  
  while (currentIndex < allergens.length || (!productFeaturesPlaced && productFeatures.length > 0)) {
    const isFirstPage = pageNumber === 1;
    let availableForContent = isFirstPage ? availableHeight - headerHeight : availableHeight;
    
    const allergensForThisPage: Allergen[] = [];
    let currentPageHeight = 0;
    let includeProductFeatures = false;
    
    // Se è la prima pagina, prova a includere le caratteristiche
    if (isFirstPage && !productFeaturesPlaced) {
      // Calcola quanti allergeni possiamo mettere insieme alle caratteristiche
      const heightWithFeatures = availableForContent - totalProductFeaturesHeight - 15; // 15mm spacing
      
      if (heightWithFeatures > 0) {
        // Prova a mettere alcuni allergeni insieme alle caratteristiche
        let tempHeight = 0;
        let tempIndex = currentIndex;
        
        while (tempIndex < allergens.length) {
          const allergen = allergens[tempIndex];
          const allergenHeight = measurements.allergenHeights.get(allergen.id) || 18;
          
          if (tempHeight + allergenHeight > heightWithFeatures) {
            break;
          }
          
          allergensForThisPage.push(allergen);
          tempHeight += allergenHeight;
          tempIndex++;
        }
        
        currentIndex = tempIndex;
        currentPageHeight = tempHeight + totalProductFeaturesHeight + 15;
        includeProductFeatures = true;
        productFeaturesPlaced = true;
        
        console.log(`🏷️ Pagina ${pageNumber} (mista): ${allergensForThisPage.length} allergeni + caratteristiche, altezza: ${currentPageHeight.toFixed(1)}mm`);
      }
    }
    
    // Se non abbiamo incluso le caratteristiche, riempi con allergeni
    if (!includeProductFeatures && currentIndex < allergens.length) {
      currentPageHeight = 0;
      allergensForThisPage.length = 0;
      
      while (currentIndex < allergens.length) {
        const allergen = allergens[currentIndex];
        const allergenHeight = measurements.allergenHeights.get(allergen.id) || 18;
        
        if (currentPageHeight + allergenHeight > availableForContent && allergensForThisPage.length > 0) {
          break;
        }
        
        allergensForThisPage.push(allergen);
        currentPageHeight += allergenHeight;
        currentIndex++;
      }
      
      console.log(`🏷️ Pagina ${pageNumber} (solo allergeni): ${allergensForThisPage.length} allergeni, altezza: ${currentPageHeight.toFixed(1)}mm`);
    }
    
    // Se è l'ultima pagina e le caratteristiche non sono ancora state inserite
    if (currentIndex >= allergens.length && !productFeaturesPlaced && productFeatures.length > 0) {
      // Verifica se le caratteristiche possono stare nella pagina corrente
      if (currentPageHeight + totalProductFeaturesHeight + 15 <= availableForContent) {
        includeProductFeatures = true;
        productFeaturesPlaced = true;
        console.log(`🏷️ Pagina ${pageNumber} - Aggiunge caratteristiche alla pagina esistente`);
      }
    }
    
    result.push({
      pageNumber: pageNumber,
      allergens: allergensForThisPage,
      productFeatures: includeProductFeatures ? productFeatures : [],
      hasProductFeatures: includeProductFeatures
    });
    
    pageNumber++;
    
    // Se abbiamo finito gli allergeni ma le caratteristiche non sono ancora state inserite
    if (currentIndex >= allergens.length && !productFeaturesPlaced && productFeatures.length > 0) {
      result.push({
        pageNumber: pageNumber,
        allergens: [],
        productFeatures: productFeatures,
        hasProductFeatures: true
      });
      productFeaturesPlaced = true;
      console.log(`🏷️ Pagina ${pageNumber} - Pagina dedicata caratteristiche`);
      break;
    }
    
    // Evita loop infiniti
    if (currentIndex >= allergens.length && productFeaturesPlaced) {
      break;
    }
  }
  
  return result;
}
