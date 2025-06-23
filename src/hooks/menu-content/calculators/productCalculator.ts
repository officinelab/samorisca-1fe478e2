
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight } from '../utils/textMeasurement';
import { getStandardizedDimensions, CONVERSIONS } from '@/hooks/print/pdf/utils/conversionUtils';

/**
 * Verifica se deve essere mostrata la descrizione inglese
 */
const shouldShowEnglishDescription = (product: Product): boolean => {
  if (!product.description_en) return false;
  if (product.description_en === product.description) return false;
  return true;
};

/**
 * Determina se un prodotto è complesso e necessita di buffer aggiuntivo
 */
const isComplexProduct = (product: Product): boolean => {
  const hasLongDescription = (product.description?.length || 0) > 150;
  const hasLongEnglishDescription = (product.description_en?.length || 0) > 150;
  const hasManyAllergens = (product.allergens?.length || 0) > 5;
  const hasFeatures = (product.features?.length || 0) > 0;
  
  return hasLongDescription || hasLongEnglishDescription || hasManyAllergens || hasFeatures;
};

export const calculateProductHeight = (product: Product, layout: PrintLayout | null): number => {
  if (!layout) return 80; // Default height in mm

  const dimensions = getStandardizedDimensions(layout);
  let totalHeightMm = 0;
  const pageConfig = layout.page;
  
  console.log('🔧 ProductCalculator con Schema 1 (90%/10%) - AGGIORNATO:', product.title);
  console.log('🔧 ProductCalculator - Dimensioni standardizzate:', {
    titleFontSizeMm: CONVERSIONS.PT_TO_MM * layout.elements.title.fontSize,
    descriptionFontSizeMm: CONVERSIONS.PT_TO_MM * layout.elements.description.fontSize,
    iconSizeMm: dimensions.icons.heightMm,
    spacing: dimensions.spacing.betweenProducts
  });
  
  // ✅ CORREZIONE: Usa 90% come nell'anteprima corretta e Schema 1
  const pageWidthMm = 210; // A4 width
  const leftMargin = pageConfig.marginLeft || 25;
  const rightMargin = pageConfig.marginRight || 25;
  const contentWidthMm = pageWidthMm - leftMargin - rightMargin;
  const productDetailsWidthMm = contentWidthMm * 0.90; // ✅ 90% (Schema 1 corretto)
  const productDetailsWidthPx = productDetailsWidthMm * CONVERSIONS.MM_TO_PX;
  
  console.log('🔧 ProductCalculator Schema 1 dimensioni CORRETTE:', {
    contentWidthMm: contentWidthMm.toFixed(1),
    productDetailsWidthMm: productDetailsWidthMm.toFixed(1),
    schema: 'Schema 1 (90%/10%) - AGGIORNATO'
  });

  // Calcola altezza del titolo con conversioni standardizzate
  if (layout.elements.title?.visible !== false) {
    const titleFontSizePx = dimensions.css.titleFontSize;
    const titleHeightPx = calculateTextHeight(
      product.title,
      titleFontSizePx,
      layout.elements.title.fontFamily,
      productDetailsWidthPx,
      1.3
    );
    const titleHeightMm = titleHeightPx * CONVERSIONS.PX_TO_MM;
    const titleMarginMm = layout.elements.title.margin.top + layout.elements.title.margin.bottom;
    totalHeightMm += titleHeightMm + titleMarginMm;
    
    console.log('🔧 Title height:', {
      titleHeightPx: titleHeightPx.toFixed(1),
      titleHeightMm: titleHeightMm.toFixed(1),
      titleMarginMm
    });
  }

  // Calcola altezza della descrizione italiana
  if (product.description && layout.elements.description?.visible !== false) {
    const descFontSizePx = dimensions.css.descriptionFontSize;
    const descHeightPx = calculateTextHeight(
      product.description,
      descFontSizePx,
      layout.elements.description.fontFamily,
      productDetailsWidthPx,
      1.4
    );
    const descHeightMm = descHeightPx * CONVERSIONS.PX_TO_MM;
    const descMarginMm = layout.elements.description.margin.top + layout.elements.description.margin.bottom;
    totalHeightMm += descHeightMm + descMarginMm;
    
    console.log('🔧 Description height:', {
      descHeightPx: descHeightPx.toFixed(1),
      descHeightMm: descHeightMm.toFixed(1),
      descMarginMm
    });
  }

  // Calcola altezza della descrizione inglese
  if (shouldShowEnglishDescription(product) && layout.elements.descriptionEng?.visible !== false) {
    const descEngFontSizePx = dimensions.css.descriptionEngFontSize;
    const descEngHeightPx = calculateTextHeight(
      product.description_en!,
      descEngFontSizePx,
      layout.elements.descriptionEng.fontFamily,
      productDetailsWidthPx,
      1.4
    );
    const descEngHeightMm = descEngHeightPx * CONVERSIONS.PX_TO_MM;
    const descEngMarginMm = layout.elements.descriptionEng.margin.top + layout.elements.descriptionEng.margin.bottom;
    totalHeightMm += descEngHeightMm + descEngMarginMm;
    
    console.log('🔧 Description ENG height:', {
      descEngHeightPx: descEngHeightPx.toFixed(1),
      descEngHeightMm: descEngHeightMm.toFixed(1),
      descEngMarginMm
    });
  }
  
  // ✅ NUOVA LOGICA: Riga combinata allergeni + icone caratteristiche
  const hasAllergens = product.allergens && product.allergens.length > 0 && layout.elements.allergensList?.visible !== false;
  const hasFeatures = product.features && product.features.length > 0 && layout.productFeatures?.icon;
  
  if (hasAllergens || hasFeatures) {
    let combinedRowHeightMm = 0;
    
    // Calcola altezza degli allergeni (se presenti)
    if (hasAllergens) {
      const allergensText = `Allergeni: ${product.allergens!.map(a => a.number).join(', ')}`;
      const allergensFontSizePx = dimensions.css.allergensFontSize;
      const allergensHeightPx = calculateTextHeight(
        allergensText,
        allergensFontSizePx,
        layout.elements.allergensList.fontFamily,
        productDetailsWidthPx * 0.7, // Ridotto perché condivide la riga con le icone
        1.5
      );
      const allergensHeightMm = allergensHeightPx * CONVERSIONS.PX_TO_MM;
      combinedRowHeightMm = Math.max(combinedRowHeightMm, allergensHeightMm);
    }
    
    // Calcola altezza delle icone caratteristiche (se presenti)
    if (hasFeatures) {
      const iconHeightMm = dimensions.icons.heightMm;
      combinedRowHeightMm = Math.max(combinedRowHeightMm, iconHeightMm);
    }
    
    // Aggiungi margini della riga combinata (usa i margini degli allergeni)
    const combinedRowMarginMm = layout.elements.allergensList.margin.top + layout.elements.allergensList.margin.bottom;
    totalHeightMm += combinedRowHeightMm + combinedRowMarginMm;
    
    console.log('🔧 Combined allergens + features row height:', {
      combinedRowHeightMm: combinedRowHeightMm.toFixed(1),
      combinedRowMarginMm,
      hasAllergens,
      hasFeatures
    });
  }

  // Calcola l'altezza della colonna prezzo (10% nel Schema 1) per confronto
  let priceColumnHeightMm = 0;
  
  // Prezzo principale
  if (layout.elements.price?.visible !== false) {
    const priceFontSizeMm = CONVERSIONS.PT_TO_MM * layout.elements.price.fontSize;
    const priceHeightMm = priceFontSizeMm * 1.5;
    const priceMarginMm = layout.elements.price.margin.top + layout.elements.price.margin.bottom;
    priceColumnHeightMm += priceHeightMm + priceMarginMm;
  }

  // Suffisso prezzo
  if (product.has_price_suffix && product.price_suffix) {
    const suffixFontSizeMm = CONVERSIONS.PT_TO_MM * layout.elements.suffix.fontSize;
    const suffixHeightMm = suffixFontSizeMm * 1.5;
    priceColumnHeightMm += suffixHeightMm;
  }

  // Varianti prezzo
  if (product.has_multiple_prices && layout.elements.priceVariants?.visible !== false) {
    const variantsFontSizeMm = CONVERSIONS.PT_TO_MM * layout.elements.priceVariants.fontSize;
    const variantsLineHeightMm = variantsFontSizeMm * 1.5;
    const variantsMarginMm = layout.elements.priceVariants.margin.top + layout.elements.priceVariants.margin.bottom;
    
    let variantLines = 0;
    if (product.price_variant_1_value) variantLines += 1;
    if (product.price_variant_2_value) variantLines += 1;
    
    priceColumnHeightMm += (variantsLineHeightMm * variantLines) + variantsMarginMm;
  }

  // Usa l'altezza maggiore tra le due colonne
  totalHeightMm = Math.max(totalHeightMm, priceColumnHeightMm);

  // Aggiungi spacing tra prodotti (standardizzato)
  const spacingMm = layout.spacing?.betweenProducts || 15;
  totalHeightMm += spacingMm;

  // Determina se il prodotto è complesso
  const isComplex = isComplexProduct(product);
  
  // Applica buffer di sicurezza unificato: 8% + buffer fisso
  let safetyCoefficient = 1.08; // 8% buffer standard
  let fixedBufferMm = 5; // 5mm buffer fisso standard
  
  // Per prodotti complessi, usa un buffer leggermente maggiore
  if (isComplex) {
    fixedBufferMm = 7; // 7mm per prodotti complessi
    console.log('🔧 Complex product detected in calculator, using enhanced buffer');
  }
  
  const finalHeightMm = (totalHeightMm * safetyCoefficient) + fixedBufferMm;

  console.log('🔧 ProductCalculator - Altezza finale con buffer unificato:', {
    originalHeightMm: totalHeightMm.toFixed(1),
    priceColumnHeightMm: priceColumnHeightMm.toFixed(1),
    spacingMm,
    isComplex,
    safetyCoefficient,
    fixedBufferMm: fixedBufferMm + 'mm',
    finalHeightMm: finalHeightMm.toFixed(1),
    bufferAdded: (finalHeightMm - totalHeightMm).toFixed(1) + 'mm'
  });

  return finalHeightMm;
};
