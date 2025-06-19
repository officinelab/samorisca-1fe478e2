
// Utility per conversioni standardizzate tra unità di misura

// Costanti di conversione standardizzate
export const CONVERSIONS = {
  MM_TO_PX: 3.7795275591,    // 1mm = 3.78px @ 96DPI
  PX_TO_MM: 0.26458333,      // 1px = 0.264mm @ 96DPI
  PT_TO_MM: 0.352778,        // 1pt = 0.353mm
  MM_TO_PT: 2.834645,        // 1mm = 2.83pt
  PT_TO_PX: 1.333333,        // 1pt = 1.33px @ 96DPI
  PX_TO_PT: 0.75             // 1px = 0.75pt @ 96DPI
};

// Conversione font size da pt (layout) a dimensioni CSS/PDF
export const convertFontSize = {
  // Per CSS (anteprima): pt -> px
  toCssPx: (fontSizePt: number): number => fontSizePt * CONVERSIONS.PT_TO_PX,
  
  // Per PDF: pt rimane pt (jsPDF usa pt nativamente)
  toPdfPt: (fontSizePt: number): number => fontSizePt,
  
  // Per calcoli altezza: pt -> mm
  toMm: (fontSizePt: number): number => fontSizePt * CONVERSIONS.PT_TO_MM
};

// Conversione margini da mm (layout) a dimensioni CSS/PDF
export const convertMargins = {
  // Per CSS (anteprima): mm -> px per i margini CSS
  toCssPx: (marginMm: number): number => marginMm * CONVERSIONS.MM_TO_PX,
  
  // Per PDF: mm rimane mm (jsPDF usa mm nativamente)
  toPdfMm: (marginMm: number): number => marginMm,
  
  // Per calcoli: mm -> px per compatibilità con calcoli esistenti
  toPx: (marginMm: number): number => marginMm * CONVERSIONS.MM_TO_PX
};

// Conversione icone da px (layout) a dimensioni CSS/PDF
export const convertIconSize = {
  // Per CSS (anteprima): px rimane px
  toCssPx: (iconSizePx: number): number => iconSizePx,
  
  // Per PDF: px -> mm (jsPDF usa mm)
  toPdfMm: (iconSizePx: number): number => iconSizePx * CONVERSIONS.PX_TO_MM,
  
  // Per calcoli altezza: px -> mm
  toMm: (iconSizePx: number): number => iconSizePx * CONVERSIONS.PX_TO_MM
};

