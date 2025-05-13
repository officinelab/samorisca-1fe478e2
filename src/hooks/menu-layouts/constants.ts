
// Chiave per il localStorage
export const LAYOUTS_STORAGE_KEY = "menu_print_layouts";

// Costanti per i calcoli di stampa
export const PRINT_CONSTANTS = {
  // Fattore di conversione da millimetri a pixel (calibrato per visualizzazione web)
  MM_TO_PX: 3.85,
  
  // Dimensioni standard foglio A4 in millimetri
  A4_WIDTH_MM: 210,
  A4_HEIGHT_MM: 297,
  
  // Margini predefiniti in millimetri
  DEFAULT_MARGINS: {
    TOP: 20,
    RIGHT: 15,
    BOTTOM: 20,
    LEFT: 15
  },
  
  // Altezze stimate di elementi comuni in pixel
  ESTIMATED_HEIGHTS: {
    CATEGORY_TITLE: 60,
    PRODUCT_BASE: 35,
    PRODUCT_DESCRIPTION_SHORT: 25,
    PRODUCT_DESCRIPTION_MEDIUM: 35,
    PRODUCT_DESCRIPTION_LONG: 50,
    PRODUCT_ALLERGENS: 15,
    PRODUCT_PRICE_VARIANTS: 25
  },
  
  // Spazi tra elementi in millimetri
  SPACING: {
    BETWEEN_CATEGORIES: 18,
    BETWEEN_PRODUCTS: 6
  }
};
