
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
    
    // Stima il numero di righe basandosi sulla lunghezza del testo
    // Assumiamo ~80 caratteri per riga
    const estimatedLines = Math.ceil((product.description.length || 0) / 80);
    totalHeight += (descLineHeight * estimatedLines) + (descMargins.top + descMargins.bottom) * MM_TO_PX;
  }

  // 3. Descrizione inglese (se presente e visibile) - CORRETTA per usare description_en
  if (elements.descriptionEng?.visible !== false && shouldShowEnglishDescription(product)) {
    const descEngFontSize = elements.descriptionEng.fontSize || 11;
    const descEngLineHeight = descEngFontSize * 1.4;
    const descEngMargins = elements.descriptionEng.margin;
    
    const estimatedLines = Math.ceil((product.description_en!.length || 0) / 80);
    totalHeight += (descEngLineHeight * estimatedLines) + (descEngMargins.top + descEngMargins.bottom) * MM_TO_PX;
  }

  // 4. Lista allergeni
  if (elements.allergensList?.visible !== false && product.allergens?.length > 0) {
    const allergensFontSize = elements.allergensList.fontSize || 10;
    const allergensLineHeight = allergensFontSize * 1.5;
    const allergensMargins = elements.allergensList.margin;
    totalHeight += allergensLineHeight + (allergensMargins.top + allergensMargins.bottom) * MM_TO_PX;
  }

  // 5. Caratteristiche prodotto (icone) - CORRETTA per usare la configurazione corretta
  if (hasProductFeatures(product) && customLayout.productFeatures?.icon) {
    const featuresConfig = customLayout.productFeatures.icon;
    const iconHeightMm = featuresConfig.iconSize / MM_TO_PX * 0.75; // Conversione px -> mm più accurata
    totalHeight += iconHeightMm + (featuresConfig.marginTop + featuresConfig.marginBottom) * MM_TO_PX;
  }

  // 6. Prezzo - considera l'altezza della colonna prezzo più alta
  let priceColumnHeight = 0;
  
  // Prezzo principale
  if (elements.price?.visible !== false) {
    const priceFontSize = elements.price.fontSize || 14;
    const priceLineHeight = priceFontSize * 1.5;
    const priceMargins = elements.price.margin;
    priceColumnHeight += priceLineHeight + (priceMargins.top + priceMargins.bottom) * MM_TO_PX;
  }

  // Suffisso prezzo (se presente)
  if (product.has_price_suffix && product.price_suffix) {
    const suffixFontSize = elements.suffix.fontSize || 12;
    const suffixLineHeight = suffixFontSize * 1.5;
    priceColumnHeight += suffixLineHeight;
  }

  // Varianti prezzo (se presenti)
  if (product.has_multiple_prices && elements.priceVariants?.visible !== false) {
    const variantsFontSize = elements.priceVariants.fontSize || 12;
    const variantsLineHeight = variantsFontSize * 1.5;
    const variantsMargins = elements.priceVariants.margin;
    
    let variantCount = 0;
    if (product.price_variant_1_value) variantCount += 2; // prezzo + nome
    if (product.price_variant_2_value) variantCount += 2; // prezzo + nome
    
    priceColumnHeight += (variantsLineHeight * variantCount) + 
                        (variantsMargins.top + variantsMargins.bottom) * MM_TO_PX;
  }

  // Usa l'altezza maggiore tra contenuto principale e colonna prezzo
  totalHeight = Math.max(totalHeight, priceColumnHeight);

  // 7. Spacing tra prodotti
  const spacing = customLayout.spacing?.betweenProducts || 15;
  totalHeight += spacing * MM_TO_PX;

  return totalHeight;
};
