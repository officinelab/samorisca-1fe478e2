
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';

interface HeightCalculation {
  categoryTitle: number;
  categoryNote: number;
  product: number;
  serviceLine: number;
}

export const useHeightCalculator = (layout: PrintLayout | null) => {
  const MM_TO_PX = 3.78; // Conversion factor

  const calculateTextHeight = (
    text: string,
    fontSize: number,
    fontFamily: string,
    maxWidth: number,
    lineHeight: number = 1.2
  ): number => {
    if (!text) return 0;
    
    // Create a virtual canvas to measure text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return fontSize * lineHeight;

    context.font = `${fontSize}px ${fontFamily}`;
    const textWidth = context.textWidth(text);
    const lines = Math.ceil(textWidth / maxWidth) || 1;
    
    return lines * fontSize * lineHeight;
  };

  const calculateCategoryTitleHeight = (category: Category): number => {
    if (!layout) return 60; // Default height in pixels

    const categoryConfig = layout.elements.category;
    const availableWidth = 180; // A4 width minus margins in mm, converted to approximate text width
    
    const textHeight = calculateTextHeight(
      category.title,
      categoryConfig.fontSize,
      categoryConfig.fontFamily,
      availableWidth * MM_TO_PX
    );

    const totalMargin = categoryConfig.margin.top + categoryConfig.margin.bottom;
    const bottomSpacing = layout.spacing.categoryTitleBottomMargin;
    
    return (textHeight / MM_TO_PX) + totalMargin + bottomSpacing;
  };

  const calculateCategoryNoteHeight = (note: CategoryNote): number => {
    if (!layout) return 40; // Default height in mm

    const noteConfig = layout.categoryNotes;
    const availableWidth = 180; // A4 width minus margins in mm
    
    const titleHeight = calculateTextHeight(
      note.title,
      noteConfig.title.fontSize,
      noteConfig.title.fontFamily,
      availableWidth * MM_TO_PX
    );

    const textHeight = calculateTextHeight(
      note.text,
      noteConfig.text.fontSize,
      noteConfig.text.fontFamily,
      availableWidth * MM_TO_PX
    );

    const titleMargin = noteConfig.title.margin.top + noteConfig.title.margin.bottom;
    const textMargin = noteConfig.text.margin.top + noteConfig.text.margin.bottom;
    const iconHeight = noteConfig.icon.iconSize / MM_TO_PX;

    return ((titleHeight + textHeight) / MM_TO_PX) + titleMargin + textMargin + iconHeight + 5; // 5mm padding
  };

  const calculateProductHeight = (product: Product): number => {
    if (!layout) return 80; // Default height in mm

    let totalHeight = 0;
    const availableWidth = 162; // 90% of available width for product details (Schema 1)

    // Title height
    const titleHeight = calculateTextHeight(
      product.title,
      layout.elements.title.fontSize,
      layout.elements.title.fontFamily,
      availableWidth * MM_TO_PX
    );
    totalHeight += (titleHeight / MM_TO_PX) + layout.elements.title.margin.top + layout.elements.title.margin.bottom;

    // Description height (if present)
    if (product.description) {
      const descHeight = calculateTextHeight(
        product.description,
        layout.elements.description.fontSize,
        layout.elements.description.fontFamily,
        availableWidth * MM_TO_PX
      );
      totalHeight += (descHeight / MM_TO_PX) + layout.elements.description.margin.top + layout.elements.description.margin.bottom;
    }

    // English description height (if present) - would need to fetch from translations
    // For now, assuming similar to main description
    
    // Allergens height (if present)
    if (product.product_allergens && product.product_allergens.length > 0) {
      const allergensText = product.product_allergens.map(pa => pa.allergen_id).join(', ');
      const allergensHeight = calculateTextHeight(
        allergensText,
        layout.elements.allergensList.fontSize,
        layout.elements.allergensList.fontFamily,
        availableWidth * MM_TO_PX
      );
      totalHeight += (allergensHeight / MM_TO_PX) + layout.elements.allergensList.margin.top + layout.elements.allergensList.margin.bottom;
    }

    // Product features height (if present)
    if (product.features && product.features.length > 0) {
      const featuresHeight = layout.elements.productFeatures.marginTop + 
                           layout.elements.productFeatures.marginBottom +
                           (layout.elements.productFeatures.iconSize / MM_TO_PX);
      totalHeight += featuresHeight;
    }

    // Price variants height (if present)
    if (product.has_multiple_prices) {
      const priceVariantsHeight = calculateTextHeight(
        `${product.price_variant_1_name || ''} ${product.price_variant_2_name || ''}`,
        layout.elements.priceVariants.fontSize,
        layout.elements.priceVariants.fontFamily,
        availableWidth * MM_TO_PX
      );
      totalHeight += (priceVariantsHeight / MM_TO_PX) + layout.elements.priceVariants.margin.top + layout.elements.priceVariants.margin.bottom;
    }

    // Add minimum spacing
    totalHeight += 5; // 5mm minimum spacing

    return totalHeight;
  };

  const calculateServiceLineHeight = (): number => {
    if (!layout) return 15; // Default height in mm

    const serviceConfig = layout.servicePrice;
    const serviceText = "Servizio e Coperto = €";
    
    const textHeight = calculateTextHeight(
      serviceText,
      serviceConfig.fontSize,
      serviceConfig.fontFamily,
      180 * MM_TO_PX
    );

    return (textHeight / MM_TO_PX) + serviceConfig.margin.top + serviceConfig.margin.bottom + 5; // 5mm padding
  };

  const calculateHeights = (
    categories: Category[],
    productsByCategory: Record<string, Product[]>,
    categoryNotes: CategoryNote[],
    categoryNotesRelations: Record<string, string[]>
  ): HeightCalculation[] => {
    const calculations: HeightCalculation[] = [];

    categories.forEach(category => {
      const categoryHeight = calculateCategoryTitleHeight(category);
      
      // Calculate category notes height
      const relatedNoteIds = categoryNotesRelations[category.id] || [];
      const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
      const notesHeight = relatedNotes.reduce((sum, note) => sum + calculateCategoryNoteHeight(note), 0);

      const products = productsByCategory[category.id] || [];
      products.forEach(product => {
        const productHeight = calculateProductHeight(product);
        
        calculations.push({
          categoryTitle: categoryHeight,
          categoryNote: notesHeight,
          product: productHeight,
          serviceLine: calculateServiceLineHeight()
        });
      });
    });

    return calculations;
  };

  return {
    calculateCategoryTitleHeight,
    calculateCategoryNoteHeight,
    calculateProductHeight,
    calculateServiceLineHeight,
    calculateHeights
  };
};
