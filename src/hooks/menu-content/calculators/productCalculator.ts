
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight, MM_TO_PX } from '../utils/textMeasurement';

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
  
  // Calcola la larghezza disponibile per il contenuto
  const pageWidthMm = 210;
  const leftMargin = pageConfig.marginLeft || 25;
  const rightMargin = pageConfig.marginRight || 25;
  const contentWidthMm = pageWidthMm - leftMargin - rightMargin;
  
  // Schema 1: 90% per i dettagli del prodotto (aggiornato da 88%)
  const productDetailsWidthMm = contentWidthMm * 0.90;
  const productDetailsWidthPx = productDetailsWidthMm * MM_TO_PX;

  // Calcola altezza del titolo
  if (layout.elements.title?.visible !== false) {
    const titleFontSizePx = layout.elements.title.fontSize * 1.333;
    const titleHeightPx = calculateTextHeight(
      product.title,
      titleFontSizePx,
      layout.elements.title.fontFamily,
      productDetailsWidthPx,
      1.3
    );
    const titleHeightMm = titleHeightPx / MM_TO_PX;
    const titleMarginMm = layout.elements.title.margin.top + layout.elements.title.margin.bottom;
    totalHeightMm += titleHeightMm + titleMarginMm;
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
    const descHeightMm = descHeightPx / MM_TO_PX;
    const descMarginMm = layout.elements.description.margin.top + layout.elements.description.margin.bottom;
    totalHeightMm += descHeightMm + descMarginMm;
  }

  // Calcola altezza della descrizione inglese - CORRETTA per usare description_en
  if (shouldShowEnglishDescription(product) && layout.elements.descriptionEng?.visible !== false) {
    const descEngFontSizePx = layout.elements.descriptionEng.fontSize * 1.333;
    const descEngHeightPx = calculateTextHeight(
      product.description_en!,
      descEngFontSizePx,
      layout.elements.descriptionEng.fontFamily,
      productDetailsWidthPx,
      1.4
    );
    const descEngHeightMm = descEngHeightPx / MM_TO_PX;
    const descEngMarginMm = layout.elements.descriptionEng.margin.top + layout.elements.descriptionEng.margin.bottom;
    totalHeightMm += descEngHeightMm + descEngMarginMm;
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
    const allergensHeightMm = allergensHeightPx / MM_TO_PX;
    const allergensMarginMm = layout.elements.allergensList.margin.top + layout.elements.allergensList.margin.bottom;
    totalHeightMm += allergensHeightMm + allergensMarginMm;
  }

  // Calcola altezza delle caratteristiche prodotto (icone) - CORRETTA per usare la configurazione corretta
  if (product.features && product.features.length > 0 && layout.productFeatures?.icon) {
    const featuresConfig = layout.productFeatures.icon;
    const iconHeightMm = featuresConfig.iconSize / MM_TO_PX * 0.75; // Conversione più accurata
    const featuresMarginMm = featuresConfig.marginTop + featuresConfig.marginBottom;
    totalHeightMm += iconHeightMm + featuresMarginMm;
  }

  // Calcola l'altezza della colonna prezzo per confronto
  let priceColumnHeightMm = 0;
  
  // Prezzo principale
  if (layout.elements.price?.visible !== false) {
    const priceFontSizePx = layout.elements.price.fontSize * 1.333;
    const priceHeightMm = (priceFontSizePx * 1.5) / MM_TO_PX;
    const priceMarginMm = layout.elements.price.margin.top + layout.elements.price.margin.bottom;
    priceColumnHeightMm += priceHeightMm + priceMarginMm;
  }

  // Suffisso prezzo
  if (product.has_price_suffix && product.price_suffix) {
    const suffixFontSizePx = layout.elements.suffix.fontSize * 1.333;
    const suffixHeightMm = (suffixFontSizePx * 1.5) / MM_TO_PX;
    priceColumnHeightMm += suffixHeightMm;
  }

  // Varianti prezzo
  if (product.has_multiple_prices && layout.elements.priceVariants?.visible !== false) {
    const variantsFontSizePx = layout.elements.priceVariants.fontSize * 1.333;
    const variantsLineHeightMm = (variantsFontSizePx * 1.5) / MM_TO_PX;
    const variantsMarginMm = layout.elements.priceVariants.margin.top + layout.elements.priceVariants.margin.bottom;
    
    let variantLines = 0;
    if (product.price_variant_1_value) variantLines += 2; // prezzo + nome
    if (product.price_variant_2_value) variantLines += 2; // prezzo + nome
    
    priceColumnHeightMm += (variantsLineHeightMm * variantLines) + variantsMarginMm;
  }

  // Usa l'altezza maggiore tra le due colonne
  totalHeightMm = Math.max(totalHeightMm, priceColumnHeightMm);

  // Aggiungi spacing tra prodotti
  const spacingMm = layout.spacing?.betweenProducts || 15;
  totalHeightMm += spacingMm;

  // Aggiungi un buffer di sicurezza per evitare tagli
  const safetyBufferMm = 5;
  totalHeightMm += safetyBufferMm;

  return totalHeightMm;
};
