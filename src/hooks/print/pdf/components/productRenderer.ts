import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import { addStyledText } from './textRenderer';
import { addSvgIconToPdf } from './iconRenderer';

// Add product features icons with correct dimensions matching preview
const addProductFeaturesToPdf = async (
  pdf: jsPDF,
  product: Product,
  x: number,
  y: number,
  layout: PrintLayout,
  maxContentWidth: number
): Promise<number> => {
  if (!product.features || product.features.length === 0) return 0;
  
  // ✅ USA VALORI DIRETTI DAL LAYOUT (come nell'anteprima)
  const iconSizePx = layout.productFeatures.icon.iconSize; // px
  const iconSpacingPx = layout.productFeatures.icon.iconSpacing; // px
  const marginTopMm = layout.productFeatures.icon.marginTop; // mm
  const marginBottomMm = layout.productFeatures.icon.marginBottom; // mm
  
  // Conversione px to mm solo per PDF
  const iconSizeMm = iconSizePx * 0.26458333; // px to mm
  const iconSpacingMm = iconSpacingPx * 0.26458333; // px to mm
  
  console.log('🎯 PDF Features con dimensioni corrette:', {
    iconSizePx,
    iconSizeMm: iconSizeMm.toFixed(1),
    marginTopMm,
    marginBottomMm,
    iconSpacingMm: iconSpacingMm.toFixed(1)
  });
  
  let currentX = x;
  const startY = y + marginTopMm;
  
  // Load and add each feature icon
  for (const feature of product.features) {
    if (feature.icon_url) {
      await addSvgIconToPdf(pdf, feature.icon_url, currentX, startY, iconSizeMm);
      currentX += iconSizeMm + iconSpacingMm;
      
      // Check if we exceed the content width
      if (currentX > x + maxContentWidth) {
        break;
      }
    }
  }
  
  return marginTopMm + iconSizeMm + marginBottomMm;
};

// Add product to PDF with layout identical to preview (90%/10%)
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
  
  console.log('🎯 PDF Product rendering con layout 90%/10%:', product.title);
  
  // ✅ CORREZIONE: Layout identico all'anteprima (90%/10%)
  const contentColumnWidth = contentWidth * 0.90; // 90% per contenuto
  const gap = 3; // 3mm gap
  const priceColumnX = x + contentColumnWidth + gap;
  const priceColumnWidth = contentWidth * 0.10 - gap; // 10% per prezzo
  
  console.log('📐 Layout colonne PDF:', {
    contentColumnWidth: contentColumnWidth.toFixed(1),
    priceColumnWidth: priceColumnWidth.toFixed(1),
    contentPercentage: '90%',
    pricePercentage: '10%'
  });
  
  // Product title in left column (90%)
  const titleHeight = addStyledText(pdf, product.title, x, currentY, {
    fontSize: layout.elements.title.fontSize, // USA PT DIRETTO
    fontFamily: layout.elements.title.fontFamily,
    fontStyle: layout.elements.title.fontStyle,
    fontColor: layout.elements.title.fontColor,
    alignment: layout.elements.title.alignment,
    maxWidth: contentColumnWidth
  });
  currentY += titleHeight + layout.elements.title.margin.bottom;
  
  // Product description (Italian) in left column
  if (product.description && layout.elements.description?.visible !== false) {
    const descHeight = addStyledText(pdf, product.description, x, currentY, {
      fontSize: layout.elements.description.fontSize, // USA PT DIRETTO
      fontFamily: layout.elements.description.fontFamily,
      fontStyle: layout.elements.description.fontStyle,
      fontColor: layout.elements.description.fontColor,
      alignment: layout.elements.description.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descHeight + layout.elements.description.margin.bottom;
  }
  
  // Product description (English) in left column
  if (product.description_en && product.description_en !== product.description && layout.elements.descriptionEng?.visible !== false) {
    const descEngHeight = addStyledText(pdf, product.description_en, x, currentY, {
      fontSize: layout.elements.descriptionEng.fontSize, // USA PT DIRETTO
      fontFamily: layout.elements.descriptionEng.fontFamily,
      fontStyle: layout.elements.descriptionEng.fontStyle,
      fontColor: layout.elements.descriptionEng.fontColor,
      alignment: layout.elements.descriptionEng.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descEngHeight + layout.elements.descriptionEng.margin.bottom;
  }
  
  // Product features in left column con dimensioni corrette
  if (product.features && product.features.length > 0 && layout.productFeatures?.icon) {
    const featuresHeight = await addProductFeaturesToPdf(pdf, product, x, currentY, layout, contentColumnWidth);
    currentY += featuresHeight;
  }
  
  // Allergens with "Allergeni:" label in left column
  if (product.allergens && product.allergens.length > 0 && layout.elements.allergensList?.visible !== false) {
    const allergensText = `Allergeni: ${product.allergens.map(a => a.number).join(', ')}`;
    const allergensHeight = addStyledText(pdf, allergensText, x, currentY, {
      fontSize: layout.elements.allergensList.fontSize, // USA PT DIRETTO
      fontFamily: layout.elements.allergensList.fontFamily,
      fontStyle: layout.elements.allergensList.fontStyle,
      fontColor: layout.elements.allergensList.fontColor,
      alignment: layout.elements.allergensList.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += allergensHeight + layout.elements.allergensList.margin.bottom;
  }
  
  // ✅ PRICE IN RIGHT COLUMN (10%) - STESSA Y DEL TITOLO
  let priceY = y; // Inizia dalla stessa posizione del titolo
  
  if (product.price_standard && layout.elements.price?.visible !== false) {
    const priceText = `€${product.price_standard.toFixed(2)}`;
    addStyledText(pdf, priceText, priceColumnX, priceY, {
      fontSize: layout.elements.price.fontSize, // USA PT DIRETTO
      fontFamily: layout.elements.price.fontFamily,
      fontStyle: layout.elements.price.fontStyle,
      fontColor: layout.elements.price.fontColor,
      alignment: 'right',
      maxWidth: priceColumnWidth
    });
    
    // Price suffix
    if (product.has_price_suffix && product.price_suffix && layout.elements.suffix?.visible !== false) {
      priceY += layout.elements.price.fontSize * 0.353 + 2; // Usa line height corretto
      addStyledText(pdf, product.price_suffix, priceColumnX, priceY, {
        fontSize: layout.elements.suffix.fontSize, // USA PT DIRETTO
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
        fontSize: layout.elements.priceVariants.fontSize, // USA PT DIRETTO
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
        fontSize: layout.elements.priceVariants.fontSize, // USA PT DIRETTO
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
    currentY += layout.spacing.betweenProducts; // USA VALORE MM DIRETTO
  }
  
  return currentY - y;
};