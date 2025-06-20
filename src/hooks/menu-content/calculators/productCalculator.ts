
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

export const calculateProductHeight = (product: Product, layout: PrintLayout | null): number => {
  if (!layout) return 80; // Default height in mm

  const dimensions = getStandardizedDimensions(layout);
  let totalHeightMm = 0;
  const pageConfig = layout.page;
  
  console.log('🔧 ProductCalculator con CORREZIONI ANTI-TAGLIO - AGGIORNATO:', product.title);
  console.log('🔧 ProductCalculator - Dimensioni standardizzate con buffer aumentati:', {
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
  
  console.log('🔧 ProductCalculator Schema 1 dimensioni CORRETTE con ANTI-TAGLIO:', {
    contentWidthMm: contentWidthMm.toFixed(1),
    productDetailsWidthMm: productDetailsWidthMm.toFixed(1),
    schema: 'Schema 1 (90%/10%) - ANTI-TAGLIO ATTIVATO'
  });

  // Calcola altezza del titolo con conversioni standardizzate + BUFFER
  if (layout.elements.title?.visible !== false) {
    const titleFontSizePx = dimensions.css.titleFontSize;
    const titleHeightPx = calculateTextHeight(
      product.title,
      titleFontSizePx,
      layout.elements.title.fontFamily,
      productDetailsWidthPx,
      1.4 // 🔥 Aumentato line-height da 1.3 a 1.4
    );
    const titleHeightMm = titleHeightPx * CONVERSIONS.PX_TO_MM;
    const titleMarginMm = layout.elements.title.margin.top + layout.elements.title.margin.bottom;
    const titleBufferMm = 2; // 🔥 2mm di buffer extra per il titolo
    totalHeightMm += titleHeightMm + titleMarginMm + titleBufferMm;
    
    console.log('🔧 Title height con ANTI-TAGLIO:', {
      titleHeightPx: titleHeightPx.toFixed(1),
      titleHeightMm: titleHeightMm.toFixed(1),
      titleMarginMm,
      titleBufferMm: titleBufferMm + 'mm (NUOVO)',
      totalWithBuffer: (titleHeightMm + titleMarginMm + titleBufferMm).toFixed(1) + 'mm'
    });
  }

  // Calcola altezza della descrizione italiana + BUFFER
  if (product.description && layout.elements.description?.visible !== false) {
    const descFontSizePx = dimensions.css.descriptionFontSize;
    const descHeightPx = calculateTextHeight(
      product.description,
      descFontSizePx,
      layout.elements.description.fontFamily,
      productDetailsWidthPx,
      1.5 // 🔥 Aumentato line-height da 1.4 a 1.5
    );
    const descHeightMm = descHeightPx * CONVERSIONS.PX_TO_MM;
    const descMarginMm = layout.elements.description.margin.top + layout.elements.description.margin.bottom;
    const descBufferMm = product.description.length > 100 ? 4 : 2; // 🔥 Buffer variabile per descrizioni lunghe
    totalHeightMm += descHeightMm + descMarginMm + descBufferMm;
    
    console.log('🔧 Description height con ANTI-TAGLIO:', {
      descHeightPx: descHeightPx.toFixed(1),
      descHeightMm: descHeightMm.toFixed(1),
      descMarginMm,
      descBufferMm: descBufferMm + 'mm (NUOVO - variabile)',
      isLongDescription: product.description.length > 100,
      totalWithBuffer: (descHeightMm + descMarginMm + descBufferMm).toFixed(1) + 'mm'
    });
  }

  // Calcola altezza della descrizione inglese + BUFFER
  if (shouldShowEnglishDescription(product) && layout.elements.descriptionEng?.visible !== false) {
    const descEngFontSizePx = dimensions.css.descriptionEngFontSize;
    const descEngHeightPx = calculateTextHeight(
      product.description_en!,
      descEngFontSizePx,
      layout.elements.descriptionEng.fontFamily,
      productDetailsWidthPx,
      1.5 // 🔥 Aumentato line-height da 1.4 a 1.5
    );
    const descEngHeightMm = descEngHeightPx * CONVERSIONS.PX_TO_MM;
    const descEngMarginMm = layout.elements.descriptionEng.margin.top + layout.elements.descriptionEng.margin.bottom;
    const descEngBufferMm = 3; // 🔥 3mm di buffer per la descrizione inglese
    totalHeightMm += descEngHeightMm + descEngMarginMm + descEngBufferMm;
    
    console.log('🔧 Description ENG height con ANTI-TAGLIO:', {
      descEngHeightPx: descEngHeightPx.toFixed(1),
      descEngHeightMm: descEngHeightMm.toFixed(1),
      descEngMarginMm,
      descEngBufferMm: descEngBufferMm + 'mm (NUOVO)',
      totalWithBuffer: (descEngHeightMm + descEngMarginMm + descEngBufferMm).toFixed(1) + 'mm'
    });
  }
  
  // ✅ NUOVA LOGICA: Riga combinata allergeni + icone caratteristiche + BUFFER MAGGIORE
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
        productDetailsWidthPx * 0.65, // 🔥 Ridotto da 0.7 a 0.65 per più spazio
        1.6 // 🔥 Aumentato line-height da 1.5 a 1.6
      );
      const allergensHeightMm = allergensHeightPx * CONVERSIONS.PX_TO_MM;
      combinedRowHeightMm = Math.max(combinedRowHeightMm, allergensHeightMm);
    }
    
    // Calcola altezza delle icone caratteristiche (se presenti) + BUFFER
    if (hasFeatures) {
      const iconHeightMm = dimensions.icons.heightMm;
      const iconBufferMm = 2; // 🔥 2mm di buffer extra per le icone
      combinedRowHeightMm = Math.max(combinedRowHeightMm, iconHeightMm + iconBufferMm);
    }
    
    // Aggiungi margini della riga combinata + BUFFER EXTRA
    const combinedRowMarginMm = layout.elements.allergensList.margin.top + layout.elements.allergensList.margin.bottom;
    const combinedRowBufferMm = 4; // 🔥 4mm di buffer extra per la riga combinata
    totalHeightMm += combinedRowHeightMm + combinedRowMarginMm + combinedRowBufferMm;
    
    console.log('🔧 Combined allergens + features row height con ANTI-TAGLIO:', {
      combinedRowHeightMm: combinedRowHeightMm.toFixed(1),
      combinedRowMarginMm,
      combinedRowBufferMm: combinedRowBufferMm + 'mm (NUOVO)',
      totalWithBuffer: (combinedRowHeightMm + combinedRowMarginMm + combinedRowBufferMm).toFixed(1) + 'mm',
      hasAllergens,
      hasFeatures
    });
  }

  // Calcola l'altezza della colonna prezzo (10% nel Schema 1) per confronto + BUFFER
  let priceColumnHeightMm = 0;
  
  // Prezzo principale
  if (layout.elements.price?.visible !== false) {
    const priceFontSizeMm = CONVERSIONS.PT_TO_MM * layout.elements.price.fontSize;
    const priceHeightMm = priceFontSizeMm * 1.6; // 🔥 Aumentato da 1.5 a 1.6
    const priceMarginMm = layout.elements.price.margin.top + layout.elements.price.margin.bottom;
    priceColumnHeightMm += priceHeightMm + priceMarginMm;
  }

  // Suffisso prezzo + BUFFER
  if (product.has_price_suffix && product.price_suffix) {
    const suffixFontSizeMm = CONVERSIONS.PT_TO_MM * layout.elements.suffix.fontSize;
    const suffixHeightMm = suffixFontSizeMm * 1.6; // 🔥 Aumentato da 1.5 a 1.6
    const suffixBufferMm = 1; // 🔥 1mm di buffer per il suffisso
    priceColumnHeightMm += suffixHeightMm + suffixBufferMm;
  }

  // Varianti prezzo + BUFFER
  if (product.has_multiple_prices && layout.elements.priceVariants?.visible !== false) {
    const variantsFontSizeMm = CONVERSIONS.PT_TO_MM * layout.elements.priceVariants.fontSize;
    const variantsLineHeightMm = variantsFontSizeMm * 1.6; // 🔥 Aumentato da 1.5 a 1.6
    const variantsMarginMm = layout.elements.priceVariants.margin.top + layout.elements.priceVariants.margin.bottom;
    
    let variantLines = 0;
    if (product.price_variant_1_value) variantLines += 1;
    if (product.price_variant_2_value) variantLines += 1;
    
    const variantsBufferMm = variantLines * 1; // 🔥 1mm di buffer per ogni variante
    priceColumnHeightMm += (variantsLineHeightMm * variantLines) + variantsMarginMm + variantsBufferMm;
  }

  // Usa l'altezza maggiore tra le due colonne
  totalHeightMm = Math.max(totalHeightMm, priceColumnHeightMm);

  // Aggiungi spacing tra prodotti (standardizzato) + BUFFER
  const spacingMm = layout.spacing?.betweenProducts || 15;
  const spacingBufferMm = 3; // 🔥 3mm di buffer extra per lo spacing
  totalHeightMm += spacingMm + spacingBufferMm;

  // Aggiungi un buffer di sicurezza MAGGIORE
  const safetyBufferMm = 8; // 🔥 Aumentato da 3mm a 8mm
  totalHeightMm += safetyBufferMm;

  console.log('🔧 ProductCalculator - Altezza finale con ANTI-TAGLIO COMPLETO:', {
    totalHeightMm: totalHeightMm.toFixed(1),
    priceColumnHeightMm: priceColumnHeightMm.toFixed(1),
    spacingMm,
    spacingBufferMm: spacingBufferMm + 'mm (NUOVO)',
    safetyBufferMm: safetyBufferMm + 'mm (AUMENTATO da 3mm)',
    totalBuffersAdded: (spacingBufferMm + safetyBufferMm).toFixed(1) + 'mm extra'
  });

  return totalHeightMm;
};