// Funzioni di utilità per mantenere coerenza
export const getStandardizedDimensions = (layout: any) => {
  return {
    // Font sizes per CSS (anteprima)
    css: {
      categoryFontSize: convertFontSize.toCssPx(layout.elements.category.fontSize),
      titleFontSize: convertFontSize.toCssPx(layout.elements.title.fontSize),
      descriptionFontSize: convertFontSize.toCssPx(layout.elements.description.fontSize),
      descriptionEngFontSize: convertFontSize.toCssPx(layout.elements.descriptionEng.fontSize),
      allergensFontSize: convertFontSize.toCssPx(layout.elements.allergensList.fontSize),
      priceFontSize: convertFontSize.toCssPx(layout.elements.price.fontSize),
      suffixFontSize: convertFontSize.toCssPx(layout.elements.suffix.fontSize),
      variantsFontSize: convertFontSize.toCssPx(layout.elements.priceVariants.fontSize),
      serviceFontSize: convertFontSize.toCssPx(layout.servicePrice.fontSize),
    },
    
    // Font sizes per PDF (rimangono in pt)
    pdf: {
      categoryFontSize: convertFontSize.toPdfPt(layout.elements.category.fontSize),
      titleFontSize: convertFontSize.toPdfPt(layout.elements.title.fontSize),
      descriptionFontSize: convertFontSize.toPdfPt(layout.elements.description.fontSize),
      descriptionEngFontSize: convertFontSize.toPdfPt(layout.elements.descriptionEng.fontSize),
      allergensFontSize: convertFontSize.toPdfPt(layout.elements.allergensList.fontSize),
      priceFontSize: convertFontSize.toPdfPt(layout.elements.price.fontSize),
      suffixFontSize: convertFontSize.toPdfPt(layout.elements.suffix.fontSize),
      variantsFontSize: convertFontSize.toPdfPt(layout.elements.priceVariants.fontSize),
      serviceFontSize: convertFontSize.toPdfPt(layout.servicePrice.fontSize),
    },
    
    // Margini per CSS (anteprima)
    cssMargins: {
      category: {
        top: convertMargins.toCssPx(layout.elements.category.margin.top),
        bottom: convertMargins.toCssPx(layout.elements.category.margin.bottom),
        left: convertMargins.toCssPx(layout.elements.category.margin.left),
        right: convertMargins.toCssPx(layout.elements.category.margin.right),
      },
      title: {
        top: convertMargins.toCssPx(layout.elements.title.margin.top),
        bottom: convertMargins.toCssPx(layout.elements.title.margin.bottom),
        left: convertMargins.toCssPx(layout.elements.title.margin.left),
        right: convertMargins.toCssPx(layout.elements.title.margin.right),
      },
      description: {
        top: convertMargins.toCssPx(layout.elements.description.margin.top),
        bottom: convertMargins.toCssPx(layout.elements.description.margin.bottom),
        left: convertMargins.toCssPx(layout.elements.description.margin.left),
        right: convertMargins.toCssPx(layout.elements.description.margin.right),
      },
      descriptionEng: {
        top: convertMargins.toCssPx(layout.elements.descriptionEng.margin.top),
        bottom: convertMargins.toCssPx(layout.elements.descriptionEng.margin.bottom),
        left: convertMargins.toCssPx(layout.elements.descriptionEng.margin.left),
        right: convertMargins.toCssPx(layout.elements.descriptionEng.margin.right),
      },
      allergens: {
        top: convertMargins.toCssPx(layout.elements.allergensList.margin.top),
        bottom: convertMargins.toCssPx(layout.elements.allergensList.margin.bottom),
        left: convertMargins.toCssPx(layout.elements.allergensList.margin.left),
        right: convertMargins.toCssPx(layout.elements.allergensList.margin.right),
      },
      price: {
        top: convertMargins.toCssPx(layout.elements.price.margin.top),
        bottom: convertMargins.toCssPx(layout.elements.price.margin.bottom),
        left: convertMargins.toCssPx(layout.elements.price.margin.left),
        right: convertMargins.toCssPx(layout.elements.price.margin.right),
      },
      variants: {
        top: convertMargins.toCssPx(layout.elements.priceVariants.margin.top),
        bottom: convertMargins.toCssPx(layout.elements.priceVariants.margin.bottom),
        left: convertMargins.toCssPx(layout.elements.priceVariants.margin.left),
        right: convertMargins.toCssPx(layout.elements.priceVariants.margin.right),
      },
      service: {
        top: convertMargins.toCssPx(layout.servicePrice.margin.top),
        bottom: convertMargins.toCssPx(layout.servicePrice.margin.bottom),
        left: convertMargins.toCssPx(layout.servicePrice.margin.left),
        right: convertMargins.toCssPx(layout.servicePrice.margin.right),
      }
    },
    
    // Margini per PDF (rimangono in mm)
    pdfMargins: {
      category: layout.elements.category.margin,
      title: layout.elements.title.margin,
      description: layout.elements.description.margin,
      descriptionEng: layout.elements.descriptionEng.margin,
      allergens: layout.elements.allergensList.margin,
      price: layout.elements.price.margin,
      variants: layout.elements.priceVariants.margin,
      service: layout.servicePrice.margin,
    },
    
    // Icone
    icons: {
      // Per CSS (anteprima): px
      cssSizePx: convertIconSize.toCssPx(layout.productFeatures.icon.iconSize),
      cssMarginTopPx: convertMargins.toCssPx(layout.productFeatures.icon.marginTop),
      cssMarginBottomPx: convertMargins.toCssPx(layout.productFeatures.icon.marginBottom),
      cssSpacingPx: convertIconSize.toCssPx(layout.productFeatures.icon.iconSpacing),
      
      // Per PDF: mm
      pdfSizeMm: convertIconSize.toPdfMm(layout.productFeatures.icon.iconSize),
      pdfMarginTopMm: convertMargins.toPdfMm(layout.productFeatures.icon.marginTop),
      pdfMarginBottomMm: convertMargins.toPdfMm(layout.productFeatures.icon.marginBottom),
      pdfSpacingMm: convertIconSize.toPdfMm(layout.productFeatures.icon.iconSpacing),
      
      // Per calcoli: mm
      heightMm: convertIconSize.toMm(layout.productFeatures.icon.iconSize) + 
                convertMargins.toPx(layout.productFeatures.icon.marginTop) / CONVERSIONS.MM_TO_PX +
                convertMargins.toPx(layout.productFeatures.icon.marginBottom) / CONVERSIONS.MM_TO_PX
    },
    
    // Spacing
    spacing: {
      betweenCategories: layout.spacing.betweenCategories,
      betweenProducts: layout.spacing.betweenProducts,
      categoryTitleBottomMargin: layout.spacing.categoryTitleBottomMargin
    }
  };
};
