
import { supabase } from "@/integrations/supabase/client";
import { PrintLayout } from "@/types/printLayout";
import { transformDbToLayout } from "./layoutTransformer";
import { initializeDefaultLayouts } from "./layoutInitializer";

export const fetchLayoutsFromSupabase = async (): Promise<{
  layouts: PrintLayout[];
  defaultLayout: PrintLayout | null;
  error: string | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('print_layouts')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Errore nel recupero dei layout da Supabase:", error);
      return {
        layouts: [],
        defaultLayout: null,
        error: `Errore nel recupero dei layout: ${error.message}`
      };
    }

    // Se non ci sono layout, inizializza con quelli predefiniti
    if (!data || data.length === 0) {
      console.log("Nessun layout trovato, inizializzo con i layout predefiniti");
      const { success, layouts } = await initializeDefaultLayouts();
      
      if (!success || !layouts) {
        return {
          layouts: [],
          defaultLayout: null,
          error: "Errore nell'inizializzazione dei layout predefiniti"
        };
      }
      
      return {
        layouts,
        defaultLayout: layouts.find(layout => layout.isDefault) || layouts[0],
        error: null
      };
    }

    // Trasforma i dati dal formato DB al formato dell'applicazione
    const layouts = data.map(dbLayout => transformDbToLayout(dbLayout));
    const defaultLayout = layouts.find(layout => layout.isDefault) || layouts[0];

    return {
      layouts,
      defaultLayout,
      error: null
    };
  } catch (err) {
    console.error("Errore imprevisto durante il recupero dei layout:", err);
    return {
      layouts: [],
      defaultLayout: null,
      error: "Errore imprevisto durante il recupero dei layout"
    };
  }
};
