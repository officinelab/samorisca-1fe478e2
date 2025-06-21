
import { PrintLayout } from '@/types/printLayout';
import { ProductFeature } from '@/types/database';
import { PaginationContext } from '../types/paginationTypes';
import { AllergensMeasurementResult } from '../types/measurementTypes';

export const createPaginationContext = (
  layout: PrintLayout,
  measurements: AllergensMeasurementResult,
  productFeaturesCount: number
): PaginationContext => {
  // Calculate available page height
  const A4_HEIGHT_MM = 297;
  const margins = {
    marginTop: layout.page.allergensMarginTop || 20,
    marginRight: layout.page.allergensMarginRight || 15,
    marginBottom: layout.page.allergensMarginBottom || 20,
    marginLeft: layout.page.allergensMarginLeft || 15
  };
  
  const availableHeight = A4_HEIGHT_MM - margins.marginTop - margins.marginBottom;
  
  // Calculate header height (title + description)
  const headerHeight = measurements.titleHeight + measurements.descriptionHeight;
  
  return {
    availableHeight,
    headerHeight,
    totalProductFeaturesHeight: 0, // Will be calculated separately
    measurements: {
      ...measurements,
      productFeaturesSectionTitleHeight: measurements.productFeaturesSectionTitleHeight
    }
  };
};

export const calculateProductFeaturesHeight = (
  productFeatures: ProductFeature[],
  measurements: AllergensMeasurementResult
): number => {
  if (productFeatures.length === 0) return 0;
  
  let totalHeight = measurements.productFeaturesSectionTitleHeight || 25; // Section title
  
  for (const feature of productFeatures) {
    const featureHeight = measurements.productFeatureHeights.get(feature.id) || 12;
    totalHeight += featureHeight;
  }
  
  return totalHeight;
};
