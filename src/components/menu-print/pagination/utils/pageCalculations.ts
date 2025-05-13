
import { PrintLayout } from "@/types/printLayout";
import { Category, Product } from "@/types/database";
import { measureProductHeight as dynamicMeasureProductHeight } from "@/hooks/menu-layouts/utils/textMeasurement";

// More accurate conversion factor from millimeters to pixels
const MM_TO_PX = 3.78;

/**
 * Calculate available height for content (respecting margins)
 */
export const calculateAvailableHeight = (
  pageIndex: number, 
  A4_HEIGHT_MM: number, 
  customLayout?: PrintLayout | null,
  safetyMargin?: { vertical: number; horizontal: number }
): number => {
  let marginTop = 20;
  let marginBottom = 20;
  
  if (customLayout) {
    if (customLayout.page.useDistinctMarginsForPages) {
      if (pageIndex % 2 === 0) {
        // Odd page (1,3,5)
        marginTop = customLayout.page.oddPages?.marginTop || customLayout.page.marginTop;
        marginBottom = customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom;
      } else {
        // Even page (2,4,6)
        marginTop = customLayout.page.evenPages?.marginTop || customLayout.page.marginTop;
        marginBottom = customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom;
      }
    } else {
      marginTop = customLayout.page.marginTop;
      marginBottom = customLayout.page.marginBottom;
    }
  }
  
  // Subtract a small safety margin to avoid overfilling the page
  // Use custom safety margin if provided
  const verticalSafetyMargin = safetyMargin?.vertical || 5;
  return (A4_HEIGHT_MM - marginTop - marginBottom - verticalSafetyMargin) * MM_TO_PX;
};

/**
 * Estimate the height of a category title based on layout
 */
export const estimateCategoryTitleHeight = (customLayout?: PrintLayout | null): number => {
  if (!customLayout) return 30;
  
  // Increase slightly to ensure enough space
  const baseFontSize = customLayout.elements.category.fontSize * 1.5;
  const marginBottom = customLayout.spacing.categoryTitleBottomMargin;
  
  return (baseFontSize + marginBottom) * 1.2;
};

/**
 * Calculate product height using Canvas for precise measurements
 */
export const estimateProductHeight = (
  product: Product,
  language: string,
  customLayout?: PrintLayout | null,
  safetyMargin?: { vertical: number; horizontal: number }
): number => {
  // Use dynamic text measurement function
  try {
    // Calculate available width (approximated based on A4 format)
    // An A4 sheet is about 210mm wide, subtract side margins
    const marginLeft = customLayout?.page.marginLeft || 15;
    const marginRight = customLayout?.page.marginRight || 15;
    const horizontalSafetyMargin = safetyMargin?.horizontal || 0;
    const availableWidthMM = 210 - marginLeft - marginRight - (horizontalSafetyMargin * 2);
    const availableWidthPx = availableWidthMM * MM_TO_PX;
    
    // Configure font settings based on layout
    const fontSettings = customLayout ? {
      titleFont: {
        family: customLayout.elements.title.fontFamily || 'Arial',
        size: customLayout.elements.title.fontSize || 12,
        weight: customLayout.elements.title.fontStyle === 'bold' ? 'bold' : 'normal',
        style: customLayout.elements.title.fontStyle === 'italic' ? 'italic' : 'normal'
      },
      descriptionFont: {
        family: customLayout.elements.description.fontFamily || 'Arial',
        size: customLayout.elements.description.fontSize || 10,
        weight: customLayout.elements.description.fontStyle === 'bold' ? 'bold' : 'normal',
        style: customLayout.elements.description.fontStyle === 'italic' ? 'italic' : 'normal'
      }
    } : undefined;
    
    // Measure precise product height
    return dynamicMeasureProductHeight(product, language, availableWidthPx, fontSettings);
  } catch (error) {
    console.error('Error in dynamic product measurement:', error);
    
    // Fallback to previous method in case of errors
    // Base height for all products
    let height = 30;
    
    // Increase height if there's a description
    const hasDescription = !!product.description || !!product[`description_${language}`];
    if (hasDescription) {
      const descriptionText = (product[`description_${language}`] as string) || product.description || "";
      const descriptionLength = descriptionText.length;
      
      // Estimate description height based on text length
      if (descriptionLength > 200) {
        height += 60; // Very long descriptions
      } else if (descriptionLength > 100) {
        height += 40; // Long descriptions
      } else if (descriptionLength > 50) {
        height += 25; // Medium descriptions
      } else {
        height += 15; // Short descriptions
      }
    }
    
    // Increase height for multiple price variants
    if (product.has_multiple_prices) {
      height += 20;
    }
    
    // Increase height if product has allergens
    if (product.allergens && product.allergens.length > 0) {
      height += 10;
    }
    
    return height;
  }
};

/**
 * Filter selected categories from the complete list
 */
export const getFilteredCategories = (
  categories: Category[],
  selectedCategories: string[]
): Category[] => {
  return categories.filter(cat => selectedCategories.includes(cat.id));
};
