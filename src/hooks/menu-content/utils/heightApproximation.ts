
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import { PX_TO_MM } from '../constants/measurementConstants';

interface ProductHeightFactors {
  baseHeight: number;
  titleLines: number;
  descriptionLines: number;
  priceHeight: number;
  featuresHeight: number;
  allergensHeight: number;
}

export const approximateProductHeight = (
  product: Product,
  layout: PrintLayout,
  referenceHeight?: number
): number => {
  if (referenceHeight) {
    // Use reference height with small adjustments based on content differences
    const contentFactor = calculateContentFactor(product);
    return referenceHeight * contentFactor;
  }

  // Mathematical calculation based on layout
  const factors = calculateProductHeightFactors(product, layout);
  
  let totalHeight = factors.baseHeight;
  totalHeight += factors.titleLines * getLineHeight(layout.elements.title.fontSize);
  totalHeight += factors.descriptionLines * getLineHeight(layout.elements.description.fontSize);
  totalHeight += factors.priceHeight;
  totalHeight += factors.featuresHeight;
  totalHeight += factors.allergensHeight;
  
  // Add spacing and margins
  totalHeight += (layout.spacing?.betweenProducts || 4) * PX_TO_MM;
  
  return totalHeight;
};

const calculateContentFactor = (product: Product): number => {
  let factor = 1.0;
  
  // Adjust based on title length
  if (product.title.length > 50) factor += 0.1;
  if (product.title.length < 20) factor -= 0.05;
  
  // Adjust based on description
  if (product.description && product.description.length > 100) factor += 0.15;
  if (product.description_en && product.description_en !== product.description) factor += 0.1;
  
  // Adjust based on features and allergens
  if (product.features && product.features.length > 3) factor += 0.05;
  if (product.allergens && product.allergens.length > 5) factor += 0.05;
  
  return Math.max(0.8, Math.min(1.3, factor)); // Clamp between 0.8 and 1.3
};

const calculateProductHeightFactors = (product: Product, layout: PrintLayout): ProductHeightFactors => {
  const avgCharsPerLine = 60; // Approximate characters per line
  
  return {
    baseHeight: 20 * PX_TO_MM, // Base padding and structure
    titleLines: Math.ceil(product.title.length / avgCharsPerLine),
    descriptionLines: product.description ? Math.ceil(product.description.length / avgCharsPerLine) : 0,
    priceHeight: 15 * PX_TO_MM, // Standard price height
    featuresHeight: (product.features?.length || 0) * 8 * PX_TO_MM,
    allergensHeight: (product.allergens?.length || 0) * 6 * PX_TO_MM
  };
};

const getLineHeight = (fontSize: number): number => {
  return fontSize * 1.4 * PX_TO_MM; // 1.4 line height ratio converted to mm
};
