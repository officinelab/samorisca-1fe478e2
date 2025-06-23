
import { Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { getStandardizedDimensions, CONVERSIONS } from "@/hooks/print/pdf/utils/conversionUtils";

/**
 * Verifica se un prodotto ha caratteristiche speciali (features)
 */
const hasProductFeatures = (product: Product): boolean => {
  return !!(product.features && product.features.length > 0);
};

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

/**
 * Calcola l'altezza reale di un prodotto con conversioni standardizzate.
 */
export const getProductHeight = (
  product: Product,
  language: string,
  customLayout: PrintLayout | null | undefined,
  pageIndex: number
): number => {
  if (!customLayout?.elements) {
    // Fallback: stima basata su contenuto tipico
    return 80 * CONVERSIONS.MM_TO_PX; // ~80mm di default
  }

  const dimensions = getStandardizedDimensions(customLayout);
  let totalHeight = 0;

  console.log('🔧 ProductHeightCalculator (aggiornato) - Product:', product.title);
  console.log('🔧 ProductHeightCalculator - Dimensioni standardizzate:', {
    titleFontSizePx: dimensions.css.titleFontSize,
    descriptionFontSizePx: dimensions.css.descriptionFontSize,
    iconHeightMm: dimensions.icons.heightMm,
    spacing: dimensions.spacing.betweenProducts
  });

  // 1. Titolo prodotto
  if (customLayout.elements.title?.visible !== false) {
    const titleLineHeight = dimensions.css.titleFontSize * 1.3;
    const titleMargins = (dimensions.cssMargins.title.top + dimensions.cssMargins.title.bottom);
    totalHeight += titleLineHeight + titleMargins;
  }

  // 2. Descrizione prodotto (può essere multilinea)
  if (customLayout.elements.description?.visible !== false && product.description) {
    const descLineHeight = dimensions.css.descriptionFontSize * 1.4;
    const descMargins = (dimensions.cssMargins.description.top + dimensions.cssMargins.description.bottom);
    
    // Stima del numero di righe basata su larghezza al 75%
    const charsPerLine = 70;
    const estimatedLines = Math.ceil((product.description.length || 0) / charsPerLine);
    totalHeight += (descLineHeight * estimatedLines) + descMargins;
  }

  // 3. Descrizione inglese (se presente e visibile)
  if (customLayout.elements.descriptionEng?.visible !== false && shouldShowEnglishDescription(product)) {
    const descEngLineHeight = dimensions.css.descriptionEngFontSize * 1.4;
    const descEngMargins = (dimensions.cssMargins.descriptionEng.top + dimensions.cssMargins.descriptionEng.bottom);
    
    const charsPerLine = 70;
    const estimatedLines = Math.ceil((product.description_en!.length || 0) / charsPerLine);
    totalHeight += (descEngLineHeight * estimatedLines) + descEngMargins;
  }

  // 4. Lista allergeni
  if (customLayout.elements.allergensList?.visible !== false && product.allergens && product.allergens.length > 0) {
    const allergensLineHeight = dimensions.css.allergensFontSize * 1.5;
    const allergensMargins = (dimensions.cssMargins.allergens.top + dimensions.cssMargins.allergens.bottom);
    totalHeight += allergensLineHeight + allergensMargins;
  }

  // 5. Caratteristiche prodotto (icone) - ORA COMPLETAMENTE STANDARDIZZATO
  if (hasProductFeatures(product) && customLayout.productFeatures?.icon) {
    const totalFeatureHeightPx = dimensions.icons.heightMm * CONVERSIONS.MM_TO_PX;
    totalHeight += totalFeatureHeightPx;
    
    console.log('🔧 ProductHeightCalculator - Features height (standardized):', {
      heightMm: dimensions.icons.heightMm,
      heightPx: totalFeatureHeightPx
    });
  }

  // 6. Calcolo più accurato per la colonna prezzo (25%)
  let priceColumnHeight = 0;
  
  // Prezzo principale
  if (customLayout.elements.price?.visible !== false) {
    const priceLineHeight = dimensions.css.priceFontSize * 1.5;
    const priceMargins = (dimensions.cssMargins.price.top + dimensions.cssMargins.price.bottom);
    priceColumnHeight = priceLineHeight + priceMargins;
  }

  // Suffisso prezzo
  if (product.has_price_suffix && product.price_suffix && customLayout.elements.suffix?.visible !== false) {
    const suffixLineHeight = dimensions.css.suffixFontSize * 1.5;
    priceColumnHeight += suffixLineHeight + 2; // Piccolo spazio tra prezzo e suffisso
  }

  // Varianti prezzo
  if (product.has_multiple_prices && customLayout.elements.priceVariants?.visible !== false) {
    const variantsLineHeight = dimensions.css.variantsFontSize * 1.5;
    const variantsMargins = (dimensions.cssMargins.variants.top + dimensions.cssMargins.variants.bottom);
    
    // Conta le varianti effettive
    let variantLines = 0;
    if (product.price_variant_1_value) variantLines++;
    if (product.price_variant_2_value) variantLines++;
    
    if (variantLines > 0) {
      priceColumnHeight += (variantsLineHeight * variantLines) + variantsMargins;
    }
  }

  // Usa l'altezza maggiore tra contenuto principale e colonna prezzo
  totalHeight = Math.max(totalHeight, priceColumnHeight) + 5; // 5px di margine extra

  // 7. Spacing tra prodotti (standardizzato)
  const spacing = dimensions.spacing.betweenProducts * CONVERSIONS.MM_TO_PX;
  totalHeight += spacing;

  // Determina se il prodotto è complesso
  const isComplex = isComplexProduct(product);
  
  // Applica buffer di sicurezza unificato: 8% + buffer fisso
  let safetyCoefficient = 1.08; // 8% buffer standard
  let fixedBufferPx = 5 * CONVERSIONS.MM_TO_PX; // 5mm convertiti in px
  
  // Per prodotti complessi, usa un buffer leggermente maggiore
  if (isComplex) {
    fixedBufferPx = 7 * CONVERSIONS.MM_TO_PX; // 7mm per prodotti complessi
    console.log('🔧 ProductHeightCalculator - Complex product detected, using enhanced buffer');
  }
  
  const finalHeight = (totalHeight * safetyCoefficient) + fixedBufferPx;

  console.log('🔧 ProductHeightCalculator - Final total height with unified buffer:', {
    originalHeight: totalHeight.toFixed(1) + 'px',
    isComplex,
    safetyCoefficient,
    fixedBufferMm: (fixedBufferPx / CONVERSIONS.MM_TO_PX).toFixed(1) + 'mm',
    finalHeight: finalHeight.toFixed(1) + 'px',
    bufferAdded: (finalHeight - totalHeight).toFixed(1) + 'px'
  });

  return finalHeight;
};
