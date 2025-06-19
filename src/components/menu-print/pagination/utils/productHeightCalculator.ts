
import { Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { MM_TO_PX } from "./constants";

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
 * Calcola l'altezza reale di un prodotto basandosi sul layout e contenuto.
 */
export const getProductHeight = (
  product: Product,
  language: string,
  customLayout: PrintLayout | null | undefined,
  pageIndex: number
): number => {
  if (!customLayout?.elements) {
    // Fallback: stima basata su contenuto tipico
    return 80 * MM_TO_PX; // ~80mm di default
  }

  const elements = customLayout.elements;
  let totalHeight = 0;

  console.log('🔧 ProductHeightCalculator - Product:', product.title);
  console.log('🔧 ProductHeightCalculator - Layout productFeatures:', customLayout.productFeatures);

  // 1. Titolo prodotto
  if (elements.title?.visible !== false) {
    const titleFontSize = elements.title.fontSize || 14;
    const titleLineHeight = titleFontSize * 1.5;
    const titleMargins = elements.title.margin;
    totalHeight += titleLineHeight + (titleMargins.top + titleMargins.bottom) * MM_TO_PX;
  }

  // 2. Descrizione prodotto (può essere multilinea)
  if (elements.description?.visible !== false && product.description) {
    const descFontSize = elements.description.fontSize || 12;
    const descLineHeight = descFontSize * 1.4;
    const descMargins = elements.description.margin;
    
    // Stima più accurata del numero di righe basata su larghezza reale
    // Assumiamo ~60-70 caratteri per riga per una colonna al 90% della larghezza
    const charsPerLine = 70;
    const estimatedLines = Math.ceil((product.description.length || 0) / charsPerLine);
    totalHeight += (descLineHeight * estimatedLines) + (descMargins.top + descMargins.bottom) * MM_TO_PX;
  }

  // 3. Descrizione inglese (se presente e visibile)
  if (elements.descriptionEng?.visible !== false && shouldShowEnglishDescription(product)) {
    const descEngFontSize = elements.descriptionEng.fontSize || 11;
    const descEngLineHeight = descEngFontSize * 1.4;
    const descEngMargins = elements.descriptionEng.margin;
    
    const charsPerLine = 70;
    const estimatedLines = Math.ceil((product.description_en!.length || 0) / charsPerLine);
    totalHeight += (descEngLineHeight * estimatedLines) + (descEngMargins.top + descEngMargins.bottom) * MM_TO_PX;
  }

  // 4. Lista allergeni
  if (elements.allergensList?.visible !== false && product.allergens && product.allergens.length > 0) {
    const allergensFontSize = elements.allergensList.fontSize || 10;
    const allergensLineHeight = allergensFontSize * 1.5;
    const allergensMargins = elements.allergensList.margin;
    totalHeight += allergensLineHeight + (allergensMargins.top + allergensMargins.bottom) * MM_TO_PX;
  }

  // 5. Caratteristiche prodotto (icone) - FIXED: Usa la configurazione corretta dal layout
  if (hasProductFeatures(product) && customLayout.productFeatures?.icon) {
    const featuresConfig = customLayout.productFeatures.icon;
    
    console.log('🔧 ProductHeightCalculator - Features config:', featuresConfig);
    
    // Conversione standardizzata: px -> mm (1px = 0.264583mm)
    const iconSizeMm = (featuresConfig.iconSize || 16) * 0.264583;
    const marginsTopBottomMm = (featuresConfig.marginTop || 0) + (featuresConfig.marginBottom || 0);
    const totalFeatureHeightMm = iconSizeMm + marginsTopBottomMm;
    
    console.log('🔧 ProductHeightCalculator - Icon size:', featuresConfig.iconSize, 'px =', iconSizeMm, 'mm');
    console.log('🔧 ProductHeightCalculator - Margins top+bottom:', marginsTopBottomMm, 'mm');
    console.log('🔧 ProductHeightCalculator - Total feature height:', totalFeatureHeightMm, 'mm');
    
    // Converti in pixel per la consistenza con il resto del calcolo
    const totalFeatureHeightPx = totalFeatureHeightMm * MM_TO_PX;
    totalHeight += totalFeatureHeightPx;
    
    console.log('🔧 ProductHeightCalculator - Total feature height in px:', totalFeatureHeightPx);
  }

  // 6. Calcolo più accurato per la colonna prezzo
  let priceColumnHeight = 0;
  
  // Prezzo principale
  if (elements.price?.visible !== false) {
    const priceFontSize = elements.price.fontSize || 14;
    const priceLineHeight = priceFontSize * 1.5;
    const priceMargins = elements.price.margin;
    priceColumnHeight = priceLineHeight + (priceMargins.top + priceMargins.bottom) * MM_TO_PX;
  }

  // Suffisso prezzo
  if (product.has_price_suffix && product.price_suffix && elements.suffix?.visible !== false) {
    const suffixFontSize = elements.suffix.fontSize || 12;
    const suffixLineHeight = suffixFontSize * 1.5;
    priceColumnHeight += suffixLineHeight + 2; // Piccolo spazio tra prezzo e suffisso
  }

  // Varianti prezzo
  if (product.has_multiple_prices && elements.priceVariants?.visible !== false) {
    const variantsFontSize = elements.priceVariants.fontSize || 12;
    const variantsLineHeight = variantsFontSize * 1.5;
    const variantsMargins = elements.priceVariants.margin;
    
    // Conta le varianti effettive
    let variantLines = 0;
    if (product.price_variant_1_value) {
      variantLines++; // Linea per il prezzo
      if (product.price_variant_1_name) variantLines++; // Linea per il nome
    }
    if (product.price_variant_2_value) {
      variantLines++; // Linea per il prezzo
      if (product.price_variant_2_name) variantLines++; // Linea per il nome
    }
    
    if (variantLines > 0) {
      priceColumnHeight += (variantsLineHeight * variantLines) + 
                          (variantsMargins.top + variantsMargins.bottom) * MM_TO_PX;
    }
  }

  // Usa l'altezza maggiore tra contenuto principale e colonna prezzo
  // ma aggiungi un margine di sicurezza
  totalHeight = Math.max(totalHeight, priceColumnHeight) + 5; // 5px di margine extra

  // 7. Spacing tra prodotti (non aggiungere all'ultimo prodotto della pagina)
  const spacing = customLayout.spacing?.betweenProducts || 15;
  totalHeight += spacing * MM_TO_PX;

  // Aggiungi un piccolo buffer per sicurezza (2mm)
  totalHeight += 2 * MM_TO_PX;

  console.log('🔧 ProductHeightCalculator - Final total height:', totalHeight, 'px');

  return totalHeight;
};
