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
  
  const iconSizePx = layout.productFeatures.icon.iconSize;
  const iconSpacingPx = layout.productFeatures.icon.iconSpacing;
  const marginTopMm = layout.productFeatures.icon.marginTop;
  const marginBottomMm = layout.productFeatures.icon.marginBottom;
  
  const iconSizeMm = iconSizePx * 0.26458333;
  const iconSpacingMm = iconSpacingPx * 0.26458333;
  
  let currentX = x;
  const iconsY = y + marginTopMm;
  
  for (let i = 0; i < product.features.length; i++) {
    const feature = product.features[i];
    if (feature.icon_url) {
      await addSvgIconToPdf(pdf, feature.icon_url, currentX, iconsY, iconSizeMm);
      
      if (i < product.features.length - 1) {
        currentX += iconSizeMm + iconSpacingMm;
      }
      
      if (currentX + iconSizeMm > x + maxContentWidth) {
        break;
      }
    }
  }
  
  return marginTopMm + iconSizeMm + marginBottomMm;
};

// Add product to PDF with PROPERLY CALCULATED COLUMNS
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
  
  console.log('🎯 PDF Product rendering con COLONNE CORRETTE:', product.title);
  console.log('🎯 ContentWidth totale:', contentWidth.toFixed(1), 'mm');
  
  // ✅ CALCOLO COLONNE CORRETTO per evitare sovrapposizioni
  const leftColumnWidth = contentWidth * 0.75;    // 75% per contenuto (più conservativo)
  const gap = 5;                                   // 5mm gap tra colonne  
  const rightColumnStart = x + leftColumnWidth + gap;
  const rightColumnWidth = contentWidth - leftColumnWidth - gap; // Resto per prezzo
  
  console.log('📐 Colonne PDF CORRETTE:', {
    leftColumnWidth: leftColumnWidth.toFixed(1) + 'mm',
    gap: gap + 'mm', 
    rightColumnStart: rightColumnStart.toFixed(1) + 'mm',
    rightColumnWidth: rightColumnWidth.toFixed(1) + 'mm',
    totalUsed: (leftColumnWidth + gap + rightColumnWidth).toFixed(1) + 'mm'
  });
  
  // ===== COLONNA SINISTRA (75%) - CONTENUTO PRODOTTO =====
  
  // 1. TITOLO PRODOTTO
  console.log('🎯 Adding title at Y:', currentY.toFixed(1));
  const titleHeight = addStyledText(pdf, product.title, x, currentY, {
    fontSize: layout.elements.title.fontSize,
    fontFamily: layout.elements.title.fontFamily,
    fontStyle: layout.elements.title.fontStyle,
    fontColor: layout.elements.title.fontColor,
    alignment: layout.elements.title.alignment,
    maxWidth: leftColumnWidth // ✅ Limita alla colonna sinistra
  });
  currentY += titleHeight + layout.elements.title.margin.bottom;
  
  // 2. DESCRIZIONE ITALIANA
  if (product.description && layout.elements.description?.visible !== false) {
    console.log('🎯 Adding description at Y:', currentY.toFixed(1));
    const descHeight = addStyledText(pdf, product.description, x, currentY, {
      fontSize: layout.elements.description.fontSize,
      fontFamily: layout.elements.description.fontFamily,
      fontStyle: layout.elements.description.fontStyle,
      fontColor: layout.elements.description.fontColor,
      alignment: layout.elements.description.alignment,
      maxWidth: leftColumnWidth // ✅ Limita alla colonna sinistra
    });
    currentY += descHeight + layout.elements.description.margin.bottom;
  }
  
  // 3. DESCRIZIONE INGLESE (corsivo)
  if (product.description_en && product.description_en !== product.description && layout.elements.descriptionEng?.visible !== false) {
    console.log('🎯 Adding english description at Y:', currentY.toFixed(1));
    const descEngHeight = addStyledText(pdf, product.description_en, x, currentY, {
      fontSize: layout.elements.descriptionEng.fontSize,
      fontFamily: layout.elements.descriptionEng.fontFamily,
      fontStyle: layout.elements.descriptionEng.fontStyle,
      fontColor: layout.elements.descriptionEng.fontColor,
      alignment: layout.elements.descriptionEng.alignment,
      maxWidth: leftColumnWidth // ✅ Limita alla colonna sinistra
    });
    currentY += descEngHeight + layout.elements.descriptionEng.margin.bottom;
  }
  
  // 4. ICONE FEATURES
  if (product.features && product.features.length > 0 && layout.productFeatures?.icon) {
    console.log('🎯 Adding features at Y:', currentY.toFixed(1));
    const featuresHeight = await addProductFeaturesToPdf(pdf, product, x, currentY, layout, leftColumnWidth);
    currentY += featuresHeight;
  }
  
  // 5. ALLERGENI
  if (product.allergens && product.allergens.length > 0 && layout.elements.allergensList?.visible !== false) {
    console.log('🎯 Adding allergens at Y:', currentY.toFixed(1));
    const allergensText = `Allergeni: ${product.allergens.map(a => a.number).join(', ')}`;
    const allergensHeight = addStyledText(pdf, allergensText, x, currentY, {
      fontSize: layout.elements.allergensList.fontSize,
      fontFamily: layout.elements.allergensList.fontFamily,
      fontStyle: layout.elements.allergensList.fontStyle,
      fontColor: layout.elements.allergensList.fontColor,
      alignment: layout.elements.allergensList.alignment,
      maxWidth: leftColumnWidth // ✅ Limita alla colonna sinistra
    });
    currentY += allergensHeight + layout.elements.allergensList.margin.bottom;
  }
  
  // ===== COLONNA DESTRA (~25%) - PREZZI ALLINEATI =====
  
  let priceY = y; // Inizia alla stessa altezza del titolo
  
  console.log('🎯 Adding prices in right column at X:', rightColumnStart.toFixed(1));
  
  // PREZZO PRINCIPALE - ALLINEATO A DESTRA
  if (product.price_standard && layout.elements.price?.visible !== false) {
    const priceText = `€${product.price_standard.toFixed(2)}`;
    console.log('🎯 Adding main price:', priceText, 'at Y:', priceY.toFixed(1));
    
    const priceHeight = addStyledText(pdf, priceText, rightColumnStart, priceY, {
      fontSize: layout.elements.price.fontSize,
      fontFamily: layout.elements.price.fontFamily,
      fontStyle: layout.elements.price.fontStyle,
      fontColor: layout.elements.price.fontColor,
      alignment: 'right', // ✅ Allineato a destra
      maxWidth: rightColumnWidth
    });
    
    priceY += priceHeight + 2; // 2mm spacing
    
    // SUFFISSO PREZZO - ALLINEATO A DESTRA sotto il prezzo
    if (product.has_price_suffix && product.price_suffix && layout.elements.suffix?.visible !== false) {
      console.log('🎯 Adding price suffix:', product.price_suffix, 'at Y:', priceY.toFixed(1));
      
      addStyledText(pdf, product.price_suffix, rightColumnStart, priceY, {
        fontSize: layout.elements.suffix.fontSize,
        fontFamily: layout.elements.suffix.fontFamily,
        fontStyle: layout.elements.suffix.fontStyle,
        fontColor: layout.elements.suffix.fontColor,
        alignment: 'right', // ✅ Allineato a destra
        maxWidth: rightColumnWidth
      });
      
      priceY += layout.elements.suffix.fontSize * 0.353 + 2;
    }
  }
  
  // VARIANTI PREZZO - ALLINEATE A DESTRA
  if (product.has_multiple_prices && layout.elements.priceVariants?.visible !== false) {
    if (product.price_variant_1_value && product.price_variant_1_name) {
      priceY += 3; // Extra spacing
      const variant1Text = `${product.price_variant_1_name}: €${product.price_variant_1_value.toFixed(2)}`;
      
      addStyledText(pdf, variant1Text, rightColumnStart, priceY, {
        fontSize: layout.elements.priceVariants.fontSize,
        fontFamily: layout.elements.priceVariants.fontFamily,
        fontStyle: layout.elements.priceVariants.fontStyle,
        fontColor: layout.elements.priceVariants.fontColor,
        alignment: 'right', // ✅ Allineato a destra
        maxWidth: rightColumnWidth
      });
      
      priceY += layout.elements.priceVariants.fontSize * 0.353 + 2;
    }
    
    if (product.price_variant_2_value && product.price_variant_2_name) {
      const variant2Text = `${product.price_variant_2_name}: €${product.price_variant_2_value.toFixed(2)}`;
      
      addStyledText(pdf, variant2Text, rightColumnStart, priceY, {
        fontSize: layout.elements.priceVariants.fontSize,
        fontFamily: layout.elements.priceVariants.fontFamily,
        fontStyle: layout.elements.priceVariants.fontStyle,
        fontColor: layout.elements.priceVariants.fontColor,
        alignment: 'right', // ✅ Allineato a destra
        maxWidth: rightColumnWidth
      });
    }
  }
  
  // SPACING TRA PRODOTTI
  if (!isLast) {
    currentY += layout.spacing.betweenProducts;
  }
  
  console.log(`🎯 Product "${product.title}" completed`);
  console.log(`🎯 Left column ended at Y: ${currentY.toFixed(1)}mm`);
  console.log(`🎯 Right column ended at Y: ${priceY.toFixed(1)}mm`);
  
  return currentY - y;
};