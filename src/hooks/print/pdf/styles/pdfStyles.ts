
import { StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";
import { createPageStyles } from './pageStyles';
import { createCoverStyles } from './coverStyles';
import { createContentStyles } from './contentStyles';
import { createAllergensStyles } from './allergensStyles';

export const createPdfStyles = (customLayout?: PrintLayout | null) => {
  if (!customLayout) {
    return defaultStyles();
  }
  
  // Combine all style modules
  return StyleSheet.create({
    // Page styles
    ...createPageStyles(customLayout),
    
    // Cover page styles
    ...createCoverStyles(customLayout),
    
    // Content styles (categories, products)
    ...createContentStyles(customLayout),
    
    // Allergens styles
    ...createAllergensStyles(customLayout),
  });
};

// Default styles to use when no custom layout is provided
const defaultStyles = () => StyleSheet.create({
  // Page styles
  ...createPageStyles(null),
  
  // Cover page styles
  ...createCoverStyles(null),
  
  // Content styles (categories, products)
  ...createContentStyles(null),
  
  // Allergens styles
  ...createAllergensStyles(null),
});
