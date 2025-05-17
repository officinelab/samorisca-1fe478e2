
import { PrintLayout } from "@/types/printLayout";
import { saveLayoutToSupabase } from "../services/supabaseLayoutService";
import { ensureValidPageMargins } from "./layoutValidator";

/**
 * Salva in batch tutti i layout in Supabase (upsert seriale).
 * Restituisce successo solo se tutti i salvataggi sono andati a buon fine,
 * altrimenti ritorna l'elenco aggregato degli errori.
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
    // Ciclo seriale su tutti i layout, upsert su Supabase
    for (const layout of validatedLayouts) {
      const { success, error } = await saveLayoutToSupabase(layout);
      if (!success) {
        errors.push(`Layout ${layout.name} (${layout.id}): ${error}`);
      }
    }

    // Ritorna errore aggregato se almeno uno fallisce
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
