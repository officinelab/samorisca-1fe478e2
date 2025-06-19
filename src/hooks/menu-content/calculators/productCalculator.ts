import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight } from '../utils/textMeasurement';

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

  let totalHeightMm = 0;
  const pageConfig = layout.page;
  
  console.log('🔧 ProductCalculator con layout 90%:', product.title);
  
  // ✅ CORREZIONE: Usa 90% come nell'anteprima (era 75%)
  const pageWidthMm = 210; // A4 width
  const leftMargin = pageConfig.marginLeft || 25;
  const rightMargin = pageConfig.marginRight || 25;
  const contentWidthMm = pageWidthMm - leftMargin - rightMargin;
  const productDetailsWidthMm = contentWidthMm * 0.90; // ✅ Cambiato da 0.75 a 0.90
  const productDetailsWidthPx = productDetailsWidthMm * 3.7795275591; // MM_TO_PX
  
  console.log('🔧 ProductCalculator dimensioni:', {
    contentWidthMm: contentWidthMm.toFixed(1),
    productDetailsWidthMm: productDetailsWidthMm.toFixed(1),
    percentage: '90%'
  });

  // Calcola altezza del titolo
  if (layout.elements.title?.visible !== false) {
    const titleFontSizePx = layout.elements.title.fontSize * 1.333; // pt to px
    const titleHeightPx = calculateTextHeight(
      product.title,
      titleFontSizePx,
      layout.elements.title.fontFamily,
      productDetailsWidthPx,
      1.3
    );
    const titleHeightMm = titleHeightPx * 0.26458333; // PX_TO_MM
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
    const descFontSizePx = layout.elements.description.fontSize * 1.333;
    const descHeightPx = calculateTextHeight(
      product.description,
      descFontSizePx,
      layout.elements.description.fontFamily,
      productDetailsWidthPx,
      1.4
    );
    const descHeightMm = descHeightPx * 0.26458333;
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
    const descEngFontSizePx = layout.elements.descriptionEng.fontSize * 1.333;
    const descEngHeightPx = calculateTextHeight(
      product.description_en!,
      descEngFontSizePx,
      layout.elements.descriptionEng.fontFamily,
      productDetailsWidthPx,
      1.4
    );
    const descEngHeightMm = descEngHeightPx * 0.26458333;
    const descEngMarginMm = layout.elements.descriptionEng.margin.top + layout.elements.descriptionEng.margin.bottom;
    totalHeightMm += descEngHeightMm + descEngMarginMm;
    
    console.log('🔧 Description ENG height:', {
      descEngHeightPx: descEngHeightPx.toFixed(1),
      descEngHeightMm: descEngHeightMm.toFixed(1),
      descEngMarginMm
    });
  }
  
  // Calcola altezza degli allergeni
  if (product.allergens && product.allergens.length > 0 && layout.elements.allergensList?.visible !== false) {
    const allergensText = `Allergeni: ${product.allergens.map(a => a.number).join(', ')}`;
    const allergensFontSizePx = layout.elements.allergensList.fontSize * 1.333;
    const allergensHeightPx = calculateTextHeight(
      allergensText,
      allergensFontSizePx,
      layout.elements.allergensList.fontFamily,
      productDetailsWidthPx,
      1.5
    );
    const allergensHeightMm = allergensHeightPx * 0.26458333;
    const allergensMarginMm = layout.elements.allergensList.margin.top + layout.elements.allergensList.margin.bottom;
    totalHeightMm += allergensHeightMm + allergensMarginMm;
    
    console.log('🔧 Allergens height:', {
      allergensHeightPx: allergensHeightPx.toFixed(1),
      allergensHeightMm: allergensHeightMm.toFixed(1),
      allergensMarginMm
    });
  }

  // Calcola altezza delle caratteristiche prodotto (icone)
  if (product.features && product.features.length > 0 && layout.productFeatures?.icon) {
    const iconSizePx = layout.productFeatures.icon.iconSize; // px
    const marginTopMm = layout.productFeatures.icon.marginTop; // mm
    const marginBottomMm = layout.productFeatures.icon.marginBottom; // mm
    const iconSizeMm = iconSizePx * 0.26458333; // px to mm
    const featuresHeightMm = marginTopMm + iconSizeMm + marginBottomMm;
    totalHeightMm += featuresHeightMm;
    
    console.log('🔧 Features height:', {
      iconSizePx,
      iconSizeMm: iconSizeMm.toFixed(1),
      marginTopMm,
      marginBottomMm,
      featuresHeightMm: featuresHeightMm.toFixed(1)
    });
  }

  // Calcola l'altezza della colonna prezzo (10%) per confronto
  let priceColumnHeightMm = 0;
  
  // Prezzo principale
  if (layout.elements.price?.visible !== false) {
    const priceFontSizeMm = layout.elements.price.fontSize * 0.352778; // pt to mm
    const priceHeightMm = priceFontSizeMm * 1.5;
    const priceMarginMm = layout.elements.price.margin.top + layout.elements.price.margin.bottom;
    priceColumnHeightMm += priceHeightMm + priceMarginMm;
  }

  // Suffisso prezzo
  if (product.has_price_suffix && product.price_suffix) {
    const suffixFontSizeMm = layout.elements.suffix.fontSize * 0.352778; // pt to mm
    const suffixHeightMm = suffixFontSizeMm * 1.5;
    priceColumnHeightMm += suffixHeightMm;
  }

  // Varianti prezzo
  if (product.has_multiple_prices && layout.elements.priceVariants?.visible !== false) {
    const variantsFontSizeMm = layout.elements.priceVariants.fontSize * 0.352778; // pt to mm
    const variantsLineHeightMm = variantsFontSizeMm * 1.5;
    const variantsMarginMm = layout.elements.priceVariants.margin.top + layout.elements.priceVariants.margin.bottom;
    
    let variantLines = 0;
    if (product.price_variant_1_value) variantLines += 1;
    if (product.price_variant_2_value) variantLines += 1;
    
    priceColumnHeightMm += (variantsLineHeightMm * variantLines) + variantsMarginMm;
  }

  // Usa l'altezza maggiore tra le due colonne
  totalHeightMm = Math.max(totalHeightMm, priceColumnHeightMm);

  // Aggiungi spacing tra prodotti
  const spacingMm = layout.spacing?.betweenProducts || 15;
  totalHeightMm += spacingMm;

  // Aggiungi un buffer di sicurezza ridotto
  const safetyBufferMm = 2; // Ridotto da 3 a 2mm
  totalHeightMm += safetyBufferMm;

  console.log('🔧 ProductCalculator - Altezza finale con layout 90%:', {
    totalHeightMm: totalHeightMm.toFixed(1),
    priceColumnHeightMm: priceColumnHeightMm.toFixed(1),
    spacingMm,
    safetyBufferMm
  });

  return totalHeightMm;
};