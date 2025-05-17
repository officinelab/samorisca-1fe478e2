
import { PrintLayout } from "@/types/printLayout";
import { saveLayoutToSupabase } from "../services/supabaseLayoutService";
import { ensureValidPageMargins } from "./layoutValidator";

/**
 * Old behavior: saves only one layout
 * New: iterates all, salva (upsert) tutti i layout (seriale)
 * Ritorna errore aggregato se almeno uno fallisce
 */
export const saveLayouts = async (
  layouts: PrintLayout[]
): Promise<{ success: boolean; error: string | null }> => {
  try {
    if (!layouts || layouts.length === 0) {
      return {
        success: false,
        error: "Impossibile salvare layout null o lista vuota"
      };
    }

    // Valida e normalizza tutti i layout PRIMA di procedere
    const validatedLayouts = layouts.map(ensureValidPageMargins);

    let errors: string[] = [];
    // Ciclo seriale (puoi cambiare in parallelo se vuoi, attenzione a Supabase API rate limit)
    for (const layout of validatedLayouts) {
      const { success, error } = await saveLayoutToSupabase(layout);
      if (!success) {
        errors.push(`Layout ${layout.name} (${layout.id}): ${error}`);
      }
    }

    // Ritorna errore aggregato se almeno una save fallisce
    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join("; ")
      };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Errore durante il salvataggio dei layout:", err);
    return {
      success: false,
      error: `Si è verificato un errore durante il salvataggio dei layout: ${err}`
    };
  }
};

