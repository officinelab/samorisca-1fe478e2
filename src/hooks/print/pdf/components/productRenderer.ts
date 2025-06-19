import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import { addStyledText } from './textRenderer';
import { addSvgIconToPdf } from './iconRenderer';
import { getStandardizedDimensions } from '@/hooks/print/pdf/utils/conversionUtils';

// Add product features icons with correct dimensions matching Schema 1
const addProductFeaturesToPdf = async (
  pdf: jsPDF,
  product: Product,
  x: number,
  y: number,
  layout: PrintLayout,
  maxContentWidth: number
): Promise<number> => {
  if (!product.features || product.features.length === 0) return 0;
  
  const dimensions = getStandardizedDimensions(layout);
  
  console.log('🎯 PDF Features con dimensioni Schema 1:', {
    iconSizeMm: dimensions.icons.pdfSizeMm,
    marginTopMm: dimensions.icons.pdfMarginTopMm,
    marginBottomMm: dimensions.icons.pdfMarginBottomMm,
    spacingMm: dimensions.icons.pdfSpacingMm
  });
  
  let currentX = x;
  const startY = y + dimensions.icons.pdfMarginTopMm;
  
  // Load and add each feature icon
  for (const feature of product.features) {
    if (feature.icon_url) {
      await addSvgIconToPdf(pdf, feature.icon_url, currentX, startY, dimensions.icons.pdfSizeMm);
      currentX += dimensions.icons.pdfSizeMm + dimensions.icons.pdfSpacingMm;
      
      // Check if we exceed the content width
      if (currentX > x + maxContentWidth) {
        break;
      }
    }
  }
  
  return dimensions.icons.pdfMarginTopMm + dimensions.icons.pdfSizeMm + dimensions.icons.pdfMarginBottomMm;
};

