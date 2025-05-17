
import { PX_PER_MM } from "@/hooks/menu-print/printUnits";
// Chiave per il localStorage
export const LAYOUTS_STORAGE_KEY = "menu_print_layouts";

// Costanti per i calcoli di stampa coerenti con altri helper
export const PRINT_CONSTANTS = {
  // Conversione da mm a px. Valore effettivo usato solo come fallback/SSR.
  MM_TO_PX: PX_PER_MM, // Importa solo per retrocompatibilità, ma si usa PX_PER_MM da printUnits
  
  // Dimensioni standard foglio A4 in millimetri
  A4_WIDTH_MM: 210,
  A4_HEIGHT_MM: 297,
  
  // Margini predefiniti (sempre coerenti con PrintLayout.page)
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
