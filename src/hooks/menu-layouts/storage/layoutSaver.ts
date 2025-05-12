
import { PrintLayout } from "@/types/printLayout";
import { saveLayoutToSupabase } from "../services/supabaseLayoutService";
import { ensureValidPageMargins } from "./layoutValidator";

/**
 * Saves layouts to Supabase
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
    
    // Per ora salviamo solo l'ultimo layout modificato
    // In futuro potremmo implementare una sincronizzazione completa se necessario
    if (validatedLayouts.length > 0) {
      const lastLayout = validatedLayouts[validatedLayouts.length - 1];
      const { success, error } = await saveLayoutToSupabase(lastLayout);
      
      if (!success) {
        return {
          success: false,
          error: error || "Si è verificato un errore durante il salvataggio del layout."
        };
      }
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
