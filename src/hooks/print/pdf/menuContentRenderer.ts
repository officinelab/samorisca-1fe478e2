
import jsPDF from 'jspdf';
import { PrintLayout, PageMargins } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';

// Convert hex to RGB for jsPDF
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Map font family for jsPDF
const mapFontFamily = (fontFamily: string): string => {
  const cleanFont = fontFamily.replace(/['"]/g, '').toLowerCase();
  
  if (cleanFont.includes('times') || (cleanFont.includes('serif') && !cleanFont.includes('sans'))) {
    return 'times';
  } else if (cleanFont.includes('courier') || cleanFont.includes('mono')) {
    return 'courier';
  } else {
    return 'helvetica';
  }
};

// Map font style for jsPDF
const mapFontStyle = (fontStyle: string): string => {
  const style = fontStyle?.toLowerCase() || '';
  if (style.includes('bold') && style.includes('italic')) return 'bolditalic';
  if (style.includes('bold')) return 'bold';
  if (style.includes('italic')) return 'italic';
  return 'normal';
};

// Add text with proper styling
const addStyledText = (
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  config: {
    fontSize: number;
    fontFamily: string;
    fontStyle: string;
    fontColor: string;
    alignment?: 'left' | 'center' | 'right';
    maxWidth?: number;
  }
): number => {
  const color = hexToRgb(config.fontColor);
  pdf.setTextColor(color.r, color.g, color.b);
  pdf.setFontSize(config.fontSize);
  
  const mappedFont = mapFontFamily(config.fontFamily);
  const mappedStyle = mapFontStyle(config.fontStyle);
  
  try {
    pdf.setFont(mappedFont, mappedStyle);
  } catch (e) {
    console.warn(`Font ${mappedFont} with style ${mappedStyle} not available, using helvetica`);
    pdf.setFont('helvetica', mappedStyle);
  }
  
  // Handle text wrapping if maxWidth is provided
  if (config.maxWidth) {
    const lines = pdf.splitTextToSize(text, config.maxWidth);
    const lineHeight = config.fontSize * 0.35; // mm
    
    lines.forEach((line: string, index: number) => {
      pdf.text(line, x, y + (index * lineHeight), { align: config.alignment || 'left' });
    });
    
    return lines.length * lineHeight;
  } else {
    pdf.text(text, x, y, { align: config.alignment || 'left' });
    return config.fontSize * 0.35; // Return approximate height in mm
  }
};

// Add category title to PDF
export const addCategoryToPdf = (
  pdf: jsPDF,
  category: Category,
  x: number,
  y: number,
  layout: PrintLayout,
  maxWidth: number
): number => {
  const categoryConfig = layout.elements.category;
  
  const textHeight = addStyledText(pdf, category.title, x, y, {
    fontSize: categoryConfig.fontSize,
    fontFamily: categoryConfig.fontFamily,
    fontStyle: categoryConfig.fontStyle,
    fontColor: categoryConfig.fontColor,
    alignment: categoryConfig.alignment,
    maxWidth
  });
  
  return textHeight + layout.spacing.categoryTitleBottomMargin;
};

// Add category notes to PDF
export const addCategoryNotesToPdf = (
  pdf: jsPDF,
  notes: CategoryNote[],
  x: number,
  y: number,
  layout: PrintLayout,
  maxWidth: number
): number => {
  if (notes.length === 0) return 0;
  
  let currentY = y;
  const notesConfig = layout.categoryNotes;
  
  notes.forEach((note, index) => {
    // Add note title
    const titleHeight = addStyledText(pdf, note.title, x, currentY, {
      fontSize: notesConfig.title.fontSize,
      fontFamily: notesConfig.title.fontFamily,
      fontStyle: notesConfig.title.fontStyle,
      fontColor: notesConfig.title.fontColor,
      alignment: notesConfig.title.alignment,
      maxWidth
    });
    
    currentY += titleHeight + notesConfig.title.margin.bottom;
    
    // Add note text
    const textHeight = addStyledText(pdf, note.text, x, currentY, {
      fontSize: notesConfig.text.fontSize,
      fontFamily: notesConfig.text.fontFamily,
      fontStyle: notesConfig.text.fontStyle,
      fontColor: notesConfig.text.fontColor,
      alignment: notesConfig.text.alignment,
      maxWidth
    });
    
    currentY += textHeight + (index < notes.length - 1 ? 5 : 0); // 5mm spacing between notes
  });
  
  return currentY - y;
};

// Add product features icons (simplified for now)
const addProductFeaturesToPdf = (
  pdf: jsPDF,
  product: Product,
  x: number,
  y: number,
  layout: PrintLayout
): number => {
  if (!product.features || product.features.length === 0) return 0;
  
  const featuresConfig = layout.elements.productFeatures;
  const iconSize = featuresConfig.iconSize / 3.78; // Convert px to mm
  const iconSpacing = featuresConfig.iconSpacing / 3.78; // Convert px to mm
  
  let currentX = x;
  
  // For now, just add simple text representation of features
  // In a full implementation, you would load and add actual icons
  product.features.forEach((feature, index) => {
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`[${feature.title}]`, currentX, y);
    currentX += iconSize + iconSpacing;
  });
  
  return featuresConfig.marginTop + featuresConfig.marginBottom;
};

// Add product to PDF
export const addProductToPdf = (
  pdf: jsPDF,
  product: Product,
  x: number,
  y: number,
  layout: PrintLayout,
  contentWidth: number,
  isLast: boolean
): number => {
  let currentY = y;
  const elements = layout.elements;
  
  // Calculate columns (90% for content, 10% for price)
  const contentColumnWidth = contentWidth * 0.9;
  const priceColumnX = x + contentColumnWidth;
  const priceColumnWidth = contentWidth * 0.1;
  
  // Product title
  const titleHeight = addStyledText(pdf, product.title, x, currentY, {
    fontSize: elements.title.fontSize,
    fontFamily: elements.title.fontFamily,
    fontStyle: elements.title.fontStyle,
    fontColor: elements.title.fontColor,
    alignment: elements.title.alignment,
    maxWidth: contentColumnWidth
  });
  currentY += titleHeight + elements.title.margin.bottom;
  
  // Product description (Italian)
  if (product.description) {
    const descHeight = addStyledText(pdf, product.description, x, currentY, {
      fontSize: elements.description.fontSize,
      fontFamily: elements.description.fontFamily,
      fontStyle: elements.description.fontStyle,
      fontColor: elements.description.fontColor,
      alignment: elements.description.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descHeight + elements.description.margin.bottom;
  }
  
  // Product description (English) if different
  if (product.description_en && product.description_en !== product.description) {
    const descEngHeight = addStyledText(pdf, product.description_en, x, currentY, {
      fontSize: elements.descriptionEng.fontSize,
      fontFamily: elements.descriptionEng.fontFamily,
      fontStyle: elements.descriptionEng.fontStyle,
      fontColor: elements.descriptionEng.fontColor,
      alignment: elements.descriptionEng.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += descEngHeight + elements.descriptionEng.margin.bottom;
  }
  
  // Product features
  if (product.features && product.features.length > 0) {
    const featuresHeight = addProductFeaturesToPdf(pdf, product, x, currentY, layout);
    currentY += featuresHeight;
  }
  
  // Allergens
  if (product.allergens && product.allergens.length > 0) {
    const allergensText = product.allergens.map(a => a.number).join(', ');
    const allergensHeight = addStyledText(pdf, allergensText, x, currentY, {
      fontSize: elements.allergensList.fontSize,
      fontFamily: elements.allergensList.fontFamily,
      fontStyle: elements.allergensList.fontStyle,
      fontColor: elements.allergensList.fontColor,
      alignment: elements.allergensList.alignment,
      maxWidth: contentColumnWidth
    });
    currentY += allergensHeight + elements.allergensList.margin.bottom;
  }
  
  // Price (in right column)
  let priceY = y; // Start price at same level as title
  
  if (product.price_standard) {
    const priceText = `€${product.price_standard.toFixed(2)}`;
    addStyledText(pdf, priceText, priceColumnX, priceY, {
      fontSize: elements.price.fontSize,
      fontFamily: elements.price.fontFamily,
      fontStyle: elements.price.fontStyle,
      fontColor: elements.price.fontColor,
      alignment: 'right',
      maxWidth: priceColumnWidth
    });
    
    // Price suffix
    if (product.has_price_suffix && product.price_suffix) {
      priceY += elements.price.fontSize * 0.35;
      addStyledText(pdf, product.price_suffix, priceColumnX, priceY, {
        fontSize: elements.suffix.fontSize,
        fontFamily: elements.suffix.fontFamily,
        fontStyle: elements.suffix.fontStyle,
        fontColor: elements.suffix.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
  }
  
  // Price variants
  if (product.has_multiple_prices) {
    if (product.price_variant_1_value && product.price_variant_1_name) {
      priceY += 8; // mm spacing
      const variant1Text = `${product.price_variant_1_name}: €${product.price_variant_1_value.toFixed(2)}`;
      addStyledText(pdf, variant1Text, priceColumnX, priceY, {
        fontSize: elements.priceVariants.fontSize,
        fontFamily: elements.priceVariants.fontFamily,
        fontStyle: elements.priceVariants.fontStyle,
        fontColor: elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
    
    if (product.price_variant_2_value && product.price_variant_2_name) {
      priceY += 6; // mm spacing
      const variant2Text = `${product.price_variant_2_name}: €${product.price_variant_2_value.toFixed(2)}`;
      addStyledText(pdf, variant2Text, priceColumnX, priceY, {
        fontSize: elements.priceVariants.fontSize,
        fontFamily: elements.priceVariants.fontFamily,
        fontStyle: elements.priceVariants.fontStyle,
        fontColor: elements.priceVariants.fontColor,
        alignment: 'right',
        maxWidth: priceColumnWidth
      });
    }
  }
  
  // Add spacing between products (except for last product)
  if (!isLast) {
    currentY += layout.spacing.betweenProducts;
  }
  
  return currentY - y;
};

// Add service charge line to PDF
export const addServiceChargeToPdf = (
  pdf: jsPDF,
  serviceCharge: number,
  x: number,
  y: number,
  layout: PrintLayout,
  contentWidth: number
): number => {
  const serviceConfig = layout.servicePrice;
  
  // Draw border line
  pdf.setDrawColor(229, 231, 235); // #e5e7eb
  pdf.setLineWidth(0.1);
  pdf.line(x, y, x + contentWidth, y);
  
  const textY = y + 4; // 4mm padding after border
  const serviceText = `Servizio e Coperto = €${serviceCharge.toFixed(2)}`;
  
  const textHeight = addStyledText(pdf, serviceText, x, textY, {
    fontSize: serviceConfig.fontSize,
    fontFamily: serviceConfig.fontFamily,
    fontStyle: serviceConfig.fontStyle,
    fontColor: serviceConfig.fontColor,
    alignment: serviceConfig.alignment,
    maxWidth: contentWidth
  });
  
  return textHeight + serviceConfig.margin.top + serviceConfig.margin.bottom + 4; // Include padding
};
