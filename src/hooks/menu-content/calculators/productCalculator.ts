import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight, MM_TO_PX } from '../utils/textMeasurement';

export const calculateProductHeight = (product: Product, layout: PrintLayout | null): number => {
  if (!layout) return 80; // Default height in mm

  let totalHeightMm = 0;
  const pageConfig = layout.page;
  
  // Calcola la larghezza disponibile per il contenuto
  const pageWidthMm = 210;
  const leftMargin = pageConfig.marginLeft || 25;
  const rightMargin = pageConfig.marginRight || 25;
  const contentWidthMm = pageWidthMm - leftMargin - rightMargin;
  
  // Schema 1: 90% per i dettagli del prodotto
  const productDetailsWidthMm = contentWidthMm * 0.9;
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

  // Calcola altezza della descrizione inglese
  if (product.description_en && 
      product.description_en !== product.description && 
      layout.elements.descriptionEng?.visible !== false) {
    const descEngFontSizePx = layout.elements.descriptionEng.fontSize * 1.333;
    const descEngHeightPx = calculateTextHeight(
      product.description_en,
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

  // Calcola altezza delle caratteristiche prodotto (icone)
  if (product.features && product.features.length > 0) {
    const featuresConfig = layout.elements.productFeatures;
    const iconHeightMm = featuresConfig.iconSize / MM_TO_PX;
    const featuresMarginMm = featuresConfig.marginTop + featuresConfig.marginBottom;
    totalHeightMm += iconHeightMm + featuresMarginMm;
  }

  // Calcola altezza delle varianti prezzo
  if (product.has_multiple_prices && (product.price_variant_1_name || product.price_variant_2_name) && 
      layout.elements.priceVariants?.visible !== false) {
    const variantsText = [
      product.price_variant_1_name ? `${product.price_variant_1_name}: €${product.price_variant_1_value?.toFixed(2)}` : '',
      product.price_variant_2_name ? `${product.price_variant_2_name}: €${product.price_variant_2_value?.toFixed(2)}` : ''
    ].filter(Boolean).join(' • ');
    
    const variantsFontSizePx = layout.elements.priceVariants.fontSize * 1.333;
    const variantsHeightPx = calculateTextHeight(
      variantsText,
      variantsFontSizePx,
      layout.elements.priceVariants.fontFamily,
      productDetailsWidthPx,
      1.5
    );
    const variantsHeightMm = variantsHeightPx / MM_TO_PX;
    const variantsMarginMm = layout.elements.priceVariants.margin.top + layout.elements.priceVariants.margin.bottom;
    totalHeightMm += variantsHeightMm + variantsMarginMm;
  }

  // Nota: Il prezzo è nella colonna del 10% quindi non influisce sull'altezza totale
  // perché è allineato con il titolo

  // Aggiungi un minimo di spacing per sicurezza
  totalHeightMm += 2; // 2mm di padding minimo

  return totalHeightMm;
};