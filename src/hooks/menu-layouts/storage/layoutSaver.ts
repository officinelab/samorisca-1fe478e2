
import { PrintLayout } from "@/types/printLayout";
import { saveLayoutToSupabase } from "../services/supabaseLayoutService";
import { ensureValidPageMargins } from "./layoutValidator";

/**
 * Salva tutti i layout su Supabase. NON solo l’ultimo!
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
    
    let allSucceeded = true;
    let lastError: string | null = null;

    // Salva TUTTI i layout (eseguendo batch in futuro)
    for (const layout of validatedLayouts) {
      const { success, error } = await saveLayoutToSupabase(layout);
      if (!success) {
        allSucceeded = false;
        lastError = error || "Errore salvataggio layout.";
      }
    }
    
    return { success: allSucceeded, error: lastError };
  } catch (err) {
    console.error("Errore durante il salvataggio dei layout:", err);
    return { 
      success: false, 
      error: "Si è verificato un errore durante il salvataggio dei layout." 
    };
  }
};
