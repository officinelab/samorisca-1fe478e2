
import { PrintLayout } from "@/types/printLayout";
import { saveLayoutsToStorage } from "./localStorageManager";
import { ensureValidPageMargins } from "./layoutValidator";

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
