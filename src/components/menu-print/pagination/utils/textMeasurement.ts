
import { PrintLayout } from '@/types/printLayout';

// Cache for already calculated text heights to improve performance
const textHeightCache = new Map<string, number>();

/**
 * Calculates the height of text given font parameters and available width
 */
export const calculateTextHeight = (
  text: string,
  fontSize: number,
  fontFamily: string,
  availableWidth: number
): number => {
  // Generate cache key
  const cacheKey = `${text}-${fontSize}-${fontFamily}-${availableWidth}`;
  
  // Use cached value if available
  if (textHeightCache.has(cacheKey)) {
    return textHeightCache.get(cacheKey) || 0;
  }
  
  // Create temporary element to measure text height
  const tempElement = document.createElement('div');
  tempElement.style.position = 'absolute';
  tempElement.style.visibility = 'hidden';
  tempElement.style.fontFamily = fontFamily;
  tempElement.style.fontSize = `${fontSize}px`;
  tempElement.style.width = `${availableWidth}px`;
  tempElement.style.whiteSpace = 'normal';
  tempElement.style.lineHeight = '1.2'; // Default line height
  tempElement.textContent = text || '';
  
  document.body.appendChild(tempElement);
  const height = tempElement.offsetHeight;
  document.body.removeChild(tempElement);
  
  // Cache the result
  textHeightCache.set(cacheKey, height);
  
  return height;
};

/**
 * Returns the available width for content based on layout settings
 */
export const getAvailableWidth = (
  A4_WIDTH_MM: number,
  customLayout?: PrintLayout | null
): number => {
  if (!customLayout) return A4_WIDTH_MM - 30; // Default 15mm margins on each side
  
  const leftMargin = customLayout.page.marginLeft || 15;
  const rightMargin = customLayout.page.marginRight || 15;
  
  return A4_WIDTH_MM - (leftMargin + rightMargin);
};

/**
 * Clears the text height cache
 */
export const clearTextHeightCache = (): void => {
  textHeightCache.clear();
};
