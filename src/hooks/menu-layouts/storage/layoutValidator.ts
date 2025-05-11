
import { PrintLayout } from "@/types/printLayout";

/**
 * Validates that the loaded data is a valid array of PrintLayout objects
 */
export const validateLayouts = (data: any): boolean => {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }
  
  // Ensure basic required properties exist on each layout
  return data.every(layout => 
    typeof layout === 'object' && 
    layout !== null &&
    'id' in layout &&
    'name' in layout &&
    'type' in layout &&
    'elements' in layout &&
    'spacing' in layout &&
    'page' in layout
  );
};

/**
 * Ensures all page margins are properly initialized
 */
export const ensureValidPageMargins = (layout: PrintLayout): PrintLayout => {
  // Set default values if not present
  const pageWithDefaults = {
    marginTop: layout.page.marginTop || 20,
    marginRight: layout.page.marginRight || 15,
    marginBottom: layout.page.marginBottom || 20,
    marginLeft: layout.page.marginLeft || 15,
    useDistinctMarginsForPages: layout.page.useDistinctMarginsForPages || false,
    oddPages: layout.page.oddPages || {
      marginTop: layout.page.marginTop || 20,
      marginRight: layout.page.marginRight || 15,
      marginBottom: layout.page.marginBottom || 20,
      marginLeft: layout.page.marginLeft || 15
    },
    evenPages: layout.page.evenPages || {
      marginTop: layout.page.marginTop || 20,
      marginRight: layout.page.marginRight || 15,
      marginBottom: layout.page.marginBottom || 20,
      marginLeft: layout.page.marginLeft || 15
    }
  };

  return {
    ...layout,
    page: pageWithDefaults
  };
};
