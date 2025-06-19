
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import { addStyledText } from './textRenderer';
import { addSvgIconToPdf } from './iconRenderer';

// Add product features icons with high-quality SVG support
const addProductFeaturesToPdf = async (
  pdf: jsPDF,
  product: Product,
  x: number,
  y: number,
  layout: PrintLayout,
  maxContentWidth: number
): Promise<number> => {
  if (!product.features || product.features.length === 0) return 0;
  
  const featuresConfig = layout.elements.productFeatures;
  const iconSize = featuresConfig.iconSize || 20; // Increased for better quality
  const iconSpacing = featuresConfig.iconSpacing || 4;
  const marginTop = featuresConfig.marginTop || 2;
  const marginBottom = featuresConfig.marginBottom || 2;
  
  let currentX = x;
  let totalHeight = marginTop;
  
  // Load and add each feature icon with high quality
  for (const feature of product.features) {
    if (feature.icon_url) {
      const iconHeight = await addSvgIconToPdf(pdf, feature.icon_url, currentX, y + marginTop, iconSize);
      currentX += (iconSize * 0.264583) + (iconSpacing * 0.264583);
      
      // Check if we exceed the content width
      if (currentX > x + maxContentWidth) {
        break;
      }
    }
  }
  
  return totalHeight + marginBottom;
};

// Add product to PDF with proper two-column layout matching preview
export const addProductToPdf = async (
  pdf: jsPDF,
  product: Product,
  x: number,
  y: number,
  layout: PrintLayout,
  contentWidth: number,
  isLast: boolean
): Promise<number> => {
  let currentY = y;
  const elements = layout.elements;
  
  // Two-column layout: 75% for content, 25% for price (like preview)
  const contentColumnWidth = contentWidth * 0.75;
  const priceColumnX = x + contentColumnWidth + 3; // 3mm gap
  const priceColumnWidth = contentWidth * 0.25 - 3;
  
  // Product title in left column
  const titleHeight = addStyledText(pdf, product.title, x, currentY, {
    fontSize: elements.title.fontSize,
    fontFamily: elements.title.fontFamily,
    fontStyle: elements.title.fontStyle,
    fontColor: elements.title.fontColor,
    alignment: elements.title.alignment,
    maxWidth: contentColumnWidth
  });
  currentY += titleHeight + elements.title.margin.bottom;
  
  // Product description (Italian) in left column
  if (product.description) {
    const descHeight = addStyledText(pdf, product.description, x, currentY, {
      fontSize: elements.description.fontSize,
      fontFamily: elements.description.fontFamily,
      fontStyle: elements.description.fontStyle,
      fontColor: elements.description.fontColor,
      alignment: elements.description.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descHeight + elements.description.margin.bottom;
  }
  
  // Product description (English) in left column
  if (product.description_en && product.description_en !== product.description) {
    const descEngHeight = addStyledText(pdf, product.description_en, x, currentY, {
      fontSize: elements.descriptionEng.fontSize,
      fontFamily: elements.descriptionEng.fontFamily,
      fontStyle: elements.descriptionEng.fontStyle,
      fontColor: elements.descriptionEng.fontColor,
      alignment: elements.descriptionEng.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descEngHeight + elements.descriptionEng.margin.bottom;
  }
  
  // Product features in left column
  if (product.features && product.features.length > 0) {
    const featuresHeight = await addProductFeaturesToPdf(pdf, product, x, currentY, layout, contentColumnWidth);
    currentY += featuresHeight;
  }
  
  // Allergens with "Allergeni:" label in left column
  if (product.allergens && product.allergens.length > 0) {
    // Add "Allergeni:" label
    const allergenLabelHeight = addStyledText(pdf, "Allergeni:", x, currentY, {
      fontSize: elements.allergensList.fontSize,
      fontFamily: elements.allergensList.fontFamily,
      fontStyle: 'bold',
      fontColor: elements.allergensList.fontColor,
      alignment: elements.allergensList.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += allergenLabelHeight + 1; // 1mm spacing after label
    
    // Add allergen numbers
    const allergensText = product.allergens.map(a => a.number).join(', ');
    const allergensHeight = addStyledText(pdf, allergensText, x, currentY, {
      fontSize: elements.allergensList.fontSize,
      fontFamily: elements.allergensList.fontFamily,
      fontStyle: elements.allergensList.fontStyle,
      fontColor: elements.allergensList.fontColor,
      alignment: elements.allergensList.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += allergensHeight + elements.allergensList.margin.bottom;
  }
  
  // Price in right column at same level as title
  let priceY = y;
  
  if (product.price_standard) {
    const priceText = `€${product.price_standard.toFixed(2)}`;
    addStyledText(pdf, priceText, priceColumnX, priceY, {
      fontSize: elements.price.fontSize,
      fontFamily: elements.price.fontFamily,
      fontStyle: elements.price.fontStyle,
      fontColor: elements.price.fontColor,
      alignment: 'right',
      maxWidth: priceColumnWidth
    });
    
    // Price suffix
    if (product.has_price_suffix && product.price_suffix) {
      priceY += elements.price.fontSize * 0.35 + 2;
      addStyledText(pdf, product.price_suffix, priceColumnX, priceY, {
        fontSize: elements.suffix.fontSize,
        fontFamily: elements.suffix.fontFamily,
        fontStyle: elements.suffix.fontStyle,
        fontColor: elements.suffix.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
  }
  
  // Price variants in right column
  if (product.has_multiple_prices) {
    if (product.price_variant_1_value && product.price_variant_1_name) {
      priceY += 6;
      const variant1Text = `${product.price_variant_1_name}: €${product.price_variant_1_value.toFixed(2)}`;
      addStyledText(pdf, variant1Text, priceColumnX, priceY, {
        fontSize: elements.priceVariants.fontSize,
        fontFamily: elements.priceVariants.fontFamily,
        fontStyle: elements.priceVariants.fontStyle,
        fontColor: elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
    
    if (product.price_variant_2_value && product.price_variant_2_name) {
      priceY += 5;
      const variant2Text = `${product.price_variant_2_name}: €${product.price_variant_2_value.toFixed(2)}`;
      addStyledText(pdf, variant2Text, priceColumnX, priceY, {
        fontSize: elements.priceVariants.fontSize,
        fontFamily: elements.priceVariants.fontFamily,
        fontStyle: elements.priceVariants.fontStyle,
        fontColor: elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
  }
  
  // Add spacing between products (except for last product)
  if (!isLast) {
    currentY += layout.spacing.betweenProducts;
  }
  
  return currentY - y;
};
