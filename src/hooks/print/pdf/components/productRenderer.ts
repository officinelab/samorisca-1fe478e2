
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import { addStyledText } from './textRenderer';
import { addSvgIconToPdf } from './iconRenderer';
import { getStandardizedDimensions } from '../utils/conversionUtils';

// Aggiungi icone features al PDF - IDENTICO all'anteprima AGGIORNATA
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
  let currentX = x;
  
  console.log('🎯 PDF Features rendering - IDENTICO anteprima AGGIORNATA:', {
    iconSizeMm: dimensions.icons.sizeMm,
    iconSpacingMm: dimensions.icons.spacingMm,
    marginTopMm: dimensions.icons.marginTopMm,
    marginBottomMm: dimensions.icons.marginBottomMm
  });
  
  for (let i = 0; i < product.features.length; i++) {
    const feature = product.features[i];
    if (feature.icon_url) {
      await addSvgIconToPdf(pdf, feature.icon_url, currentX, y, dimensions.icons.sizeMm);
      
      if (i < product.features.length - 1) {
        currentX += dimensions.icons.sizeMm + dimensions.icons.spacingMm;
      }
      
      if (currentX + dimensions.icons.sizeMm > x + maxContentWidth) {
        break;
      }
    }
  }
  
  return dimensions.icons.heightMm; // Altezza totale inclusi margini
};

