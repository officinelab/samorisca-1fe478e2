
import { Allergen, ProductFeature } from '@/types/database';
import { AllergensPage, PaginationContext } from '../types/paginationTypes';

export const createAllergensOnlyPages = (
  allergens: Allergen[], 
  context: PaginationContext
): AllergensPage[] => {
  const { availableHeight, headerHeight, measurements } = context;
  const result: AllergensPage[] = [];
  let currentIndex = 0;
  let pageNumber = 1;
  
  // Fattore di sicurezza per evitare overflow
  const SAFETY_FACTOR = 0.95;
  
  while (currentIndex < allergens.length) {
    const isFirstPage = pageNumber === 1;
    const availableForAllergens = (isFirstPage ? availableHeight - headerHeight : availableHeight) * SAFETY_FACTOR;
    
    let currentPageHeight = 0;
    const allergensForThisPage: Allergen[] = [];
    
    // Add allergens until page is full
    while (currentIndex < allergens.length) {
      const allergen = allergens[currentIndex];
      const allergenHeight = measurements.allergenHeights.get(allergen.id) || 18;
      
      if (currentPageHeight + allergenHeight > availableForAllergens && allergensForThisPage.length > 0) {
        // No more space, start new page
        console.log(`🏷️ Pagina ${pageNumber}: Allergene "${allergen.title}" non entra (${(currentPageHeight + allergenHeight).toFixed(2)}mm > ${availableForAllergens.toFixed(2)}mm)`);
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
    
    console.log(`🏷️ Page ${pageNumber} (allergens only): ${allergensForThisPage.length} allergens, height: ${currentPageHeight.toFixed(1)}mm / ${availableForAllergens.toFixed(1)}mm`);
    
    pageNumber++;
  }
  
  return result;
};

export const createMixedPages = (
  allergens: Allergen[], 
  productFeatures: ProductFeature[], 
  context: PaginationContext
): AllergensPage[] => {
  const { availableHeight, headerHeight, measurements } = context;
  const result: AllergensPage[] = [];
  let currentAllergenIndex = 0;
  let currentFeatureIndex = 0;
  let pageNumber = 1;
  
  // Fattore di sicurezza per evitare overflow
  const SAFETY_FACTOR = 0.93;
  
  while (currentAllergenIndex < allergens.length || currentFeatureIndex < productFeatures.length) {
    const isFirstPage = pageNumber === 1;
    let availableForContent = (isFirstPage ? availableHeight - headerHeight : availableHeight) * SAFETY_FACTOR;
    
    const allergensForThisPage: Allergen[] = [];
    const featuresForThisPage: ProductFeature[] = [];
    let currentPageHeight = 0;
    let hasAddedFeatures = false;
    let needsProductFeatureTitle = false;
    
    // First, add as many allergens as possible
    while (currentAllergenIndex < allergens.length) {
      const allergen = allergens[currentAllergenIndex];
      const allergenHeight = measurements.allergenHeights.get(allergen.id) || 18;
      
      if (currentPageHeight + allergenHeight > availableForContent && allergensForThisPage.length > 0) {
        break;
      }
      
      allergensForThisPage.push(allergen);
      currentPageHeight += allergenHeight;
      currentAllergenIndex++;
    }
    
    // Then, try to add product features if there's space
    if (currentFeatureIndex < productFeatures.length) {
      // Calculate section title height (only needed once per features section or on new pages)
      const sectionTitleHeight = measurements.productFeaturesSectionTitleHeight || 25;
      const remainingHeight = availableForContent - currentPageHeight;
      
      // Check if we can fit at least the section title + one feature
      const minFeatureHeight = Math.min(...Array.from(measurements.productFeatureHeights.values())) || 15;
      const requiredSpace = sectionTitleHeight + minFeatureHeight;
      
      if (remainingHeight >= requiredSpace) {
        currentPageHeight += sectionTitleHeight;
        hasAddedFeatures = true;
        needsProductFeatureTitle = true;
        
        // Add features until page is full
        while (currentFeatureIndex < productFeatures.length) {
          const feature = productFeatures[currentFeatureIndex];
          const featureHeight = measurements.productFeatureHeights.get(feature.id) || 12;
          
          if (currentPageHeight + featureHeight > availableForContent && featuresForThisPage.length > 0) {
            break;
          }
          
          featuresForThisPage.push(feature);
          currentPageHeight += featureHeight;
          currentFeatureIndex++;
        }
      }
    }
    
    result.push({
      pageNumber: pageNumber,
      allergens: allergensForThisPage,
      productFeatures: featuresForThisPage,
      hasProductFeatures: hasAddedFeatures
    });
    
    console.log(`🏷️ Page ${pageNumber}: ${allergensForThisPage.length} allergens, ${featuresForThisPage.length} features, height: ${currentPageHeight.toFixed(1)}mm / ${availableForContent.toFixed(1)}mm`);
    
    pageNumber++;
    
    // Se ci sono ancora caratteristiche da aggiungere, continuiamo nelle pagine successive
    while (currentFeatureIndex < productFeatures.length) {
      const featuresPageHeight = sectionTitleHeight; // Inizia con il titolo della sezione
      const featuresForContinuationPage: ProductFeature[] = [];
      let continuationPageHeight = featuresPageHeight;
      
      // Aggiungi le caratteristiche rimanenti
      while (currentFeatureIndex < productFeatures.length) {
        const feature = productFeatures[currentFeatureIndex];
        const featureHeight = measurements.productFeatureHeights.get(feature.id) || 12;
        
        if (continuationPageHeight + featureHeight > availableHeight * SAFETY_FACTOR && featuresForContinuationPage.length > 0) {
          break;
        }
        
        featuresForContinuationPage.push(feature);
        continuationPageHeight += featureHeight;
        currentFeatureIndex++;
      }
      
      if (featuresForContinuationPage.length > 0) {
        result.push({
          pageNumber: pageNumber,
          allergens: [],
          productFeatures: featuresForContinuationPage,
          hasProductFeatures: true
        });
        
        console.log(`🏷️ Page ${pageNumber} (features continuation): ${featuresForContinuationPage.length} features, height: ${continuationPageHeight.toFixed(1)}mm`);
        pageNumber++;
      } else {
        break;
      }
    }
    
    // Safety check to avoid infinite loops
    if (currentAllergenIndex >= allergens.length && currentFeatureIndex >= productFeatures.length) {
      break;
    }
  }
  
  return result;
};
