
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
  
  while (currentIndex < allergens.length) {
    const isFirstPage = pageNumber === 1;
    const availableForAllergens = isFirstPage ? availableHeight - headerHeight : availableHeight;
    
    let currentPageHeight = 0;
    const allergensForThisPage: Allergen[] = [];
    
    // Add allergens until page is full
    while (currentIndex < allergens.length) {
      const allergen = allergens[currentIndex];
      const allergenHeight = measurements.allergenHeights.get(allergen.id) || 18;
      
      if (currentPageHeight + allergenHeight > availableForAllergens && allergensForThisPage.length > 0) {
        // No more space, start new page
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
    
    console.log(`🏷️ Page ${pageNumber} (allergens only): ${allergensForThisPage.length} allergens, height: ${currentPageHeight.toFixed(1)}mm`);
    
    pageNumber++;
  }
  
  return result;
};

export const createMixedPages = (
  allergens: Allergen[], 
  productFeatures: ProductFeature[], 
  context: PaginationContext
): AllergensPage[] => {
  const { availableHeight, headerHeight, totalProductFeaturesHeight, measurements } = context;
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
    
    // First, try to fit as many allergens as possible
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
    
    // After placing allergens, check if we can fit product features on this page
    if (!productFeaturesPlaced && productFeatures.length > 0) {
      const remainingHeight = availableForContent - currentPageHeight;
      const featuresWithTitleHeight = totalProductFeaturesHeight + 10; // 10mm for section spacing
      
      if (remainingHeight >= featuresWithTitleHeight) {
        includeProductFeatures = true;
        productFeaturesPlaced = true;
        currentPageHeight += featuresWithTitleHeight;
        console.log(`🏷️ Page ${pageNumber} - Adding features after allergens, remaining height: ${remainingHeight.toFixed(1)}mm`);
      }
    }
    
    result.push({
      pageNumber: pageNumber,
      allergens: allergensForThisPage,
      productFeatures: includeProductFeatures ? productFeatures : [],
      hasProductFeatures: includeProductFeatures
    });
    
    console.log(`🏷️ Page ${pageNumber}: ${allergensForThisPage.length} allergens${includeProductFeatures ? ' + features' : ''}, height: ${currentPageHeight.toFixed(1)}mm`);
    
    pageNumber++;
    
    // If we finished allergens but features aren't placed, create a dedicated page for features
    if (currentIndex >= allergens.length && !productFeaturesPlaced && productFeatures.length > 0) {
      result.push({
        pageNumber: pageNumber,
        allergens: [],
        productFeatures: productFeatures,
        hasProductFeatures: true
      });
      productFeaturesPlaced = true;
      console.log(`🏷️ Page ${pageNumber} - Dedicated features page`);
      break;
    }
    
    // Avoid infinite loops
    if (currentIndex >= allergens.length && productFeaturesPlaced) {
      break;
    }
  }
  
  return result;
};
