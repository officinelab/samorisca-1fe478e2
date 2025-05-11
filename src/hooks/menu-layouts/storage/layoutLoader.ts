
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "../utils/defaultLayouts";
import { getLayoutsFromStorage } from "./localStorageManager";
import { validateLayouts, ensureValidPageMargins } from "./layoutValidator";

/**
 * Loads layouts from localStorage or defaults
 */
export const loadLayouts = async (): Promise<{ 
  layouts: PrintLayout[]; 
  defaultLayout: PrintLayout | null;
  error: string | null;
}> => {
  try {
    const savedLayouts = getLayoutsFromStorage();
    
    if (savedLayouts && validateLayouts(savedLayouts)) {
      // Ensure all layouts have valid page margins
      const validatedLayouts = (savedLayouts as PrintLayout[]).map(ensureValidPageMargins);
      
      // Find default layout
      const defaultLayout = validatedLayouts.find((layout) => layout.isDefault) || validatedLayouts[0] || null;
      
      return {
        layouts: validatedLayouts,
        defaultLayout,
        error: null
      };
    } else {
      // If no valid layouts are saved, use defaults
      const defaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0] || null;
      
      // Save the default layouts to localStorage for future use
      saveLayoutsToStorage(defaultLayouts);
      
      return {
        layouts: defaultLayouts,
        defaultLayout,
        error: null
      };
    }
  } catch (err) {
    console.error("Errore durante il caricamento dei layout:", err);
    
    // Fallback to default layouts
    const defaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0] || null;
    
    return {
      layouts: defaultLayouts,
      defaultLayout,
      error: "Si è verificato un errore durante il caricamento dei layout."
    };
  }
};

// Import the function to avoid circular references
import { saveLayoutsToStorage } from "./localStorageManager";