// Renderer prodotto PDF - IDENTICO logica anteprima Schema 1 AGGIORNATO
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
  
  console.log('🎯 PDF Product rendering - SCHEMA 1 AGGIORNATO (allergeni+icone):', product.title);
  console.log('🎯 ContentWidth totale:', contentWidth.toFixed(1), 'mm');
  
  // ✅ COLONNE IDENTICHE ALL'ANTEPRIMA - Schema 1 (90%/10%)
  const leftColumnWidth = contentWidth * 0.90;    // 90% per contenuto
  const gap = 3;                                   // 3mm gap (come anteprima)
  const rightColumnStart = x + leftColumnWidth + gap;
  const rightColumnWidth = contentWidth - leftColumnWidth - gap;
  
  console.log('📐 Colonne PDF IDENTICHE anteprima Schema 1 AGGIORNATO:', {
    leftColumnWidth: leftColumnWidth.toFixed(1) + 'mm',
    gap: gap + 'mm', 
    rightColumnStart: rightColumnStart.toFixed(1) + 'mm',
    rightColumnWidth: rightColumnWidth.toFixed(1) + 'mm',
    schema: 'Schema 1 (90%/10%) AGGIORNATO'
  });
  
  // ===== COLONNA SINISTRA (90%) - CONTENUTO PRODOTTO =====
  
  // 1. TITOLO PRODOTTO - Font size e margini IDENTICI
  if (layout.elements.title?.visible !== false) {
    console.log('🎯 Adding title at Y:', currentY.toFixed(1));
    const titleHeight = addStyledText(pdf, product.title, x, currentY, {
      fontSize: dimensions.pdf.titleFontSize,      // IDENTICO CSS
      fontFamily: layout.elements.title.fontFamily,
      fontStyle: layout.elements.title.fontStyle,
      fontColor: layout.elements.title.fontColor,
      alignment: layout.elements.title.alignment,
      maxWidth: leftColumnWidth
    });
    currentY += titleHeight + dimensions.pdfMargins.title.bottom;
  }
  
  // 2. DESCRIZIONE ITALIANA - Font size e margini IDENTICI
  if (product.description && layout.elements.description?.visible !== false) {
    console.log('🎯 Adding description at Y:', currentY.toFixed(1));
    const descHeight = addStyledText(pdf, product.description, x, currentY, {
      fontSize: dimensions.pdf.descriptionFontSize, // IDENTICO CSS
      fontFamily: layout.elements.description.fontFamily,
      fontStyle: layout.elements.description.fontStyle,
      fontColor: layout.elements.description.fontColor,
      alignment: layout.elements.description.alignment,
      maxWidth: leftColumnWidth
    });
    currentY += descHeight + dimensions.pdfMargins.description.bottom;
  }
  
  // 3. DESCRIZIONE INGLESE - Font size e margini IDENTICI
  if (product.description_en && product.description_en !== product.description && layout.elements.descriptionEng?.visible !== false) {
    console.log('🎯 Adding english description at Y:', currentY.toFixed(1));
    const descEngHeight = addStyledText(pdf, product.description_en, x, currentY, {
      fontSize: dimensions.pdf.descriptionEngFontSize, // IDENTICO CSS
      fontFamily: layout.elements.descriptionEng.fontFamily,
      fontStyle: layout.elements.descriptionEng.fontStyle,
      fontColor: layout.elements.descriptionEng.fontColor,
      alignment: layout.elements.descriptionEng.alignment,
      maxWidth: leftColumnWidth
    });
    currentY += descEngHeight + dimensions.pdfMargins.descriptionEng.bottom;
  }
  
  // ✅ NUOVA LOGICA: RIGA COMBINATA ALLERGENI + ICONE CARATTERISTICHE
  const hasAllergens = product.allergens && product.allergens.length > 0 && layout.elements.allergensList?.visible !== false;
  const hasFeatures = product.features && product.features.length > 0 && layout.productFeatures?.icon;
  
  if (hasAllergens || hasFeatures) {
    console.log('🎯 Adding combined allergens + features row at Y:', currentY.toFixed(1));
    let combinedRowHeight = 0;
    let allergensWidth = 0;
    
    // Aggiungi allergeni
    if (hasAllergens) {
      const allergensText = `Allergeni: ${product.allergens!.map(a => a.number).join(', ')}`;
      const allergensHeight = addStyledText(pdf, allergensText, x, currentY, {
        fontSize: dimensions.pdf.allergensFontSize, // IDENTICO CSS
        fontFamily: layout.elements.allergensList.fontFamily,
        fontStyle: layout.elements.allergensList.fontStyle,
        fontColor: layout.elements.allergensList.fontColor,
        alignment: layout.elements.allergensList.alignment,
        maxWidth: leftColumnWidth * 0.7 // Lascia spazio per le icone
      });
      combinedRowHeight = Math.max(combinedRowHeight, allergensHeight);
      
      // Calcola larghezza approssimativa del testo allergeni
      allergensWidth = (allergensText.length * dimensions.pdf.allergensFontSize * 0.6);
    }
    
    // Aggiungi icone features nella stessa riga
    if (hasFeatures) {
      const iconsStartX = x + allergensWidth + 8; // 8mm gap dal testo allergeni
      const featuresHeight = await addProductFeaturesToPdf(pdf, product, iconsStartX, currentY, layout, leftColumnWidth - allergensWidth - 8);
      combinedRowHeight = Math.max(combinedRowHeight, featuresHeight);
    }
    
    currentY += combinedRowHeight + dimensions.pdfMargins.allergens.bottom;
  }
  
  // ===== COLONNA DESTRA (10%) - PREZZI ALLINEATI =====
  
  let priceY = y; // Inizia alla stessa altezza del titolo
  
  console.log('🎯 Adding prices in right column at X:', rightColumnStart.toFixed(1));
  
  // PREZZO PRINCIPALE - Font size IDENTICO, allineamento a destra
  if (product.price_standard && layout.elements.price?.visible !== false) {
    const priceText = `€${product.price_standard.toFixed(2)}`;
    console.log('🎯 Adding main price:', priceText, 'at Y:', priceY.toFixed(1));
    
    const priceHeight = addStyledText(pdf, priceText, rightColumnStart, priceY, {
      fontSize: dimensions.pdf.priceFontSize,      // IDENTICO CSS
      fontFamily: layout.elements.price.fontFamily,
      fontStyle: layout.elements.price.fontStyle,
      fontColor: layout.elements.price.fontColor,
      alignment: 'right',
      maxWidth: rightColumnWidth
    });
    
    priceY += priceHeight + 2;
    
    // SUFFISSO PREZZO - Font size IDENTICO
    if (product.has_price_suffix && product.price_suffix && layout.elements.suffix?.visible !== false) {
      console.log('🎯 Adding price suffix:', product.price_suffix, 'at Y:', priceY.toFixed(1));
      
      addStyledText(pdf, product.price_suffix, rightColumnStart, priceY, {
        fontSize: dimensions.pdf.suffixFontSize,    // IDENTICO CSS
        fontFamily: layout.elements.suffix.fontFamily,
        fontStyle: layout.elements.suffix.fontStyle,
        fontColor: layout.elements.suffix.fontColor,
        alignment: 'right',
        maxWidth: rightColumnWidth
      });
      
      priceY += dimensions.pdf.suffixFontSize * 0.352778 + 2; // pt→mm
    }
  }
  
  // VARIANTI PREZZO - Font size IDENTICO
  if (product.has_multiple_prices && layout.elements.priceVariants?.visible !== false) {
    if (product.price_variant_1_value && product.price_variant_1_name) {
      priceY += 3;
      const variant1Text = `${product.price_variant_1_name}: €${product.price_variant_1_value.toFixed(2)}`;
      
      addStyledText(pdf, variant1Text, rightColumnStart, priceY, {
        fontSize: dimensions.pdf.variantsFontSize,  // IDENTICO CSS
        fontFamily: layout.elements.priceVariants.fontFamily,
        fontStyle: layout.elements.priceVariants.fontStyle,
        fontColor: layout.elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: rightColumnWidth
      });
      
      priceY += dimensions.pdf.variantsFontSize * 0.352778 + 2; // pt→mm
    }
    
    if (product.price_variant_2_value && product.price_variant_2_name) {
      const variant2Text = `${product.price_variant_2_name}: €${product.price_variant_2_value.toFixed(2)}`;
      
      addStyledText(pdf, variant2Text, rightColumnStart, priceY, {
        fontSize: dimensions.pdf.variantsFontSize,  // IDENTICO CSS
        fontFamily: layout.elements.priceVariants.fontFamily,
        fontStyle: layout.elements.priceVariants.fontStyle,
        fontColor: layout.elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: rightColumnWidth
      });
    }
  }
  
  // SPACING TRA PRODOTTI - IDENTICO anteprima
  if (!isLast) {
    currentY += dimensions.spacing.betweenProducts;
  }
  
  console.log(`🎯 Product "${product.title}" completed IDENTICO anteprima AGGIORNATA`);
  console.log(`🎯 Left column ended at Y: ${currentY.toFixed(1)}mm`);
  console.log(`🎯 Right column ended at Y: ${priceY.toFixed(1)}mm`);
  
  return currentY - y;
};
