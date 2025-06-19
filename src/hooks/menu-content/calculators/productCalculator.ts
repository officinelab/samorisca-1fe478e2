
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight, MM_TO_PX } from '../utils/textMeasurement';

export const calculateProductHeight = (product: Product, layout: PrintLayout | null): number => {
  if (!layout) return 80; // Default height in mm

  let totalHeight = 0;
  const availableWidth = 162; // 90% of available width for product details (Schema 1)

  // Title height
  const titleHeight = calculateTextHeight(
    product.title,
    layout.elements.title.fontSize,
    layout.elements.title.fontFamily,
    availableWidth * MM_TO_PX
  );
  totalHeight += (titleHeight / MM_TO_PX) + layout.elements.title.margin.top + layout.elements.title.margin.bottom;

  // Description height (if present)
  if (product.description) {
    const descHeight = calculateTextHeight(
      product.description,
      layout.elements.description.fontSize,
      layout.elements.description.fontFamily,
      availableWidth * MM_TO_PX
    );
    totalHeight += (descHeight / MM_TO_PX) + layout.elements.description.margin.top + layout.elements.description.margin.bottom;
  }

  // English description height (if present) - would need to fetch from translations
  // For now, assuming similar to main description
  
  // Allergens height (if present)
  if (product.allergens && product.allergens.length > 0) {
    const allergensText = product.allergens.map(allergen => allergen.number).join(', ');
    const allergensHeight = calculateTextHeight(
      allergensText,
      layout.elements.allergensList.fontSize,
      layout.elements.allergensList.fontFamily,
      availableWidth * MM_TO_PX
    );
    totalHeight += (allergensHeight / MM_TO_PX) + layout.elements.allergensList.margin.top + layout.elements.allergensList.margin.bottom;
  }

  // Product features height (if present)
  if (product.features && product.features.length > 0) {
    const featuresHeight = layout.elements.productFeatures.marginTop + 
                         layout.elements.productFeatures.marginBottom +
                         (layout.elements.productFeatures.iconSize / MM_TO_PX);
    totalHeight += featuresHeight;
  }

  // Price variants height (if present)
  if (product.has_multiple_prices) {
    const priceVariantsHeight = calculateTextHeight(
      `${product.price_variant_1_name || ''} ${product.price_variant_2_name || ''}`,
      layout.elements.priceVariants.fontSize,
      layout.elements.priceVariants.fontFamily,
      availableWidth * MM_TO_PX
    );
    totalHeight += (priceVariantsHeight / MM_TO_PX) + layout.elements.priceVariants.margin.top + layout.elements.priceVariants.margin.bottom;
  }

  // Add minimum spacing
  totalHeight += 5; // 5mm minimum spacing

  return totalHeight;
};
