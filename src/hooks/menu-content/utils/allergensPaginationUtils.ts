
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
  const { availableHeight, headerHeight, measurements } = context;
  const result: AllergensPage[] = [];
  let currentAllergenIndex = 0;
  let currentFeatureIndex = 0;
  let pageNumber = 1;
  
  while (currentAllergenIndex < allergens.length || currentFeatureIndex < productFeatures.length) {
    const isFirstPage = pageNumber === 1;
    let availableForContent = isFirstPage ? availableHeight - headerHeight : availableHeight;
    
    const allergensForThisPage: Allergen[] = [];
    const featuresForThisPage: ProductFeature[] = [];
    let currentPageHeight = 0;
    let hasAddedFeatures = false;
    
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
      // Calculate section title height (only needed once per features section)
      const sectionTitleHeight = measurements.productFeaturesSectionTitleHeight || 25;
      const remainingHeight = availableForContent - currentPageHeight;
      
      // Check if we can fit at least the section title + one feature
      if (remainingHeight >= sectionTitleHeight + 15) { // 15mm minimum for one feature
        currentPageHeight += sectionTitleHeight;
        hasAddedFeatures = true;
        
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
    
    console.log(`🏷️ Page ${pageNumber}: ${allergensForThisPage.length} allergens, ${featuresForThisPage.length} features, height: ${currentPageHeight.toFixed(1)}mm`);
    
    pageNumber++;
    
    // If we still have features to add but couldn't fit them, create a features-only page
    if (currentFeatureIndex < productFeatures.length && !hasAddedFeatures) {
      const remainingFeatures: ProductFeature[] = [];
      const sectionTitleHeight = measurements.productFeaturesSectionTitleHeight || 25;
      let featuresPageHeight = sectionTitleHeight;
      
      while (currentFeatureIndex < productFeatures.length) {
        const feature = productFeatures[currentFeatureIndex];
        const featureHeight = measurements.productFeatureHeights.get(feature.id) || 12;
        
        if (featuresPageHeight + featureHeight > availableHeight && remainingFeatures.length > 0) {
          // Create current page and continue with remaining features
          result.push({
            pageNumber: pageNumber,
            allergens: [],
            productFeatures: remainingFeatures,
            hasProductFeatures: true
          });
          
          console.log(`🏷️ Page ${pageNumber} (features continuation): ${remainingFeatures.length} features`);
          
          pageNumber++;
          remainingFeatures.length = 0;
          featuresPageHeight = sectionTitleHeight; // Reset for next page
        }
        
        remainingFeatures.push(feature);
        featuresPageHeight += featureHeight;
        currentFeatureIndex++;
      }
      
      // Add the last features page if there are remaining features
      if (remainingFeatures.length > 0) {
        result.push({
          pageNumber: pageNumber,
          allergens: [],
          productFeatures: remainingFeatures,
          hasProductFeatures: true
        });
        
        console.log(`🏷️ Page ${pageNumber} (final features): ${remainingFeatures.length} features`);
      }
      
      break;
    }
    
    // Safety check to avoid infinite loops
    if (currentAllergenIndex >= allergens.length && currentFeatureIndex >= productFeatures.length) {
      break;
    }
  }
  
  return result;
};
