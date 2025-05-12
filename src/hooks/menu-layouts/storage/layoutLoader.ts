
import { PrintLayout } from "@/types/printLayout";
import { defaultLayouts } from "../utils/defaultLayouts";
import { fetchLayoutsFromSupabase } from "../services/supabaseLayoutService";

/**
 * Loads layouts from Supabase or defaults
 */
export const loadLayouts = async (): Promise<{ 
  layouts: PrintLayout[]; 
  defaultLayout: PrintLayout | null;
  error: string | null;
}> => {
  try {
    // Tenta di recuperare i layout da Supabase
    const { layouts, defaultLayout, error } = await fetchLayoutsFromSupabase();
    
    if (error) {
      console.error("Errore durante il caricamento dei layout:", error);
      
      // Fallback ai layout predefiniti in caso di errore
      const fallbackDefaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0] || null;
      
      return {
        layouts: defaultLayouts,
        defaultLayout: fallbackDefaultLayout,
        error: "Si è verificato un errore durante il caricamento dei layout. Utilizzando i layout predefiniti."
      };
    }
    
    return {
      layouts,
      defaultLayout,
      error: null
    };
  } catch (err) {
    console.error("Errore imprevisto durante il caricamento dei layout:", err);
    
    // Fallback ai layout predefiniti
    const defaultLayout = defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0] || null;
    
    return {
      layouts: defaultLayouts,
      defaultLayout,
      error: "Si è verificato un errore imprevisto durante il caricamento dei layout."
    };
  }
};
