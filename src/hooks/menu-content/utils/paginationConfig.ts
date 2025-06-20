
import { PrintLayout } from '@/types/printLayout';
import { PaginationContext } from '../types/paginationTypes';

export const createPaginationContext = (
  layout: PrintLayout,
  measurements: any,
  productFeaturesCount: number
): PaginationContext => {
  // Calculate page dimensions and margins
  const pageHeight = 297; // A4 height in mm
  const margins = {
    top: layout.page.allergensMarginTop || 20,
    bottom: layout.page.allergensMarginBottom || 20
  };
  
  const availableHeight = pageHeight - margins.top - margins.bottom;
  
  // Calculate header height (title + description)
  const headerHeight = measurements.titleHeight + measurements.descriptionHeight + 10; // 10mm spacing
  
  // Calculate total product features height
  let totalProductFeaturesHeight = 0;
  for (let i = 0; i < productFeaturesCount; i++) {
    // We need to iterate through product features to get their heights
    // This will be calculated in the main hook
  }
  
  return {
    availableHeight,
    headerHeight,
    totalProductFeaturesHeight,
    measurements
  };
};

export const calculateProductFeaturesHeight = (
  productFeatures: any[],
  measurements: any
): number => {
  let totalHeight = 0;
  productFeatures.forEach(feature => {
    const featureHeight = measurements.productFeatureHeights.get(feature.id) || 12;
    totalHeight += featureHeight;
  });
  return totalHeight;
};
