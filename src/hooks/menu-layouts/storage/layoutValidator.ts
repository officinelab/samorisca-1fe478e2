
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";

/**
 * Validates a loaded layout or array of layouts
 */
export const validateLayouts = (data: unknown): boolean => {
  if (!data) return false;
  
  // Array validation
  if (Array.isArray(data)) {
    if (data.length === 0) return false;
    return data.every(layout => validateSingleLayout(layout));
  }
  
  // Single layout validation
  return validateSingleLayout(data as PrintLayout);
};

/**
 * Validates a single layout object
 */
const validateSingleLayout = (layout: unknown): boolean => {
  if (!layout || typeof layout !== 'object') return false;
  
  const l = layout as PrintLayout;
  
  // Required basic properties
  const hasBasicProps = 
    typeof l.id === 'string' && 
    typeof l.name === 'string' && 
    typeof l.type === 'string' &&
    typeof l.isDefault === 'boolean';
  
  if (!hasBasicProps) return false;
  
  // Elements validation
  if (!l.elements || typeof l.elements !== 'object') return false;
  
  const requiredElements = ['category', 'title', 'description', 'price', 'allergensList', 'priceVariants'];
  const hasAllElements = requiredElements.every(
    elem => l.elements[elem as keyof typeof l.elements] && 
    validateElementConfig(l.elements[elem as keyof typeof l.elements])
  );
  
  if (!hasAllElements) return false;
  
  // Spacing validation
  if (!l.spacing || 
      typeof l.spacing.betweenCategories !== 'number' ||
      typeof l.spacing.betweenProducts !== 'number' ||
      typeof l.spacing.categoryTitleBottomMargin !== 'number') {
    return false;
  }
  
  // Page margins validation
  if (!l.page || 
      typeof l.page.marginTop !== 'number' ||
      typeof l.page.marginRight !== 'number' ||
      typeof l.page.marginBottom !== 'number' ||
      typeof l.page.marginLeft !== 'number') {
    return false;
  }
  
  // Validazioni specifiche per copertina e allergeni sono opzionali
  // perché stiamo aggiornando il formato e potremmo avere layout vecchi
  
  return true;
};

/**
 * Validates an element configuration
 */
const validateElementConfig = (config: unknown): boolean => {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as PrintLayoutElementConfig;
  
  const hasRequiredProps = 
    typeof c.visible === 'boolean' &&
    typeof c.fontFamily === 'string' &&
    typeof c.fontSize === 'number' &&
    typeof c.fontColor === 'string' &&
    typeof c.fontStyle === 'string' &&
    typeof c.alignment === 'string';
    
  if (!hasRequiredProps) return false;
  
  // Margin validation
  if (!c.margin || 
      typeof c.margin.top !== 'number' ||
      typeof c.margin.right !== 'number' ||
      typeof c.margin.bottom !== 'number' ||
      typeof c.margin.left !== 'number') {
    return false;
  }
  
  return true;
};

/**
 * Ensure the layout has valid page margins, adds defaults if missing
 */
export const ensureValidPageMargins = (layout: PrintLayout): PrintLayout => {
  // Create a new object to avoid mutating the input
  const result = { ...layout };
  
  // Ensure useDistinctMarginsForPages exists
  if (typeof result.page.useDistinctMarginsForPages !== 'boolean') {
    result.page.useDistinctMarginsForPages = false;
  }
  
  // Ensure oddPages exists with valid values
  if (!result.page.oddPages) {
    result.page.oddPages = {
      marginTop: result.page.marginTop,
      marginRight: result.page.marginRight,
      marginBottom: result.page.marginBottom,
      marginLeft: result.page.marginLeft
    };
  }
  
  // Ensure evenPages exists with valid values
  if (!result.page.evenPages) {
    result.page.evenPages = {
      marginTop: result.page.marginTop,
      marginRight: result.page.marginRight,
      marginBottom: result.page.marginBottom,
      marginLeft: result.page.marginLeft
    };
  }
  
  // Ensure cover layout exists
  if (!result.cover) {
    result.cover = {
      logo: {
        maxWidth: 80,
        maxHeight: 50,
        alignment: 'center',
        marginTop: 20,
        marginBottom: 20
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 24,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 20, right: 0, bottom: 10, left: 0 }
      },
      subtitle: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "center",
        margin: { top: 5, right: 0, bottom: 0, left: 0 }
      }
    };
  }
  
  // Ensure allergens layout exists
  if (!result.allergens) {
    result.allergens = {
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 22,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 15, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 15, left: 0 }
      },
      item: {
        number: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 14,
          fontColor: "#000000",
          fontStyle: "bold",
          alignment: "left",
          margin: { top: 0, right: 8, bottom: 0, left: 0 }
        },
        title: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 14,
          fontColor: "#333333",
          fontStyle: "normal",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        spacing: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 4,
        padding: 8
      }
    };
  }
  
  return result;
};
