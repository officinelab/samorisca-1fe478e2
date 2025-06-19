
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

  // 3. Descrizione inglese (se presente e visibile) - usando description_en
  if (elements.descriptionEng?.visible !== false && product.description_en) {
    const descEngFontSize = elements.descriptionEng.fontSize || 11;
    const descEngLineHeight = descEngFontSize * 1.4;
    const descEngMargins = elements.descriptionEng.margin;
    
    const estimatedLines = Math.ceil((product.description_en.length || 0) / 80);
    totalHeight += (descEngLineHeight * estimatedLines) + (descEngMargins.top + descEngMargins.bottom) * MM_TO_PX;
  }

  // 4. Lista allergeni
  if (elements.allergensList?.visible !== false && product.allergens?.length > 0) {
    const allergensFontSize = elements.allergensList.fontSize || 10;
    const allergensLineHeight = allergensFontSize * 1.5;
    const allergensMargins = elements.allergensList.margin;
    totalHeight += allergensLineHeight + (allergensMargins.top + allergensMargins.bottom) * MM_TO_PX;
  }

  // 5. Caratteristiche prodotto (icone)
  if (elements.productFeatures && hasProductFeatures(product)) {
    const featuresConfig = elements.productFeatures;
    totalHeight += featuresConfig.iconSize + (featuresConfig.marginTop + featuresConfig.marginBottom) * MM_TO_PX;
  }

  // 6. Prezzo
  if (elements.price?.visible !== false) {
    const priceFontSize = elements.price.fontSize || 14;
    const priceLineHeight = priceFontSize * 1.5;
    const priceMargins = elements.price.margin;
    totalHeight += priceLineHeight + (priceMargins.top + priceMargins.bottom) * MM_TO_PX;
  }

  // 7. Varianti prezzo (se presenti) - usando has_multiple_prices e price_variant fields
  if (elements.priceVariants?.visible !== false && product.has_multiple_prices && 
      (product.price_variant_1_name || product.price_variant_2_name)) {
    const variantsFontSize = elements.priceVariants.fontSize || 12;
    const variantsLineHeight = variantsFontSize * 1.5;
    const variantsMargins = elements.priceVariants.margin;
    
    // Conta le varianti effettivamente presenti
    const variantCount = [product.price_variant_1_name, product.price_variant_2_name].filter(Boolean).length;
    totalHeight += (variantsLineHeight * variantCount) + 
                   (variantsMargins.top + variantsMargins.bottom) * MM_TO_PX;
  }

  // 8. Spacing tra prodotti
  const spacing = customLayout.spacing?.betweenProducts || 15;
  totalHeight += spacing * MM_TO_PX;

  return totalHeight;
};
