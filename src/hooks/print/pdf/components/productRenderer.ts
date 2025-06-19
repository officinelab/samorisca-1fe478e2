import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import { addStyledText } from './textRenderer';
import { addSvgIconToPdf } from './iconRenderer';

// Add product features icons with EXACT positioning like preview
const addProductFeaturesToPdf = async (
  pdf: jsPDF,
  product: Product,
  x: number,
  y: number,
  layout: PrintLayout,
  maxContentWidth: number
): Promise<number> => {
  if (!product.features || product.features.length === 0) return 0;
  
  // ✅ DIMENSIONI ESATTE DALL'ANTEPRIMA
  const iconSizePx = layout.productFeatures.icon.iconSize; // px
  const iconSpacingPx = layout.productFeatures.icon.iconSpacing; // px  
  const marginTopMm = layout.productFeatures.icon.marginTop; // mm
  const marginBottomMm = layout.productFeatures.icon.marginBottom; // mm
  
  // Conversione px to mm
  const iconSizeMm = iconSizePx * 0.26458333;
  const iconSpacingMm = iconSpacingPx * 0.26458333;
  
  console.log('🎯 PDF Features rendering:', {
    totalFeatures: product.features.length,
    iconSizePx,
    iconSizeMm: iconSizeMm.toFixed(2),
    spacing: iconSpacingMm.toFixed(2)
  });
  
  let currentX = x;
  const iconsY = y + marginTopMm;
  
  // Renderizza ogni icona in fila
  for (let i = 0; i < product.features.length; i++) {
    const feature = product.features[i];
    if (feature.icon_url) {
      console.log(`🎯 Adding icon ${i + 1}: ${feature.title} at X:${currentX.toFixed(1)}`);
      
      await addSvgIconToPdf(pdf, feature.icon_url, currentX, iconsY, iconSizeMm);
      
      // Sposta X per la prossima icona (solo se non è l'ultima)
      if (i < product.features.length - 1) {
        currentX += iconSizeMm + iconSpacingMm;
      }
      
      // Controlla se eccede la larghezza
      if (currentX + iconSizeMm > x + maxContentWidth) {
        console.log('🎯 Stopping icons - exceeded width');
        break;
      }
    }
  }
  
  return marginTopMm + iconSizeMm + marginBottomMm;
};

