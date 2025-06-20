
import { useMemo } from 'react';
import { Allergen, ProductFeature } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { useAllergensPreRenderMeasurement } from './useAllergensPreRenderMeasurement';
import { AllergensPaginationResult } from './types/paginationTypes';
import { createAllergensOnlyPages, createMixedPages } from './utils/allergensPaginationUtils';
import { createPaginationContext, calculateProductFeaturesHeight } from './utils/paginationConfig';

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

    // If no allergens or features, don't create pages
    if (allergens.length === 0 && productFeatures.length === 0) {
      return [];
    }

    console.log('🏷️ useAllergensPagination - Starting pagination calculation with real measurements');

    // Create pagination context
    const context = createPaginationContext(layout, measurements, productFeatures.length);
    
    // Calculate total product features height
    context.totalProductFeaturesHeight = calculateProductFeaturesHeight(productFeatures, measurements);

    console.log('🏷️ Calculated heights:', {
      availableHeight: context.availableHeight,
      headerHeight: context.headerHeight,
      totalProductFeaturesHeight: context.totalProductFeaturesHeight,
      allergensCount: allergens.length,
      featuresCount: productFeatures.length
    });
    
    // Handle different scenarios
    if (allergens.length === 0 && productFeatures.length > 0) {
      // Only product features
      return [{
        pageNumber: 1,
        allergens: [],
        productFeatures: productFeatures,
        hasProductFeatures: true
      }];
    }
    
    if (productFeatures.length === 0 && allergens.length > 0) {
      // Only allergens
      return createAllergensOnlyPages(allergens, context);
    }
    
    // Mixed scenario with both allergens and features
    return createMixedPages(allergens, productFeatures, context);
    
  }, [allergens, productFeatures, layout, measurements]);

  return {
    pages,
    totalPages: pages.length
  };
};
