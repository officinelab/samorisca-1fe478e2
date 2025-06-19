
// CONVERSIONI UNIFICATE - Identiche all'anteprima di stampa
export const CONVERSIONS = {
  // Conversioni standard
  PT_TO_MM: 0.352778, // 1pt = 0.352778mm (standard tipografico)
  MM_TO_PT: 2.83465,  // 1mm = 2.83465pt
  PX_TO_MM: 0.264583, // 1px = 0.264583mm (96 DPI)
  MM_TO_PX: 3.77953,  // 1mm = 3.77953px (96 DPI)
  
  // Conversioni per jsPDF (che usa pt internamente)
  JSPDF_PT_TO_MM: 0.352778
};

import { PrintLayout } from '@/types/printLayout';

/**
 * Genera dimensioni IDENTICHE all'anteprima usando le stesse conversioni
 */
export const getStandardizedDimensions = (layout: PrintLayout) => {
  // ✅ FONT SIZES - Conversione identica CSS→PDF
  const css = {
    titleFontSize: layout.elements.title.fontSize,           // CSS usa pt direttamente
    descriptionFontSize: layout.elements.description.fontSize,
    descriptionEngFontSize: layout.elements.descriptionEng.fontSize,
    categoryFontSize: layout.elements.category.fontSize,
    priceFontSize: layout.elements.price.fontSize,
    suffixFontSize: layout.elements.suffix.fontSize,
    variantsFontSize: layout.elements.priceVariants.fontSize,
    allergensFontSize: layout.elements.allergensList.fontSize,
    serviceFontSize: layout.servicePrice.fontSize
  };

  // ✅ PDF FONT SIZES - Identici ai CSS
  const pdf = {
    titleFontSize: css.titleFontSize,        // jsPDF usa pt nativamente
    descriptionFontSize: css.descriptionFontSize,
    descriptionEngFontSize: css.descriptionEngFontSize,
    categoryFontSize: css.categoryFontSize,
    priceFontSize: css.priceFontSize,
    suffixFontSize: css.suffixFontSize,
    variantsFontSize: css.variantsFontSize,
    allergensFontSize: css.allergensFontSize,
    serviceFontSize: css.serviceFontSize
  };

  // ✅ MARGINI CSS - Conversione mm→px per anteprima
  const cssMargins = {
    title: {
      top: layout.elements.title.margin.top * CONVERSIONS.MM_TO_PX,
      bottom: layout.elements.title.margin.bottom * CONVERSIONS.MM_TO_PX,
      left: layout.elements.title.margin.left * CONVERSIONS.MM_TO_PX,
      right: layout.elements.title.margin.right * CONVERSIONS.MM_TO_PX
    },
    description: {
      top: layout.elements.description.margin.top * CONVERSIONS.MM_TO_PX,
      bottom: layout.elements.description.margin.bottom * CONVERSIONS.MM_TO_PX,
      left: layout.elements.description.margin.left * CONVERSIONS.MM_TO_PX,
      right: layout.elements.description.margin.right * CONVERSIONS.MM_TO_PX
    },
    descriptionEng: {
      top: layout.elements.descriptionEng.margin.top * CONVERSIONS.MM_TO_PX,
      bottom: layout.elements.descriptionEng.margin.bottom * CONVERSIONS.MM_TO_PX,
      left: layout.elements.descriptionEng.margin.left * CONVERSIONS.MM_TO_PX,
      right: layout.elements.descriptionEng.margin.right * CONVERSIONS.MM_TO_PX
    },
    category: {
      top: layout.elements.category.margin.top * CONVERSIONS.MM_TO_PX,
      bottom: layout.elements.category.margin.bottom * CONVERSIONS.MM_TO_PX,
      left: layout.elements.category.margin.left * CONVERSIONS.MM_TO_PX,
      right: layout.elements.category.margin.right * CONVERSIONS.MM_TO_PX
    },
    price: {
      top: layout.elements.price.margin.top * CONVERSIONS.MM_TO_PX,
      bottom: layout.elements.price.margin.bottom * CONVERSIONS.MM_TO_PX,
      left: layout.elements.price.margin.left * CONVERSIONS.MM_TO_PX,
      right: layout.elements.price.margin.right * CONVERSIONS.MM_TO_PX
    },
    variants: {
      top: layout.elements.priceVariants.margin.top * CONVERSIONS.MM_TO_PX,
      bottom: layout.elements.priceVariants.margin.bottom * CONVERSIONS.MM_TO_PX,
      left: layout.elements.priceVariants.margin.left * CONVERSIONS.MM_TO_PX,
      right: layout.elements.priceVariants.margin.right * CONVERSIONS.MM_TO_PX
    },
    allergens: {
      top: layout.elements.allergensList.margin.top * CONVERSIONS.MM_TO_PX,
      bottom: layout.elements.allergensList.margin.bottom * CONVERSIONS.MM_TO_PX,
      left: layout.elements.allergensList.margin.left * CONVERSIONS.MM_TO_PX,
      right: layout.elements.allergensList.margin.right * CONVERSIONS.MM_TO_PX
    },
    service: {
      top: layout.servicePrice.margin.top * CONVERSIONS.MM_TO_PX,
      bottom: layout.servicePrice.margin.bottom * CONVERSIONS.MM_TO_PX,
      left: layout.servicePrice.margin.left * CONVERSIONS.MM_TO_PX,
      right: layout.servicePrice.margin.right * CONVERSIONS.MM_TO_PX
    }
  };

  // ✅ MARGINI PDF - Identici al layout (già in mm)
  const pdfMargins = {
    title: layout.elements.title.margin,
    description: layout.elements.description.margin,
    descriptionEng: layout.elements.descriptionEng.margin,
    category: layout.elements.category.margin,
    price: layout.elements.price.margin,
    variants: layout.elements.priceVariants.margin,
    allergens: layout.elements.allergensList.margin,
    service: layout.servicePrice.margin
  };

  // ✅ ICONE - Conversioni identiche anteprima↔PDF
  const iconSizePx = layout.productFeatures.icon.iconSize;
  const iconSpacingPx = layout.productFeatures.icon.iconSpacing;
  const iconMarginTopMm = layout.productFeatures.icon.marginTop;
  const iconMarginBottomMm = layout.productFeatures.icon.marginBottom;

  const icons = {
    // CSS (per anteprima)
    cssSizePx: iconSizePx,
    cssSpacingPx: iconSpacingPx,
    cssMarginTopPx: iconMarginTopMm * CONVERSIONS.MM_TO_PX,
    cssMarginBottomPx: iconMarginBottomMm * CONVERSIONS.MM_TO_PX,
    
    // PDF (conversioni da px→mm)
    sizeMm: iconSizePx * CONVERSIONS.PX_TO_MM,
    spacingMm: iconSpacingPx * CONVERSIONS.PX_TO_MM,
    marginTopMm: iconMarginTopMm,
    marginBottomMm: iconMarginBottomMm,
    
    // Altezza totale (per calcoli)
    heightMm: iconMarginTopMm + (iconSizePx * CONVERSIONS.PX_TO_MM) + iconMarginBottomMm
  };

  // ✅ SPACING - Identico anteprima↔PDF
  const spacing = {
    betweenProducts: layout.spacing.betweenProducts,                    // mm
    betweenCategories: layout.spacing.betweenCategories,                // mm
    categoryTitleBottomMargin: layout.spacing.categoryTitleBottomMargin // mm
  };

  return {
    css,
    pdf,
    cssMargins,
    pdfMargins,
    icons,
    spacing
  };
};