// Add product to PDF with Schema 1 layout (90%/10%) - FINALE
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
  const dimensions = getStandardizedDimensions(layout);
  
  console.log('🎯 PDF Product rendering con Schema 1 (90%/10%) - FINALE:', product.title, {
    titleFontSize: dimensions.pdf.titleFontSize,
    descriptionFontSize: dimensions.pdf.descriptionFontSize,
    marginBottom: !isLast ? dimensions.spacing.betweenProducts : 0
  });
  
  // ✅ SCHEMA 1 FINALE: Layout 90%/10% come definito nei template
  const contentColumnWidth = contentWidth * 0.90; // 90% per contenuto (Schema 1)
  const gap = 3; // 3mm gap
  const priceColumnX = x + contentColumnWidth + gap;
  const priceColumnWidth = contentWidth * 0.10 - gap; // 10% per prezzo (Schema 1)
  
  console.log('📐 Schema 1 - Layout colonne PDF FINALE:', {
    contentColumnWidth: contentColumnWidth.toFixed(1),
    priceColumnWidth: priceColumnWidth.toFixed(1),
    schema: 'Schema 1 (90%/10%) - FINALE'
  });
  
  // Product title in left column (90%)
  const titleHeight = addStyledText(pdf, product.title, x, currentY, {
    fontSize: dimensions.pdf.titleFontSize, // USA DIMENSIONI STANDARDIZZATE
    fontFamily: layout.elements.title.fontFamily,
    fontStyle: layout.elements.title.fontStyle,
    fontColor: layout.elements.title.fontColor,
    alignment: layout.elements.title.alignment,
    maxWidth: contentColumnWidth
  });
  currentY += titleHeight + dimensions.pdfMargins.title.bottom;
  
  // Product description (Italian) in left column
  if (product.description && layout.elements.description?.visible !== false) {
    const descHeight = addStyledText(pdf, product.description, x, currentY, {
      fontSize: dimensions.pdf.descriptionFontSize, // USA DIMENSIONI STANDARDIZZATE
      fontFamily: layout.elements.description.fontFamily,
      fontStyle: layout.elements.description.fontStyle,
      fontColor: layout.elements.description.fontColor,
      alignment: layout.elements.description.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descHeight + dimensions.pdfMargins.description.bottom;
  }
  
  // Product description (English) in left column
  if (product.description_en && product.description_en !== product.description && layout.elements.descriptionEng?.visible !== false) {
    const descEngHeight = addStyledText(pdf, product.description_en, x, currentY, {
      fontSize: dimensions.pdf.descriptionEngFontSize, // USA DIMENSIONI STANDARDIZZATE
      fontFamily: layout.elements.descriptionEng.fontFamily,
      fontStyle: layout.elements.descriptionEng.fontStyle,
      fontColor: layout.elements.descriptionEng.fontColor,
      alignment: layout.elements.descriptionEng.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descEngHeight + dimensions.pdfMargins.descriptionEng.bottom;
  }
  
  // Product features in left column con dimensioni standardizzate
  if (product.features && product.features.length > 0 && layout.productFeatures?.icon) {
    const featuresHeight = await addProductFeaturesToPdf(pdf, product, x, currentY, layout, contentColumnWidth);
    currentY += featuresHeight;
  }
  
  // Allergens with "Allergeni:" label in left column
  if (product.allergens && product.allergens.length > 0 && layout.elements.allergensList?.visible !== false) {
    const allergensText = `Allergeni: ${product.allergens.map(a => a.number).join(', ')}`;
    const allergensHeight = addStyledText(pdf, allergensText, x, currentY, {
      fontSize: dimensions.pdf.allergensFontSize, // USA DIMENSIONI STANDARDIZZATE
      fontFamily: layout.elements.allergensList.fontFamily,
      fontStyle: layout.elements.allergensList.fontStyle,
      fontColor: layout.elements.allergensList.fontColor,
      alignment: layout.elements.allergensList.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += allergensHeight + dimensions.pdfMargins.allergens.bottom;
  }
  
  // ✅ PRICE IN RIGHT COLUMN (10%) - STESSA Y DEL TITOLO
  let priceY = y; // Inizia dalla stessa posizione del titolo
  
  if (product.price_standard && layout.elements.price?.visible !== false) {
    const priceText = `€${product.price_standard.toFixed(2)}`;
    addStyledText(pdf, priceText, priceColumnX, priceY, {
      fontSize: dimensions.pdf.priceFontSize, // USA DIMENSIONI STANDARDIZZATE
      fontFamily: layout.elements.price.fontFamily,
      fontStyle: layout.elements.price.fontStyle,
      fontColor: layout.elements.price.fontColor,
      alignment: 'right',
      maxWidth: priceColumnWidth
    });
    
    // Price suffix
    if (product.has_price_suffix && product.price_suffix && layout.elements.suffix?.visible !== false) {
      priceY += dimensions.pdf.priceFontSize * 0.353 + 2; // Usa line height corretto
      addStyledText(pdf, product.price_suffix, priceColumnX, priceY, {
        fontSize: dimensions.pdf.suffixFontSize, // USA DIMENSIONI STANDARDIZZATE
        fontFamily: layout.elements.suffix.fontFamily,
        fontStyle: layout.elements.suffix.fontStyle,
        fontColor: layout.elements.suffix.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
  }
  
  // Price variants in right column
  if (product.has_multiple_prices && layout.elements.priceVariants?.visible !== false) {
    if (product.price_variant_1_value && product.price_variant_1_name) {
      priceY += 6;
      const variant1Text = `${product.price_variant_1_name}: €${product.price_variant_1_value.toFixed(2)}`;
      addStyledText(pdf, variant1Text, priceColumnX, priceY, {
        fontSize: dimensions.pdf.variantsFontSize, // USA DIMENSIONI STANDARDIZZATE
        fontFamily: layout.elements.priceVariants.fontFamily,
        fontStyle: layout.elements.priceVariants.fontStyle,
        fontColor: layout.elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
    
    if (product.price_variant_2_value && product.price_variant_2_name) {
      priceY += 5;
      const variant2Text = `${product.price_variant_2_name}: €${product.price_variant_2_value.toFixed(2)}`;
      addStyledText(pdf, variant2Text, priceColumnX, priceY, {
        fontSize: dimensions.pdf.variantsFontSize, // USA DIMENSIONI STANDARDIZZATE
        fontFamily: layout.elements.priceVariants.fontFamily,
        fontStyle: layout.elements.priceVariants.fontStyle,
        fontColor: layout.elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
  }
  
  // ✅ Add spacing between products (except for last product) - identico all'anteprima
  if (!isLast) {
    currentY += dimensions.spacing.betweenProducts; // USA SPACING STANDARDIZZATO
  }
  
  return currentY - y;
};