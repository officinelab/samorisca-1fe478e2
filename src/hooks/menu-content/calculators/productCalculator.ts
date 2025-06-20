
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
  
  console.log('🔧 ProductCalculator PRECISO - Schema 1 (90%/10%):', product.title);
  
  // ✅ CORREZIONE: Usa 90% come nell'anteprima corretta e Schema 1
  const pageWidthMm = 210; // A4 width
  const leftMargin = pageConfig.marginLeft || 25;
  const rightMargin = pageConfig.marginRight || 25;
  const contentWidthMm = pageWidthMm - leftMargin - rightMargin;
  const productDetailsWidthMm = contentWidthMm * 0.90; // ✅ 90% (Schema 1 corretto)
  const productDetailsWidthPx = productDetailsWidthMm * CONVERSIONS.MM_TO_PX;

  // MARGINI NASCOSTI - Fattori di correzione specifici
  const HIDDEN_FACTORS = {
    // Margini CSS impliciti del browser
    browserDefaultMargins: 1.2,
    
    // Line-height che crea spazio extra non calcolato
    lineHeightDiscrepancy: 0.8,
    
    // Font rendering differences tra calcolo e realtà
    fontRenderingBuffer: 1.0,
    
    // Margin collapse imprevisto
    marginCollapseBuffer: 0.5,
    
    // Padding interno degli elementi
    elementInternalPadding: 0.7,
    
    // Arrotondamenti CSS
    cssRoundingLoss: 0.3
  };

  // Calcola altezza del titolo con conversioni standardizzate + correzioni
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
    
    // Aggiungi margini nascosti al titolo
    const titleHiddenMargins = HIDDEN_FACTORS.browserDefaultMargins + HIDDEN_FACTORS.fontRenderingBuffer;
    totalHeightMm += titleHeightMm + titleMarginMm + titleHiddenMargins;
    
    console.log('🔧 Title height PRECISO:', {
      titleHeightPx: titleHeightPx.toFixed(1),
      titleHeightMm: titleHeightMm.toFixed(1),
      titleMarginMm,
      hiddenMargins: titleHiddenMargins.toFixed(2),
      totalWithHidden: (titleHeightMm + titleMarginMm + titleHiddenMargins).toFixed(2)
    });
  }

  // Calcola altezza della descrizione italiana + correzioni
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
    
    // Margini nascosti per descrizioni (più alti per testi lunghi)
    const isLongDescription = product.description.length > 100;
    const descHiddenMargins = HIDDEN_FACTORS.lineHeightDiscrepancy + 
                             HIDDEN_FACTORS.elementInternalPadding + 
                             (isLongDescription ? 2 : 0); // Extra per descrizioni lunghe
    
    totalHeightMm += descHeightMm + descMarginMm + descHiddenMargins;
    
    console.log('🔧 Description height PRECISO:', {
      descHeightPx: descHeightPx.toFixed(1),
      descHeightMm: descHeightMm.toFixed(1),
      descMarginMm,
      isLongDescription,
      hiddenMargins: descHiddenMargins.toFixed(2),
      totalWithHidden: (descHeightMm + descMarginMm + descHiddenMargins).toFixed(2)
    });
  }

  // Calcola altezza della descrizione inglese + correzioni
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
    
    const descEngHiddenMargins = HIDDEN_FACTORS.lineHeightDiscrepancy + HIDDEN_FACTORS.elementInternalPadding;
    totalHeightMm += descEngHeightMm + descEngMarginMm + descEngHiddenMargins;
    
    console.log('🔧 Description ENG height PRECISO:', {
      descEngHeightPx: descEngHeightPx.toFixed(1),
      descEngHeightMm: descEngHeightMm.toFixed(1),
      descEngMarginMm,
      hiddenMargins: descEngHiddenMargins.toFixed(2)
    });
  }
  
  // ✅ LOGICA: Riga combinata allergeni + icone caratteristiche + correzioni
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
    
    // Margini della riga combinata + correzioni nascoste
    const combinedRowMarginMm = layout.elements.allergensList.margin.top + layout.elements.allergensList.margin.bottom;
    const combinedRowHiddenMargins = HIDDEN_FACTORS.elementInternalPadding + HIDDEN_FACTORS.marginCollapseBuffer;
    
    totalHeightMm += combinedRowHeightMm + combinedRowMarginMm + combinedRowHiddenMargins;
    
    console.log('🔧 Combined allergens + features row PRECISO:', {
      combinedRowHeightMm: combinedRowHeightMm.toFixed(1),
      combinedRowMarginMm,
      hiddenMargins: combinedRowHiddenMargins.toFixed(2),
      hasAllergens,
      hasFeatures
    });
  }

  // Calcola l'altezza della colonna prezzo (10% nel Schema 1) per confronto + correzioni
  let priceColumnHeightMm = 0;
  
  // Prezzo principale
  if (layout.elements.price?.visible !== false) {
    const priceFontSizeMm = CONVERSIONS.PT_TO_MM * layout.elements.price.fontSize;
    const priceHeightMm = priceFontSizeMm * 1.5;
    const priceMarginMm = layout.elements.price.margin.top + layout.elements.price.margin.bottom;
    const priceHiddenMargins = HIDDEN_FACTORS.fontRenderingBuffer;
    priceColumnHeightMm += priceHeightMm + priceMarginMm + priceHiddenMargins;
  }

  // Suffisso prezzo
  if (product.has_price_suffix && product.price_suffix) {
    const suffixFontSizeMm = CONVERSIONS.PT_TO_MM * layout.elements.suffix.fontSize;
    const suffixHeightMm = suffixFontSizeMm * 1.5;
    const suffixHiddenMargins = HIDDEN_FACTORS.fontRenderingBuffer * 0.5;
    priceColumnHeightMm += suffixHeightMm + suffixHiddenMargins;
  }

  // Varianti prezzo
  if (product.has_multiple_prices && layout.elements.priceVariants?.visible !== false) {
    const variantsFontSizeMm = CONVERSIONS.PT_TO_MM * layout.elements.priceVariants.fontSize;
    const variantsLineHeightMm = variantsFontSizeMm * 1.5;
    const variantsMarginMm = layout.elements.priceVariants.margin.top + layout.elements.priceVariants.margin.bottom;
    const variantsHiddenMargins = HIDDEN_FACTORS.lineHeightDiscrepancy;
    
    let variantLines = 0;
    if (product.price_variant_1_value) variantLines += 1;
    if (product.price_variant_2_value) variantLines += 1;
    
    priceColumnHeightMm += (variantsLineHeightMm * variantLines) + variantsMarginMm + variantsHiddenMargins;
  }

  // Usa l'altezza maggiore tra le due colonne
  totalHeightMm = Math.max(totalHeightMm, priceColumnHeightMm);

  // Aggiungi spacing tra prodotti (standardizzato) + correzioni
  const spacingMm = layout.spacing?.betweenProducts || 15;
  const spacingHiddenMargins = HIDDEN_FACTORS.marginCollapseBuffer + HIDDEN_FACTORS.cssRoundingLoss;
  totalHeightMm += spacingMm + spacingHiddenMargins;

  // Buffer di sicurezza AUMENTATO significativamente
  const safetyBufferMm = 8; // Da 3mm a 8mm
  totalHeightMm += safetyBufferMm;

  // Margini nascosti globali finali
  const globalHiddenMargins = Object.values(HIDDEN_FACTORS).reduce((sum, factor) => sum + factor, 0);
  totalHeightMm += globalHiddenMargins;

  console.log('🔧 ProductCalculator - Altezza finale PRECISA con margini nascosti:', {
    baseHeight: (totalHeightMm - globalHiddenMargins - safetyBufferMm).toFixed(1),
    hiddenFactors: {
      browserDefaultMargins: HIDDEN_FACTORS.browserDefaultMargins,
      lineHeightDiscrepancy: HIDDEN_FACTORS.lineHeightDiscrepancy,
      fontRenderingBuffer: HIDDEN_FACTORS.fontRenderingBuffer,
      marginCollapseBuffer: HIDDEN_FACTORS.marginCollapseBuffer,
      elementInternalPadding: HIDDEN_FACTORS.elementInternalPadding,
      cssRoundingLoss: HIDDEN_FACTORS.cssRoundingLoss,
      total: globalHiddenMargins.toFixed(2)
    },
    safetyBufferMm,
    totalHeightMm: totalHeightMm.toFixed(1),
    priceColumnHeightMm: priceColumnHeightMm.toFixed(1),
    spacingMm
  });

  return totalHeightMm;
};
