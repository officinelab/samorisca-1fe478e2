
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "../defaultLayouts";
import { getLayoutsFromStorage, saveLayoutsToStorage } from "./localStorageManager";
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
      const defaultLayout = validatedLayouts.find((layout) => layout.isDefault) || validatedLayouts[0];
      
      return {
        layouts: validatedLayouts,
        defaultLayout,
        error: null
      };
    } else {
      // If no valid layouts are saved, use defaults
      const defaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0];
      
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
    const defaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0];
    
    return {
      layouts: defaultLayouts,
      defaultLayout,
      error: "Si è verificato un errore durante il caricamento dei layout."
    };
  }
};

/**
 * Saves layouts to localStorage
 */
export const saveLayouts = async (
  layouts: PrintLayout[]
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Validate input
    if (!layouts) {
      return { 
        success: false, 
        error: "Impossibile salvare layout null o undefined" 
      };
    }
    
    // Ensure all layouts have valid page margins
    const validatedLayouts = layouts.map(ensureValidPageMargins);
    
    const success = saveLayoutsToStorage(validatedLayouts);
    
    if (!success) {
      return {
        success: false,
        error: "Si è verificato un errore durante il salvataggio dei layout."
      };
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error("Errore durante il salvataggio dei layout:", err);
    return { 
      success: false, 
      error: "Si è verificato un errore durante il salvataggio dei layout." 
    };
  }
};
