
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
    
    // Try to include product features on first page
    if (isFirstPage && !productFeaturesPlaced) {
      // Calculate how many allergens we can fit with product features
      const heightWithFeatures = availableForContent - totalProductFeaturesHeight - 15; // 15mm spacing
      
      if (heightWithFeatures > 0) {
        // Try to fit some allergens with product features
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
        
        console.log(`🏷️ Page ${pageNumber} (mixed): ${allergensForThisPage.length} allergens + features, height: ${currentPageHeight.toFixed(1)}mm`);
      }
    }
    
    // If we didn't include features, fill with allergens
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
      
      console.log(`🏷️ Page ${pageNumber} (allergens only): ${allergensForThisPage.length} allergens, height: ${currentPageHeight.toFixed(1)}mm`);
    }
    
    // Check if we can add features to the last page
    if (currentIndex >= allergens.length && !productFeaturesPlaced && productFeatures.length > 0) {
      if (currentPageHeight + totalProductFeaturesHeight + 15 <= availableForContent) {
        includeProductFeatures = true;
        productFeaturesPlaced = true;
        console.log(`🏷️ Page ${pageNumber} - Adding features to existing page`);
      }
    }
    
    result.push({
      pageNumber: pageNumber,
      allergens: allergensForThisPage,
      productFeatures: includeProductFeatures ? productFeatures : [],
      hasProductFeatures: includeProductFeatures
    });
    
    pageNumber++;
    
    // If we finished allergens but features aren't placed
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