// Add product to PDF with EXACT order like preview
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
  
  console.log('🎯 PDF Product rendering con ORDINE CORRETTO:', product.title);
  
  // ✅ LAYOUT ESATTO: 90%/10%  
  const contentColumnWidth = contentWidth * 0.90;
  const priceColumnX = x + contentColumnWidth + 2; // 2mm gap
  const priceColumnWidth = contentWidth * 0.10 - 2;
  
  // ===== COLONNA SINISTRA (90%) - ORDINE ESATTO DELL'ANTEPRIMA =====
  
  // 1. TITOLO PRODOTTO
  const titleHeight = addStyledText(pdf, product.title, x, currentY, {
    fontSize: layout.elements.title.fontSize,
    fontFamily: layout.elements.title.fontFamily,
    fontStyle: layout.elements.title.fontStyle,
    fontColor: layout.elements.title.fontColor,
    alignment: layout.elements.title.alignment,
    maxWidth: contentColumnWidth
  });
  currentY += titleHeight + layout.elements.title.margin.bottom;
  
  // 2. DESCRIZIONE ITALIANA  
  if (product.description && layout.elements.description?.visible !== false) {
    const descHeight = addStyledText(pdf, product.description, x, currentY, {
      fontSize: layout.elements.description.fontSize,
      fontFamily: layout.elements.description.fontFamily,
      fontStyle: layout.elements.description.fontStyle,
      fontColor: layout.elements.description.fontColor,
      alignment: layout.elements.description.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descHeight + layout.elements.description.margin.bottom;
  }
  
  // 3. DESCRIZIONE INGLESE (in corsivo)
  if (product.description_en && product.description_en !== product.description && layout.elements.descriptionEng?.visible !== false) {
    const descEngHeight = addStyledText(pdf, product.description_en, x, currentY, {
      fontSize: layout.elements.descriptionEng.fontSize,
      fontFamily: layout.elements.descriptionEng.fontFamily,
      fontStyle: layout.elements.descriptionEng.fontStyle, // dovrebbe essere 'italic'
      fontColor: layout.elements.descriptionEng.fontColor,
      alignment: layout.elements.descriptionEng.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descEngHeight + layout.elements.descriptionEng.margin.bottom;
  }
  
  // 4. ICONE FEATURES (dopo le descrizioni, prima degli allergeni)
  if (product.features && product.features.length > 0 && layout.productFeatures?.icon) {
    console.log('🎯 Adding features icons at currentY:', currentY.toFixed(1));
    const featuresHeight = await addProductFeaturesToPdf(pdf, product, x, currentY, layout, contentColumnWidth);
    currentY += featuresHeight;
    console.log('🎯 After features, currentY:', currentY.toFixed(1));
  }
  
  // 5. ALLERGENI (DOPO le icone)
  if (product.allergens && product.allergens.length > 0 && layout.elements.allergensList?.visible !== false) {
    const allergensText = `Allergeni: ${product.allergens.map(a => a.number).join(', ')}`;
    const allergensHeight = addStyledText(pdf, allergensText, x, currentY, {
      fontSize: layout.elements.allergensList.fontSize,
      fontFamily: layout.elements.allergensList.fontFamily,
      fontStyle: layout.elements.allergensList.fontStyle,
      fontColor: layout.elements.allergensList.fontColor,
      alignment: layout.elements.allergensList.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += allergensHeight + layout.elements.allergensList.margin.bottom;
  }
  
  // ===== COLONNA DESTRA (10%) - PREZZI =====
  
  let priceY = y; // Inizia alla stessa altezza del titolo
  
  // PREZZO PRINCIPALE
  if (product.price_standard && layout.elements.price?.visible !== false) {
    const priceText = `€${product.price_standard.toFixed(2)}`;
    const priceHeight = addStyledText(pdf, priceText, priceColumnX, priceY, {
      fontSize: layout.elements.price.fontSize,
      fontFamily: layout.elements.price.fontFamily,
      fontStyle: layout.elements.price.fontStyle,
      fontColor: layout.elements.price.fontColor,
      alignment: 'right',
      maxWidth: priceColumnWidth
    });
    priceY += priceHeight + 1; // 1mm spacing
    
    // SUFFISSO PREZZO (es. "al pezzo")
    if (product.has_price_suffix && product.price_suffix && layout.elements.suffix?.visible !== false) {
      addStyledText(pdf, product.price_suffix, priceColumnX, priceY, {
        fontSize: layout.elements.suffix.fontSize,
        fontFamily: layout.elements.suffix.fontFamily,
        fontStyle: layout.elements.suffix.fontStyle,
        fontColor: layout.elements.suffix.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
      priceY += layout.elements.suffix.fontSize * 0.353 + 1;
    }
  }
  
  // VARIANTI PREZZO
  if (product.has_multiple_prices && layout.elements.priceVariants?.visible !== false) {
    if (product.price_variant_1_value && product.price_variant_1_name) {
      priceY += 2; // Extra spacing
      const variant1Text = `${product.price_variant_1_name}: €${product.price_variant_1_value.toFixed(2)}`;
      addStyledText(pdf, variant1Text, priceColumnX, priceY, {
        fontSize: layout.elements.priceVariants.fontSize,
        fontFamily: layout.elements.priceVariants.fontFamily,
        fontStyle: layout.elements.priceVariants.fontStyle,
        fontColor: layout.elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
      priceY += layout.elements.priceVariants.fontSize * 0.353 + 1;
    }
    
    if (product.price_variant_2_value && product.price_variant_2_name) {
      const variant2Text = `${product.price_variant_2_name}: €${product.price_variant_2_value.toFixed(2)}`;
      addStyledText(pdf, variant2Text, priceColumnX, priceY, {
        fontSize: layout.elements.priceVariants.fontSize,
        fontFamily: layout.elements.priceVariants.fontFamily,
        fontStyle: layout.elements.priceVariants.fontStyle,
        fontColor: layout.elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
  }
  
  // SPACING TRA PRODOTTI
  if (!isLast) {
    currentY += layout.spacing.betweenProducts;
  }
  
  console.log(`🎯 Product "${product.title}" completed, total height: ${(currentY - y).toFixed(1)}mm`);
  
  return currentY - y;
};